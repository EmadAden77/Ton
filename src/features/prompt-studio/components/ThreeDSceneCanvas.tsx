"use client";

import { Suspense, useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import {
  getThreeDLighting,
  getThreeDPose,
  getThreeDSelfieCamera,
  type ThreeDPoseConfig,
  type ThreeDSelfieCameraConfig,
  type Vec3,
} from "../threeDScene";
import type { SceneState } from "../types";

const XBOT_URL = "https://threejs.org/examples/models/gltf/Xbot.glb";

export type ThreeDViewMode = "viewer" | "selfie";

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
      fov={isSelfie ? selfieCamera.fov : 45}
      near={isSelfie ? selfieCamera.near : 0.1}
      far={isSelfie ? selfieCamera.far : 50}
    />
  );
}

function BedroomEnvironment({
  lightingMode,
}: {
  lightingMode: SceneState["lightingMode"];
}) {
  const light = getThreeDLighting(lightingMode);
  const ceilingSpots: Vec3[] = [
    [-2.5, 3.75, -2.2],
    [0, 3.75, -2.2],
    [2.5, 3.75, -2.2],
    [-2.5, 3.75, 2.1],
    [0, 3.75, 2.1],
    [2.5, 3.75, 2.1],
  ];

  return (
    <group>
      <ambientLight intensity={light.ambientIntensity} color="#f5efe8" />
      {light.daylightIntensity > 0 ? (
        <directionalLight
          position={[0, 3.4, -4.2]}
          color="#f2f7ff"
          intensity={light.daylightIntensity}
          castShadow
        />
      ) : null}

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={0x8a8a8a} roughness={0.82} />
      </mesh>
      <gridHelper
        args={[10, 20, 0x727272, 0x7c7c7c]}
        position={[0, 0.012, 0]}
      />

      <mesh position={[0, 2, -5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.12]} />
        <meshStandardMaterial color="#d7d4cf" roughness={0.9} />
      </mesh>
      <mesh position={[-5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.12, 4, 10]} />
        <meshStandardMaterial color="#d7d4cf" roughness={0.9} />
      </mesh>
      <mesh position={[5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.12, 4, 10]} />
        <meshStandardMaterial color="#d7d4cf" roughness={0.9} />
      </mesh>

      <group position={[-1.8, 0, -1.2]}>
        <mesh position={[0, 0.175, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.9, 0.35, 3.4]} />
          <meshStandardMaterial color="#4a3325" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.8, -1.62]} castShadow>
          <boxGeometry args={[3.05, 1.6, 0.2]} />
          <meshStandardMaterial color={0x2a2a2a} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.4, 3.2]} />
          <meshStandardMaterial color="#f5f5f2" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.81, 0.58]} castShadow>
          <boxGeometry args={[2.72, 0.12, 1.9]} />
          <meshStandardMaterial color={0x3a3a3a} roughness={0.9} />
        </mesh>
        {[-0.72, 0.72].map((x) => (
          <mesh
            key={x}
            position={[x, 0.84, -1.05]}
            rotation={[0.1, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.95, 0.18, 0.58]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
        ))}
      </group>

      <group position={[-3.8, 0, -2.6]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.8, 0.7, 0.8]} />
          <meshStandardMaterial color="#3b281c" roughness={0.68} />
        </mesh>
        <mesh position={[-0.18, 0.83, 0.05]} castShadow>
          <cylinderGeometry args={[0.1, 0.13, 0.28, 20]} />
          <meshStandardMaterial
            color="#242424"
            metalness={0.45}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[-0.18, 1.05, 0.05]} castShadow>
          <cylinderGeometry args={[0.19, 0.28, 0.34, 20]} />
          <meshStandardMaterial
            color="#e8d7be"
            emissive="#6b4020"
            emissiveIntensity={light.lampIntensity > 0 ? 0.25 : 0}
          />
        </mesh>
        <pointLight
          position={[-0.18, 1.1, 0.08]}
          color="#ffad64"
          intensity={light.lampIntensity}
          distance={5}
          castShadow
        />
        <group position={[0.22, 0.78, 0.02]} rotation={[0, -0.35, 0]}>
          <mesh rotation={[-0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.035, 0.28]} />
            <meshStandardMaterial
              color="#686868"
              metalness={0.35}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0.17, -0.13]} rotation={[-0.95, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.025, 0.3]} />
            <meshStandardMaterial
              color="#55585d"
              metalness={0.35}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0.18, -0.115]} rotation={[-0.95, 0, 0]}>
            <planeGeometry args={[0.35, 0.23]} />
            <meshBasicMaterial color="#d9ebff" />
          </mesh>
        </group>
      </group>

      <mesh position={[-4.88, 3.0, -1.9]} castShadow>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial color="#f4f4f0" roughness={0.55} />
      </mesh>

      {light.curtainsOpen ? (
        <>
          <mesh position={[0, 1.9, -4.91]}>
            <planeGeometry args={[3.6, 3.1]} />
            <meshBasicMaterial color="#dce8f2" />
          </mesh>
          {[-2.25, 2.25].map((x) => (
            <mesh key={x} position={[x, 1.9, -4.84]} castShadow>
              <boxGeometry args={[1.45, 3.8, 0.18]} />
              <meshStandardMaterial color={0x1a1a1a} roughness={0.96} />
            </mesh>
          ))}
        </>
      ) : (
        <mesh position={[0, 1.9, -4.86]} castShadow>
          <boxGeometry args={[6, 3.8, 0.16]} />
          <meshStandardMaterial color={0x1a1a1a} roughness={0.96} />
        </mesh>
      )}

      <group position={[3.5, 0, -0.2]}>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[1.8, 3.2, 1.0]} />
          <meshStandardMaterial color={0x3a2515} roughness={0.72} />
        </mesh>
        {[-0.42, 0.42].map((x) => (
          <mesh key={x} position={[x, 1.6, 0.515]}>
            <boxGeometry args={[0.78, 2.9, 0.025]} />
            <meshPhysicalMaterial
              color="#cce5ef"
              transparent
              opacity={0.3}
              roughness={0.15}
              metalness={0.05}
            />
          </mesh>
        ))}
        {[
          { x: -0.48, color: "#e9edf2" },
          { x: -0.15, color: "#3f6fa8" },
          { x: 0.2, color: "#f7f7f7" },
          { x: 0.5, color: "#275d91" },
        ].map((item) => (
          <mesh
            key={`${item.x}-${item.color}`}
            position={[item.x, 1.72, 0.24]}
            castShadow
          >
            <boxGeometry args={[0.22, 1.25, 0.18]} />
            <meshStandardMaterial color={item.color} roughness={0.85} />
          </mesh>
        ))}
      </group>

      <group position={[4.5, 0, -1.5]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.75, 2.2, 1.25]} />
          <meshStandardMaterial color="#3a281d" roughness={0.7} />
        </mesh>
        {[0.42, 0.77, 1.12, 1.47, 1.82].map((y) => (
          <mesh key={y} position={[-0.386, y, 0]}>
            <boxGeometry args={[0.02, 0.025, 1.02]} />
            <meshStandardMaterial color="#160f0b" />
          </mesh>
        ))}
      </group>

      <mesh position={[-0.5, 0.025, 0]} receiveShadow>
        <boxGeometry args={[4, 0.04, 5]} />
        <meshStandardMaterial color={0xbfae94} roughness={0.98} />
      </mesh>

      {ceilingSpots.map((position) => (
        <group key={position.join("-")} position={position}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
            <meshBasicMaterial
              color={light.ceilingIntensity > 0 ? "#f7f4eb" : "#4b4b49"}
            />
          </mesh>
          <pointLight
            position={[0, -0.08, 0]}
            color="#fff8e9"
            intensity={light.ceilingIntensity}
            distance={5.2}
          />
        </group>
      ))}

      <group position={[-4.35, 0, 4.82]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 2.4, 0.12]} />
          <meshStandardMaterial color="#3c281d" roughness={0.7} />
        </mesh>
        <mesh position={[0.45, 1.15, -0.08]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            color="#b7a070"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>
      </group>
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
  const pose = getThreeDPose(sceneState.poseType);
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
          minDistance={1.5}
          maxDistance={9}
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
