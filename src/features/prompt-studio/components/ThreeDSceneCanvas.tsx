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
        <meshStandardMaterial
          color="#111111"
          metalness={0.75}
          roughness={0.2}
        />
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

function EngineeredShell() {
  const { dimensions, bounds, door } = BEDROOM_DESIGN;
  const wallColor = "#c7b8a6";
  const wallThickness = 0.12;
  const doorLeft = door.position[0] - door.width / 2;
  const doorRight = door.position[0] + door.width / 2;
  const leftSegmentWidth = doorLeft - bounds.leftX;
  const rightSegmentWidth = bounds.rightX - doorRight;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <meshStandardMaterial
          color="#c9bdad"
          roughness={0.26}
          metalness={0.03}
        />
      </mesh>

      <gridHelper
        args={[dimensions.width, 10, 0xa89d91, 0xb8ada1]}
        position={[0, 0.012, 0]}
      />

      <mesh position={[0, dimensions.height / 2, bounds.backZ]} receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, wallThickness]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      <mesh position={[bounds.leftX, dimensions.height / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      <mesh position={[bounds.rightX, dimensions.height / 2, 0]} receiveShadow>
        <boxGeometry args={[wallThickness, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
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
        <meshStandardMaterial color={wallColor} roughness={0.92} />
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
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      <mesh
        position={[
          door.position[0],
          door.height + (dimensions.height - door.height) / 2,
          bounds.frontZ,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[door.width, dimensions.height - door.height, wallThickness]}
        />
        <meshStandardMaterial color={wallColor} roughness={0.92} />
      </mesh>
      <mesh position={mutableVec(door.position)} castShadow receiveShadow>
        <boxGeometry args={[door.width, door.height, 0.08]} />
        <meshStandardMaterial color="#3b2a20" roughness={0.72} />
      </mesh>
      <mesh position={[door.position[0] + 0.31, 1.02, 2.98]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="#a99366"
          metalness={0.75}
          roughness={0.28}
        />
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

  return (
    <group>
      <mesh
        position={[bed.center[0], bed.frameHeight / 2, bed.center[2]]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[bed.frameLength, bed.frameHeight, bed.frameWidth]} />
        <meshStandardMaterial color="#2d2928" roughness={0.78} />
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
        <boxGeometry
          args={[bed.mattressLength, bed.mattressThickness, bed.mattressWidth]}
        />
        <meshStandardMaterial color="#d9d8d4" roughness={0.96} />
      </mesh>
      <mesh
        position={[bed.center[0] + 0.12, 0.61, bed.center[2] + 0.1]}
        castShadow
      >
        <boxGeometry args={[1.78, 0.1, 1.68]} />
        <meshStandardMaterial color="#55575b" roughness={0.92} />
      </mesh>
      <mesh position={mutableVec(bed.headboardCenter)} castShadow receiveShadow>
        <boxGeometry
          args={[
            bed.headboardThickness,
            bed.headboardHeight,
            bed.headboardWidth,
          ]}
        />
        <meshStandardMaterial color="#26282b" roughness={0.88} />
      </mesh>
      {[0.34, 0.62, 0.9, 1.18].map((y) => (
        <mesh
          key={y}
          position={[bed.headboardCenter[0] + 0.085, y, bed.headboardCenter[2]]}
          castShadow
        >
          <boxGeometry args={[0.045, 0.22, 1.94]} />
          <meshStandardMaterial color="#303236" roughness={0.9} />
        </mesh>
      ))}
      {[-1.02, -0.28].map((z) => (
        <mesh
          key={z}
          position={[-2.05, 0.77, z]}
          rotation={[0, 0, -0.08]}
          castShadow
        >
          <boxGeometry args={[0.58, 0.16, 0.58]} />
          <meshStandardMaterial color="#6b6d71" roughness={0.96} />
        </mesh>
      ))}
    </group>
  );
}

function Nightstand({ lampIntensity }: { lampIntensity: number }) {
  const { nightstand } = BEDROOM_DESIGN;

  return (
    <group position={mutableVec(nightstand.center)}>
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[nightstand.width, nightstand.height, nightstand.depth]}
        />
        <meshStandardMaterial color="#3b291f" roughness={0.7} />
      </mesh>
      <mesh position={[0.12, nightstand.height / 2 + 0.17, -0.05]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.26, 18]} />
        <meshStandardMaterial
          color="#35302b"
          metalness={0.35}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0.12, nightstand.height / 2 + 0.38, -0.05]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.3, 20]} />
        <meshStandardMaterial
          color="#dcc7a7"
          emissive="#8a5227"
          emissiveIntensity={lampIntensity > 0 ? 0.28 : 0}
          roughness={0.8}
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
        <meshPhysicalMaterial
          color="#b9d7e8"
          transparent
          opacity={0.65}
          roughness={0.18}
        />
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
          color="#b8c8d3"
          transparent
          opacity={0.55}
          roughness={0.15}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0, 2.77, -3.0]}>
        <boxGeometry args={[4.55, 0.05, 0.06]} />
        <meshStandardMaterial color="#252321" metalness={0.45} roughness={0.4} />
      </mesh>
      {open ? (
        <>
          {[-1.85, 1.85].map((x) => (
            <mesh key={x} position={[x, curtains.center[1], curtains.center[2]]} castShadow>
              <boxGeometry args={[0.68, curtains.height, 0.11]} />
              <meshStandardMaterial color="#1d1d1f" roughness={0.97} />
            </mesh>
          ))}
        </>
      ) : (
        <mesh position={mutableVec(curtains.center)} castShadow>
          <boxGeometry args={[curtains.width, curtains.height, 0.11]} />
          <meshStandardMaterial color="#1d1d1f" roughness={0.97} />
        </mesh>
      )}
    </group>
  );
}

function RightWallStorage() {
  const { wardrobe } = BEDROOM_DESIGN;
  const roomFaceX = BEDROOM_DESIGN.bounds.rightX - wardrobe.depth - 0.015;

  return (
    <group>
      <mesh position={mutableVec(wardrobe.center)} castShadow receiveShadow>
        <boxGeometry args={[wardrobe.depth, wardrobe.height, wardrobe.runLength]} />
        <meshStandardMaterial color="#31231b" roughness={0.72} />
      </mesh>

      {[-1.62, -0.62].map((z) => (
        <mesh key={z} position={[roomFaceX, 1.34, z]} castShadow>
          <boxGeometry args={[0.035, 2.32, 0.86]} />
          <meshPhysicalMaterial
            color="#aab5b9"
            metalness={0.82}
            roughness={0.12}
          />
        </mesh>
      ))}

      <group position={[roomFaceX - 0.02, 0, 0.35]}>
        <mesh position={[0, 1.34, 0]}>
          <boxGeometry args={[0.06, 2.3, 0.78]} />
          <meshStandardMaterial color="#1f1814" roughness={0.85} />
        </mesh>
        <mesh position={[-0.05, 2.2, 0]}>
          <boxGeometry args={[0.08, 0.035, 0.68]} />
          <meshStandardMaterial color="#7f746b" metalness={0.55} roughness={0.35} />
        </mesh>
        {[-0.24, 0, 0.24].map((z, index) => (
          <mesh key={z} position={[-0.09, 1.63, z]} castShadow>
            <boxGeometry args={[0.12, 1.05, 0.18]} />
            <meshStandardMaterial
              color={["#d7d8d6", "#516378", "#252c36"][index]}
              roughness={0.86}
            />
          </mesh>
        ))}
      </group>

      <group position={[roomFaceX - 0.02, 0, 1.3]}>
        {[0.35, 0.66, 0.97].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <boxGeometry args={[0.055, 0.26, 0.66]} />
            <meshStandardMaterial color="#3c2b21" roughness={0.72} />
          </mesh>
        ))}
        {[1.35, 1.72, 2.08].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.68]} />
            <meshStandardMaterial color="#4a3528" roughness={0.72} />
          </mesh>
        ))}
      </group>
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
        <meshStandardMaterial color="#3a291f" roughness={0.7} />
      </mesh>
      {[0.21, 0.43, 0.65].map((y) => (
        <mesh key={y} position={[roomFaceX, y, dresser.center[2]]}>
          <boxGeometry args={[0.02, 0.025, 1.02]} />
          <meshStandardMaterial color="#17110e" />
        </mesh>
      ))}
      {[-0.28, 0.12, 0.32].map((z, index) => (
        <mesh
          key={`${z}-${index}`}
          position={[
            dresser.center[0] - 0.08,
            dresser.height + 0.08 + index * 0.035,
            dresser.center[2] + z,
          ]}
          castShadow
        >
          <cylinderGeometry args={[0.035 + index * 0.006, 0.035, 0.14, 14]} />
          <meshStandardMaterial
            color={["#6c5e4f", "#d5d0c5", "#2f4855"][index]}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Chair() {
  const { chair } = BEDROOM_DESIGN;
  const [x, , z] = chair.center;

  return (
    <group>
      <mesh position={[x, chair.seatHeight, z]} castShadow receiveShadow>
        <boxGeometry args={[chair.width, 0.16, chair.depth]} />
        <meshStandardMaterial color="#3d3a3b" roughness={0.92} />
      </mesh>
      <mesh
        position={[x, chair.seatHeight + 0.62, z - chair.depth / 2 + 0.07]}
        rotation={[-0.1, 0, 0]}
        castShadow
      >
        <boxGeometry args={[chair.width, 1.0, 0.14]} />
        <meshStandardMaterial color="#444143" roughness={0.92} />
      </mesh>
      {[-0.25, 0.25].flatMap((dx) =>
        [-0.25, 0.25].map((dz) => (
          <mesh
            key={`${dx}-${dz}`}
            position={[x + dx, chair.seatHeight / 2, z + dz]}
            castShadow
          >
            <boxGeometry args={[0.055, chair.seatHeight, 0.055]} />
            <meshStandardMaterial color="#2e241f" roughness={0.7} />
          </mesh>
        )),
      )}
      <mesh
        position={[x + 0.04, chair.seatHeight + 0.72, z - 0.27]}
        rotation={[0.08, 0.18, 0.06]}
        castShadow
      >
        <boxGeometry args={[0.55, 0.5, 0.055]} />
        <meshStandardMaterial color="#b6afa5" roughness={0.96} />
      </mesh>
    </group>
  );
}

function DailyClutter() {
  const shoePairs: Array<{ x: number; z: number; rotation: number; color: string }> = [
    { x: -0.05, z: 2.0, rotation: 0.18, color: "#72523f" },
    { x: 0.82, z: 1.72, rotation: -0.2, color: "#2b2c30" },
    { x: 1.45, z: 1.34, rotation: 0.3, color: "#bbb7ae" },
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
            <meshStandardMaterial color={pair.color} roughness={0.82} />
          </mesh>
        )),
      )}
      <group position={[1.58, 0, -2.38]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.5, 0.36, 0.26]} />
          <meshStandardMaterial color="#191919" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <torusGeometry args={[0.15, 0.025, 10, 24, Math.PI]} />
          <meshStandardMaterial color="#191919" roughness={0.86} />
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
  const { rug, ceilingSpots } = BEDROOM_DESIGN;

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
      <DailyClutter />

      <mesh position={mutableVec(rug.center)} receiveShadow>
        <boxGeometry args={[rug.width, 0.035, rug.depth]} />
        <meshStandardMaterial color="#b6a48e" roughness={0.98} />
      </mesh>

      {ceilingSpots.map((position, index) => (
        <group key={`${index}-${position.join("-")}`} position={mutableVec(position)}>
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
