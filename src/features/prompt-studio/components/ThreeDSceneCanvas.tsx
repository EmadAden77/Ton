"use client";

import { Suspense, useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { BEDROOM_DESIGN, type RoomVec3 } from "../roomDesign";
import {
  getThreeDLighting,
  getThreeDPoseForState,
  getThreeDSelfieCamera,
  type ThreeDPoseConfig,
  type ThreeDSelfieCameraConfig,
  type Vec3,
} from "../threeDScene";
import type { SceneState } from "../types";

const XBOT_URL = "https://threejs.org/examples/models/gltf/Xbot.glb";

export type ThreeDViewMode = "viewer" | "selfie";

function mutableVec(value: RoomVec3): Vec3 {
  return [value[0], value[1], value[2]];
}

function Character({ pose }: { pose: ThreeDPoseConfig }) {
  const { scene } = useGLTF(XBOT_URL);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={pose.modelPosition}
      rotation={pose.modelRotation}
      scale={1}
    />
  );
}

function Phone({ position, target }: { position: Vec3; target: Vec3 }) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    groupRef.current?.lookAt(...target);
  }, [target]);

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.24, 0.025]} />
        <meshStandardMaterial color="#111111" metalness={0.75} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.105, 0.215]} />
        <meshBasicMaterial color="#b8dcff" />
      </mesh>
    </group>
  );
}

function ActiveCamera({
  pose,
  selfieCamera,
  viewMode,
}: {
  pose: ThreeDPoseConfig;
  selfieCamera: ThreeDSelfieCameraConfig;
  viewMode: ThreeDViewMode;
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const isSelfie = viewMode === "selfie";
  const position = isSelfie ? selfieCamera.position : pose.viewerPosition;
  const target = isSelfie ? selfieCamera.target : pose.viewerTarget;

  useEffect(() => {
    cameraRef.current?.lookAt(...target);
  }, [position, target]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={position}
      fov={isSelfie ? selfieCamera.fov : 48}
      near={isSelfie ? selfieCamera.near : 0.1}
      far={isSelfie ? selfieCamera.far : 30}
    />
  );
}

function TileFloor() {
  const { dimensions, bounds } = BEDROOM_DESIGN;
  const tileSize = 0.8;
  const xLines = Math.floor(dimensions.width / tileSize);
  const zLines = Math.floor(dimensions.depth / tileSize);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <meshStandardMaterial color="#d2c6b5" roughness={0.24} metalness={0.025} />
      </mesh>

      {Array.from({ length: xLines + 1 }, (_, index) => {
        const x = bounds.leftX + index * tileSize;
        return (
          <mesh key={`grout-x-${index}`} position={[x, 0.004, 0]} receiveShadow>
            <boxGeometry args={[0.008, 0.006, dimensions.depth]} />
            <meshStandardMaterial color="#aa9f91" roughness={0.8} />
          </mesh>
        );
      })}

      {Array.from({ length: zLines + 1 }, (_, index) => {
        const z = bounds.backZ + index * tileSize;
        return (
          <mesh key={`grout-z-${index}`} position={[0, 0.004, z]} receiveShadow>
            <boxGeometry args={[dimensions.width, 0.006, 0.008]} />
            <meshStandardMaterial color="#aa9f91" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function EngineeredShell() {
  const { dimensions, bounds, door } = BEDROOM_DESIGN;
  const wallColor = "#c8baa7";
  const wallThickness = 0.12;
  const doorLeft = door.position[0] - door.width / 2;
  const doorRight = door.position[0] + door.width / 2;
  const leftSegmentWidth = doorLeft - bounds.leftX;
  const rightSegmentWidth = bounds.rightX - doorRight;

  return (
    <group>
      <TileFloor />

      <mesh position={[0, dimensions.height / 2, bounds.backZ]} receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>
      <mesh position={[bounds.leftX, dimensions.height / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>
      <mesh position={[bounds.rightX, dimensions.height / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>

      <mesh
        position={[
          bounds.leftX + leftSegmentWidth / 2,
          dimensions.height / 2,
          bounds.frontZ,
        ]}
        receiveShadow
      >
        <boxGeometry args={[leftSegmentWidth, dimensions.height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>
      <mesh
        position={[
          doorRight + rightSegmentWidth / 2,
          dimensions.height / 2,
          bounds.frontZ,
        ]}
        receiveShadow
      >
        <boxGeometry args={[rightSegmentWidth, dimensions.height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>
      <mesh
        position={[
          door.position[0],
          door.height + (dimensions.height - door.height) / 2,
          bounds.frontZ,
        ]}
        receiveShadow
      >
        <boxGeometry args={[door.width, dimensions.height - door.height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.94} />
      </mesh>
      <mesh position={mutableVec(door.position)} castShadow receiveShadow>
        <boxGeometry args={[door.width, door.height, 0.08]} />
        <meshStandardMaterial color="#3a281f" roughness={0.72} />
      </mesh>
      <mesh position={[door.position[0] + 0.31, 1.02, bounds.frontZ - 0.05]}>
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshStandardMaterial color="#9f875f" metalness={0.72} roughness={0.3} />
      </mesh>

      <group position={[0, dimensions.height - 0.09, 0]}>
        <mesh position={[0, 0, bounds.backZ + 0.18]}>
          <boxGeometry args={[dimensions.width - 0.28, 0.14, 0.22]} />
          <meshStandardMaterial color="#e8e2da" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0, bounds.frontZ - 0.18]}>
          <boxGeometry args={[dimensions.width - 0.28, 0.14, 0.22]} />
          <meshStandardMaterial color="#e8e2da" roughness={0.88} />
        </mesh>
        <mesh position={[bounds.leftX + 0.18, 0, 0]}>
          <boxGeometry args={[0.22, 0.14, dimensions.depth - 0.28]} />
          <meshStandardMaterial color="#e8e2da" roughness={0.88} />
        </mesh>
        <mesh position={[bounds.rightX - 0.18, 0, 0]}>
          <boxGeometry args={[0.22, 0.14, dimensions.depth - 0.28]} />
          <meshStandardMaterial color="#e8e2da" roughness={0.88} />
        </mesh>
      </group>

      <group position={[0, dimensions.height - 0.2, -0.05]}>
        <mesh position={[0, 0, -2.15]}>
          <boxGeometry args={[4.25, 0.12, 0.16]} />
          <meshStandardMaterial color="#eee9e2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 2.15]}>
          <boxGeometry args={[4.25, 0.12, 0.16]} />
          <meshStandardMaterial color="#eee9e2" roughness={0.9} />
        </mesh>
        <mesh position={[-1.92, 0, 0]}>
          <boxGeometry args={[0.16, 0.12, 4.45]} />
          <meshStandardMaterial color="#eee9e2" roughness={0.9} />
        </mesh>
        <mesh position={[1.92, 0, 0]}>
          <boxGeometry args={[0.16, 0.12, 4.45]} />
          <meshStandardMaterial color="#eee9e2" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function Bed() {
  const { bed } = BEDROOM_DESIGN;
  const headFaceX = bed.headboardCenter[0] + bed.headboardThickness / 2 + 0.008;
  const pillowX = bed.center[0] - bed.mattressLength / 2 + 0.38;

  return (
    <group>
      <mesh
        position={[bed.center[0], bed.frameHeight / 2, bed.center[2]]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[bed.frameLength, bed.frameHeight, bed.frameWidth]} />
        <meshStandardMaterial color="#292727" roughness={0.86} />
      </mesh>

      <mesh
        position={[
          bed.center[0],
          bed.frameHeight + bed.mattressThickness / 2,
          bed.center[2],
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[bed.mattressLength, bed.mattressThickness, bed.mattressWidth]} />
        <meshStandardMaterial color="#d8d5cf" roughness={0.98} />
      </mesh>

      <mesh position={mutableVec(bed.headboardCenter)} castShadow receiveShadow>
        <boxGeometry
          args={[bed.headboardThickness, bed.headboardHeight, bed.headboardWidth]}
        />
        <meshStandardMaterial color="#292b2e" roughness={0.93} />
      </mesh>

      {[0.5, 0.76, 1.02].map((y) => (
        <mesh key={y} position={[headFaceX, y, bed.headboardCenter[2]]}>
          <boxGeometry args={[0.012, 0.015, bed.headboardWidth * 0.93]} />
          <meshStandardMaterial color="#191a1c" roughness={0.9} />
        </mesh>
      ))}

      {[-0.4, 0.4].map((zOffset, index) => (
        <mesh
          key={zOffset}
          position={[pillowX + index * 0.02, 0.7, bed.center[2] + zOffset]}
          rotation={[0.02, zOffset < 0 ? -0.05 : 0.04, -0.04]}
          castShadow
        >
          <boxGeometry args={[0.62, 0.15, bed.pillowDepth]} />
          <meshStandardMaterial color="#b9b9b6" roughness={0.99} />
        </mesh>
      ))}

      <mesh
        position={[bed.center[0] + 0.26, 0.61, bed.center[2] + 0.03]}
        rotation={[0, 0, -0.01]}
        castShadow
      >
        <boxGeometry args={[1.42, 0.105, 1.65]} />
        <meshStandardMaterial color="#66686b" roughness={0.98} />
      </mesh>

      <mesh
        position={[bed.center[0] - 0.38, 0.665, bed.center[2] + 0.02]}
        rotation={[0, 0, 0.018]}
        castShadow
      >
        <boxGeometry args={[0.32, 0.07, 1.62]} />
        <meshStandardMaterial color="#77797c" roughness={0.99} />
      </mesh>
    </group>
  );
}

function Nightstand({ lampIntensity }: { lampIntensity: number }) {
  const { nightstand } = BEDROOM_DESIGN;

  return (
    <group position={mutableVec(nightstand.center)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[nightstand.width, nightstand.height, nightstand.depth]} />
        <meshStandardMaterial color="#38271f" roughness={0.72} />
      </mesh>
      <mesh position={[0.12, nightstand.height / 2 + 0.17, -0.05]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.26, 18]} />
        <meshStandardMaterial color="#35302b" metalness={0.35} roughness={0.38} />
      </mesh>
      <mesh position={[0.12, nightstand.height / 2 + 0.38, -0.05]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.3, 20]} />
        <meshStandardMaterial
          color="#d7c1a1"
          emissive="#8a5227"
          emissiveIntensity={lampIntensity > 0 ? 0.28 : 0}
          roughness={0.82}
        />
      </mesh>
      <pointLight
        position={[0.12, nightstand.height / 2 + 0.42, -0.05]}
        color="#ffad64"
        intensity={lampIntensity}
        distance={4.8}
        castShadow
      />
      <mesh position={[-0.12, nightstand.height / 2 + 0.11, 0.09]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.2, 14]} />
        <meshPhysicalMaterial color="#b9d7e8" transparent opacity={0.65} roughness={0.18} />
      </mesh>
      <mesh position={[-0.05, nightstand.height / 2 + 0.03, -0.08]}>
        <boxGeometry args={[0.28, 0.018, 0.12]} />
        <meshStandardMaterial color="#202020" roughness={0.5} />
      </mesh>
    </group>
  );
}

function AirConditioner() {
  const { airConditioner } = BEDROOM_DESIGN;

  return (
    <group position={mutableVec(airConditioner.center)}>
      <mesh castShadow>
        <boxGeometry
          args={[
            airConditioner.depth,
            airConditioner.height,
            airConditioner.widthAlongWall,
          ]}
        />
        <meshStandardMaterial color="#f0f0ed" roughness={0.55} />
      </mesh>
      <mesh position={[0.095, -0.12, 0]}>
        <boxGeometry args={[0.02, 0.075, 0.82]} />
        <meshStandardMaterial color="#202328" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Curtains({ open }: { open: boolean }) {
  const { curtains, window } = BEDROOM_DESIGN;

  return (
    <group>
      <mesh position={mutableVec(window.center)}>
        <boxGeometry args={[window.width, window.height, 0.04]} />
        <meshPhysicalMaterial
          color="#aebdc7"
          transparent
          opacity={0.5}
          roughness={0.18}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0, 2.77, curtains.center[2] + 0.03]}>
        <boxGeometry args={[5.7, 0.05, 0.06]} />
        <meshStandardMaterial color="#252321" metalness={0.42} roughness={0.45} />
      </mesh>

      {open ? (
        <>
          {[-2.05, 2.05].map((x) => (
            <group key={x} position={[x, curtains.center[1], curtains.center[2]]}>
              <mesh castShadow>
                <boxGeometry args={[0.78, curtains.height, 0.12]} />
                <meshStandardMaterial color="#1c1c1e" roughness={0.98} />
              </mesh>
            </group>
          ))}
        </>
      ) : (
        <group>
          <mesh position={mutableVec(curtains.center)} castShadow>
            <boxGeometry args={[curtains.width, curtains.height, 0.09]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.99} />
          </mesh>
          {Array.from({ length: 18 }, (_, index) => {
            const x = -curtains.width / 2 + 0.17 + index * 0.31;
            const depth = index % 2 === 0 ? 0.075 : 0.045;
            return (
              <mesh
                key={`curtain-fold-${index}`}
                position={[x, curtains.center[1], curtains.center[2] + 0.055]}
                castShadow
              >
                <boxGeometry args={[0.055, curtains.height * 0.985, depth]} />
                <meshStandardMaterial color="#242426" roughness={0.99} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

function RightWallStorage() {
  const { wardrobe } = BEDROOM_DESIGN;
  const roomFaceX = BEDROOM_DESIGN.bounds.rightX - wardrobe.depth - 0.016;
  const centerZ = wardrobe.center[2];

  return (
    <group>
      <mesh position={mutableVec(wardrobe.center)} castShadow receiveShadow>
        <boxGeometry args={[wardrobe.depth, wardrobe.height, wardrobe.runLength]} />
        <meshStandardMaterial color="#302219" roughness={0.76} />
      </mesh>

      {[centerZ - 1.62, centerZ - 0.58].map((z) => (
        <mesh key={z} position={[roomFaceX, 1.38, z]} castShadow>
          <boxGeometry args={[0.03, 2.38, 0.92]} />
          <meshPhysicalMaterial color="#9aa4a5" metalness={0.95} roughness={0.055} />
        </mesh>
      ))}

      {[centerZ - 2.13, centerZ - 1.1, centerZ - 0.07, centerZ + 0.94, centerZ + 1.55].map(
        (z) => (
          <mesh key={`mullion-${z}`} position={[roomFaceX - 0.018, 1.36, z]}>
            <boxGeometry args={[0.045, 2.5, 0.045]} />
            <meshStandardMaterial color="#211711" roughness={0.72} />
          </mesh>
        ),
      )}

      <group position={[roomFaceX - 0.03, 0, centerZ + 0.36]}>
        <mesh position={[0, 1.36, 0]}>
          <boxGeometry args={[0.055, 2.36, 0.86]} />
          <meshStandardMaterial color="#1d1612" roughness={0.9} />
        </mesh>
        <mesh position={[-0.04, 2.18, 0]}>
          <boxGeometry args={[0.08, 0.035, 0.72]} />
          <meshStandardMaterial color="#81756b" metalness={0.55} roughness={0.35} />
        </mesh>
        {[-0.25, 0, 0.25].map((z, index) => (
          <mesh key={z} position={[-0.08, 1.62, z]} castShadow>
            <boxGeometry args={[0.1, 1.02, 0.19]} />
            <meshStandardMaterial
              color={["#d5d4cf", "#657286", "#252a31"][index]}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      <group position={[roomFaceX - 0.03, 0, centerZ + 1.43]}>
        {[0.28, 0.54, 0.8].map((y) => (
          <mesh key={`drawer-${y}`} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.055, 0.22, 0.82]} />
            <meshStandardMaterial color="#3b2a20" roughness={0.76} />
          </mesh>
        ))}
        {[1.14, 1.5, 1.86, 2.22].map((y) => (
          <mesh key={`shelf-${y}`} position={[0, y, 0]}>
            <boxGeometry args={[0.07, 0.035, 0.82]} />
            <meshStandardMaterial color="#4a3528" roughness={0.75} />
          </mesh>
        ))}
      </group>

      <mesh position={[roomFaceX - 0.018, 2.61, centerZ]}>
        <boxGeometry args={[0.05, 0.06, wardrobe.runLength - 0.12]} />
        <meshStandardMaterial color="#211711" roughness={0.72} />
      </mesh>
      <mesh position={[roomFaceX - 0.018, 0.11, centerZ]}>
        <boxGeometry args={[0.05, 0.06, wardrobe.runLength - 0.12]} />
        <meshStandardMaterial color="#211711" roughness={0.72} />
      </mesh>
    </group>
  );
}

function Dresser() {
  const { dresser } = BEDROOM_DESIGN;
  const roomFaceX = dresser.center[0] - dresser.depth / 2 - 0.012;

  return (
    <group>
      <mesh position={mutableVec(dresser.center)} castShadow receiveShadow>
        <boxGeometry args={[dresser.depth, dresser.height, dresser.widthAlongWall]} />
        <meshStandardMaterial color="#39281f" roughness={0.73} />
      </mesh>

      <mesh
        position={[dresser.center[0] - 0.01, dresser.height + 0.025, dresser.center[2]]}
        castShadow
      >
        <boxGeometry args={[dresser.depth + 0.04, 0.05, dresser.widthAlongWall + 0.05]} />
        <meshStandardMaterial color="#2d2019" roughness={0.6} />
      </mesh>

      {[0.17, 0.4, 0.63, 0.86].map((y) => (
        <group key={y}>
          <mesh position={[roomFaceX, y, dresser.center[2]]} castShadow>
            <boxGeometry args={[0.025, 0.18, dresser.widthAlongWall - 0.12]} />
            <meshStandardMaterial color="#422f24" roughness={0.74} />
          </mesh>
          <mesh position={[roomFaceX - 0.018, y, dresser.center[2]]}>
            <boxGeometry args={[0.02, 0.025, 0.34]} />
            <meshStandardMaterial color="#81715e" metalness={0.62} roughness={0.28} />
          </mesh>
        </group>
      ))}

      {[-0.34, 0.08, 0.36].map((z, index) => (
        <mesh
          key={`${z}-${index}`}
          position={[
            dresser.center[0] - 0.08,
            dresser.height + 0.1 + index * 0.035,
            dresser.center[2] + z,
          ]}
          castShadow
        >
          <cylinderGeometry args={[0.035 + index * 0.006, 0.035, 0.14, 14]} />
          <meshStandardMaterial
            color={["#6c5e4f", "#d5d0c5", "#2f4855"][index]}
            roughness={0.52}
          />
        </mesh>
      ))}
    </group>
  );
}

function Chair() {
  const { chair } = BEDROOM_DESIGN;
  const [x, , z] = chair.center;
  const legX = chair.width / 2 - 0.1;
  const legZ = chair.depth / 2 - 0.1;

  return (
    <group>
      {[-legX, legX].flatMap((dx) =>
        [-legZ, legZ].map((dz) => (
          <mesh
            key={`${dx}-${dz}`}
            position={[x + dx, chair.seatHeight / 2, z + dz]}
            castShadow
          >
            <boxGeometry args={[0.05, chair.seatHeight, 0.05]} />
            <meshStandardMaterial color="#2c211c" roughness={0.72} />
          </mesh>
        )),
      )}

      <mesh position={[x, chair.seatHeight, z]} castShadow receiveShadow>
        <boxGeometry args={[chair.width, 0.17, chair.depth]} />
        <meshStandardMaterial color="#484446" roughness={0.96} />
      </mesh>

      <mesh
        position={[x, chair.seatHeight + 0.55, z - chair.depth / 2 + 0.075]}
        rotation={[-0.075, 0, 0]}
        castShadow
      >
        <boxGeometry args={[chair.width - 0.04, 0.82, 0.13]} />
        <meshStandardMaterial color="#454143" roughness={0.96} />
      </mesh>

      <mesh
        position={[x + 0.03, chair.seatHeight + 0.59, z - 0.16]}
        rotation={[0.12, 0.18, 0.08]}
        castShadow
      >
        <boxGeometry args={[0.5, 0.46, 0.045]} />
        <meshStandardMaterial color="#aaa298" roughness={0.99} />
      </mesh>
    </group>
  );
}

function Rug() {
  const { rug } = BEDROOM_DESIGN;
  const y = rug.center[1];

  return (
    <group>
      <mesh position={mutableVec(rug.center)} receiveShadow>
        <boxGeometry args={[rug.width, 0.03, rug.depth]} />
        <meshStandardMaterial color="#ad9e8c" roughness={0.99} />
      </mesh>
      <mesh position={[rug.center[0], y + 0.018, rug.center[2] - rug.depth / 2 + 0.07]}>
        <boxGeometry args={[rug.width - 0.14, 0.008, 0.035]} />
        <meshStandardMaterial color="#8f8172" roughness={1} />
      </mesh>
      <mesh position={[rug.center[0], y + 0.018, rug.center[2] + rug.depth / 2 - 0.07]}>
        <boxGeometry args={[rug.width - 0.14, 0.008, 0.035]} />
        <meshStandardMaterial color="#8f8172" roughness={1} />
      </mesh>
      <mesh position={[rug.center[0] - rug.width / 2 + 0.07, y + 0.018, rug.center[2]]}>
        <boxGeometry args={[0.035, 0.008, rug.depth - 0.14]} />
        <meshStandardMaterial color="#8f8172" roughness={1} />
      </mesh>
      <mesh position={[rug.center[0] + rug.width / 2 - 0.07, y + 0.018, rug.center[2]]}>
        <boxGeometry args={[0.035, 0.008, rug.depth - 0.14]} />
        <meshStandardMaterial color="#8f8172" roughness={1} />
      </mesh>
    </group>
  );
}

function DailyClutter() {
  const shoePairs: Array<{
    x: number;
    z: number;
    rotation: number;
    color: string;
  }> = [
    { x: 1.25, z: 2.48, rotation: 0.18, color: "#72523f" },
    { x: 1.78, z: 2.08, rotation: -0.2, color: "#2b2c30" },
    { x: 1.95, z: 1.48, rotation: 0.3, color: "#bbb7ae" },
  ];

  return (
    <group>
      {shoePairs.map((pair, pairIndex) =>
        [-0.1, 0.1].map((offset, shoeIndex) => (
          <mesh
            key={`${pairIndex}-${shoeIndex}`}
            position={[pair.x + offset, 0.065, pair.z + shoeIndex * 0.06]}
            rotation={[0, pair.rotation, 0]}
            castShadow
          >
            <boxGeometry args={[0.12, 0.1, 0.3]} />
            <meshStandardMaterial color={pair.color} roughness={0.84} />
          </mesh>
        )),
      )}

      <group position={[2.18, 0, 1.66]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.5, 0.36, 0.26]} />
          <meshStandardMaterial color="#191919" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <torusGeometry args={[0.15, 0.025, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#191919" roughness={0.88} />
        </mesh>
      </group>
    </group>
  );
}

function BedroomEnvironment({
  lightingMode,
}: {
  lightingMode: SceneState["lightingMode"];
}) {
  const light = getThreeDLighting(lightingMode);
  const { ceilingSpots } = BEDROOM_DESIGN;

  return (
    <group>
      <ambientLight intensity={light.ambientIntensity} color="#f5efe8" />
      {light.daylightIntensity > 0 ? (
        <directionalLight
          position={[0, 3.0, -2.65]}
          color="#f2f7ff"
          intensity={light.daylightIntensity}
          castShadow
        />
      ) : null}

      <EngineeredShell />
      <Bed />
      <Nightstand lampIntensity={light.lampIntensity} />
      <AirConditioner />
      <Curtains open={light.curtainsOpen} />
      <RightWallStorage />
      <Dresser />
      <Chair />
      <Rug />
      <DailyClutter />

      {ceilingSpots.map((position, index) => (
        <group
          key={`${index}-${position.join("-")}`}
          position={mutableVec(position)}
        >
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.025, 18]} />
            <meshBasicMaterial
              color={light.ceilingIntensity > 0 ? "#f7f4eb" : "#4b4b49"}
            />
          </mesh>
          <pointLight
            position={[0, -0.12, 0]}
            color="#fff8e9"
            intensity={light.ceilingIntensity}
            distance={3.8}
          />
        </group>
      ))}
    </group>
  );
}

function Scene({
  sceneState,
  viewMode,
}: {
  sceneState: SceneState;
  viewMode: ThreeDViewMode;
}) {
  const pose = getThreeDPoseForState(sceneState);
  const selfieCamera = getThreeDSelfieCamera(sceneState);
  const light = getThreeDLighting(sceneState.lightingMode);

  return (
    <>
      <color attach="background" args={[light.background]} />
      <BedroomEnvironment lightingMode={sceneState.lightingMode} />
      <Suspense fallback={null}>
        <Character pose={pose} />
      </Suspense>
      {viewMode === "viewer" ? (
        <Phone position={selfieCamera.position} target={selfieCamera.target} />
      ) : null}
      <pointLight
        position={selfieCamera.position}
        color="#b9ddff"
        intensity={light.phoneIntensity}
        distance={2.2}
      />
      <ActiveCamera
        pose={pose}
        selfieCamera={selfieCamera}
        viewMode={viewMode}
      />
      {viewMode === "viewer" ? (
        <OrbitControls
          target={pose.viewerTarget}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.2}
          maxDistance={6.8}
          maxPolarAngle={Math.PI / 2 - 0.02}
        />
      ) : null}
    </>
  );
}

export function ThreeDSceneCanvas({
  sceneState,
  viewMode,
}: {
  sceneState: SceneState;
  viewMode: ThreeDViewMode;
}) {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <Scene sceneState={sceneState} viewMode={viewMode} />
    </Canvas>
  );
}

useGLTF.preload(XBOT_URL);
