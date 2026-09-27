"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Camera, Copy, RotateCcw } from "lucide-react";
import {
  buildNegativePrompt,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import type { SceneState } from "@/features/prompt-studio/types";

type Vec3 = [number, number, number];
type LightingModeKey = "warm" | "white" | "night";

type SelfiePose = {
  id: SceneState["poseType"];
  title: string;
  sceneState: SceneState["poseType"];
  modelPosition: Vec3;
  modelRotation: Vec3;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  phonePosition: Vec3;
  phoneSceneState: SceneState["phonePosition"];
};

type LightingConfig = {
  background: string;
  ambientIntensity: number;
  ceilingIntensity: number;
  lampIntensity: number;
  phoneIntensity: number;
};

const XBOT_URL = "https://threejs.org/examples/models/gltf/Xbot.glb";

const SELFIE_POSES: SelfiePose[] = [
  {
    id: "standing",
    title: "وقوف",
    sceneState: "standing",
    modelPosition: [0, 0, 0],
    modelRotation: [0, 0, 0],
    cameraPosition: [3.8, 2.2, 4.5],
    cameraTarget: [0, 1, 0],
    phonePosition: [0.45, 1.45, 0.55],
    phoneSceneState: "front-of-face",
  },
  {
    id: "sitting-bed",
    title: "الجلوس على السرير",
    sceneState: "sitting-bed",
    modelPosition: [-1.8, 0.55, -1.2],
    modelRotation: [0, 0.5, 0],
    cameraPosition: [1.3, 2.0, 3.2],
    cameraTarget: [-1.8, 1.05, -1.2],
    phonePosition: [-1.18, 1.48, -0.58],
    phoneSceneState: "front-of-face",
  },
  {
    id: "sitting-chair",
    title: "الجلوس على كرسي",
    sceneState: "sitting-chair",
    modelPosition: [1.5, 0.45, 1.0],
    modelRotation: [0, -0.7, 0],
    cameraPosition: [4.0, 2.0, 4.0],
    cameraTarget: [1.5, 1.0, 1.0],
    phonePosition: [0.92, 1.35, 1.55],
    phoneSceneState: "front-of-face",
  },
  {
    id: "lying-bed",
    title: "الاستلقاء على السرير",
    sceneState: "lying-bed",
    modelPosition: [-1.8, 0.55, -1.0],
    modelRotation: [-Math.PI / 2, 0, 0],
    cameraPosition: [0.1, 3.4, 1.9],
    cameraTarget: [-1.8, 0.8, -1.0],
    phonePosition: [-1.8, 1.35, -0.18],
    phoneSceneState: "above-chest",
  },
  {
    id: "standing-window",
    title: "الوقوف قرب النافذة",
    sceneState: "standing-window",
    modelPosition: [0, 0, -3.5],
    modelRotation: [0, Math.PI, 0],
    cameraPosition: [3.2, 2.1, 0.8],
    cameraTarget: [0, 1.0, -3.5],
    phonePosition: [-0.42, 1.45, -2.96],
    phoneSceneState: "front-of-face",
  },
];

const LIGHTING_CONFIG: Record<LightingModeKey, LightingConfig> = {
  warm: {
    background: "#151312",
    ambientIntensity: 0.5,
    ceilingIntensity: 0.55,
    lampIntensity: 2.4,
    phoneIntensity: 0.12,
  },
  white: {
    background: "#20252a",
    ambientIntensity: 0.85,
    ceilingIntensity: 1.0,
    lampIntensity: 1.0,
    phoneIntensity: 0.08,
  },
  night: {
    background: "#080a0f",
    ambientIntensity: 0.15,
    ceilingIntensity: 0.08,
    lampIntensity: 0.2,
    phoneIntensity: 1.35,
  },
};

const INITIAL_SCENE_STATE: SceneState = {
  shotType: "front-selfie",
  lightingMode: "as-in-photo",
  cameraDistance: "arm-length",
  cameraAngle: "eye-level",
  phonePosition: "front-of-face",
  clothingTop: "t-shirt",
  clothingBottom: "shorts",
  clothingMaterial: "cotton",
  clothingColor: "neutral",
  referenceProvided: false,
  identityPriority: "balanced",
  identityNotes: "",
  hairStyle: "natural",
  hairLength: "medium",
  hairTexture: "wavy",
  poseType: "standing",
  headDirection: "forward",
  shoulderPosition: "relaxed",
  handPlacement: "at-side",
  backPosture: "relaxed",
  faceExpression: "neutral",
  eyeDirection: "camera",
  mouthState: "closed",
  freeHandPosition: "at-side",
  handFingersState: "relaxed",
  handVisibility: "fully-visible",
  scenario: "none",
};

function mapLightingToSceneState(
  mode: LightingModeKey,
): SceneState["lightingMode"] {
  if (mode === "warm") return "as-in-photo";
  if (mode === "night") return "phone-screen";
  return "daylight-open";
}

function Character({ pose }: { pose: SelfiePose }) {
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

function Phone({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
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

function CameraController({ pose }: { pose: SelfiePose }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...pose.cameraPosition);
    camera.lookAt(...pose.cameraTarget);
    camera.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
}

function createBedroomEnvironment(lighting: LightingModeKey) {
  const light = LIGHTING_CONFIG[lighting];
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

      {/* Floor and tile grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={0x8a8a8a} roughness={0.82} />
      </mesh>
      <gridHelper
        args={[10, 20, 0x727272, 0x7c7c7c]}
        position={[0, 0.012, 0]}
      />

      {/* Room walls */}
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

      {/* 1. Bed on the left */}
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

      {/* 2. Bedside table, warm lamp, and open laptop */}
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
            emissiveIntensity={0.25}
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

      {/* 3. Air conditioner on left wall */}
      <mesh position={[-4.88, 3.0, -1.9]} castShadow>
        <boxGeometry args={[0.3, 0.4, 1.2]} />
        <meshStandardMaterial color="#f4f4f0" roughness={0.55} />
      </mesh>

      {/* 4. Dark floor-to-ceiling curtains covering the rear wall */}
      <mesh position={[0, 1.9, -4.86]} castShadow>
        <boxGeometry args={[6, 3.8, 0.16]} />
        <meshStandardMaterial color={0x1a1a1a} roughness={0.96} />
      </mesh>

      {/* 5. Glass wardrobe on the right with blue and white clothes */}
      <group position={[3.5, 0, -0.2]}>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[1.8, 3.2, 1.0]} />
          <meshStandardMaterial color={0x3a2515} roughness={0.72} />
        </mesh>
        <mesh position={[-0.42, 1.6, 0.515]}>
          <boxGeometry args={[0.78, 2.9, 0.025]} />
          <meshPhysicalMaterial
            color="#cce5ef"
            transparent
            opacity={0.3}
            roughness={0.15}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0.42, 1.6, 0.515]}>
          <boxGeometry args={[0.78, 2.9, 0.025]} />
          <meshPhysicalMaterial
            color="#cce5ef"
            transparent
            opacity={0.3}
            roughness={0.15}
            metalness={0.05}
          />
        </mesh>
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

      {/* 6. Five-drawer dresser on the far right */}
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

      {/* 7. Large plain beige rug */}
      <mesh position={[-0.5, 0.025, 0]} receiveShadow>
        <boxGeometry args={[4, 0.04, 5]} />
        <meshStandardMaterial color={0xbfae94} roughness={0.98} />
      </mesh>

      {/* 9. Six soft-white ceiling spots */}
      {ceilingSpots.map((position) => (
        <group key={position.join("-")} position={position}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
            <meshBasicMaterial color="#f7f4eb" />
          </mesh>
          <pointLight
            position={[0, -0.08, 0]}
            color="#fff8e9"
            intensity={light.ceilingIntensity}
            distance={5.2}
          />
        </group>
      ))}

      {/* 10. Wooden door at the lower-left side */}
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
  pose,
  lighting,
}: {
  pose: SelfiePose;
  lighting: LightingModeKey;
}) {
  const light = LIGHTING_CONFIG[lighting];

  return (
    <>
      <color attach="background" args={[light.background]} />
      {createBedroomEnvironment(lighting)}
      <Suspense fallback={null}>
        <Character pose={pose} />
      </Suspense>
      <Phone position={pose.phonePosition} />
      <pointLight
        position={pose.phonePosition}
        color="#b9ddff"
        intensity={light.phoneIntensity}
        distance={2.2}
      />
      <CameraController pose={pose} />
      <OrbitControls
        target={pose.cameraTarget}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<"simulator" | "prompt">(
    "simulator",
  );
  const [poseId, setPoseId] = useState<SceneState["poseType"]>("standing");
  const [lighting, setLighting] = useState<LightingModeKey>("warm");
  const [copiedTarget, setCopiedTarget] = useState<
    "prompt" | "negative" | null
  >(null);
  const [sceneState, setSceneState] = useState<SceneState>(INITIAL_SCENE_STATE);

  const pose =
    SELFIE_POSES.find((item) => item.id === poseId) ?? SELFIE_POSES[0];
  const englishPrompt = buildPromptEnglish(sceneState);
  const negativePrompt = buildNegativePrompt(sceneState);

  const selectPose = (nextPose: SelfiePose) => {
    setPoseId(nextPose.id);
    setSceneState((previous) => ({
      ...previous,
      poseType: nextPose.sceneState,
      phonePosition: nextPose.phoneSceneState,
    }));
  };

  const selectLighting = (nextLighting: LightingModeKey) => {
    setLighting(nextLighting);
    setSceneState((previous) => ({
      ...previous,
      lightingMode: mapLightingToSceneState(nextLighting),
    }));
  };

  const reset = () => {
    setPoseId("standing");
    setLighting("warm");
    setSceneState(INITIAL_SCENE_STATE);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(englishPrompt);
    setCopiedTarget("prompt");
    window.setTimeout(() => setCopiedTarget(null), 1200);
  };

  const copyNegative = async () => {
    await navigator.clipboard.writeText(negativePrompt);
    setCopiedTarget("negative");
    window.setTimeout(() => setCopiedTarget(null), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100" dir="rtl">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 p-1.5">
            <Camera className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold">محاكي السيلفي 3D</h1>
            <p className="text-[10px] text-slate-500">
              غرفة واقعية + 5 وضعيات متوافقة مع Ton
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-amber-500/60 hover:text-amber-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          إعادة التعيين
        </button>
      </header>

      <main>
        <div style={{ display: activeTab === "simulator" ? "block" : "none" }}>
          <section className="h-[60vh] min-h-[380px] border-b border-slate-800 bg-black">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{
                position: pose.cameraPosition,
                fov: 45,
                near: 0.1,
                far: 50,
              }}
            >
              <Scene pose={pose} lighting={lighting} />
            </Canvas>
          </section>

          <section className="space-y-5 px-3 py-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-200">الوضعية</h2>
                <span className="text-[10px] text-slate-500">5 وضعيات</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {SELFIE_POSES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectPose(item)}
                    className={`rounded-xl border px-3 py-3 text-right text-sm font-semibold transition ${
                      pose.id === item.id
                        ? "border-amber-500/70 bg-amber-500/15 text-amber-300"
                        : "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-slate-200">الإضاءة</h2>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["warm", "دافئة"],
                    ["white", "بيضاء"],
                    ["night", "ليلية"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectLighting(key)}
                    className={`rounded-xl border px-2 py-2 text-xs font-bold transition ${
                      lighting === key
                        ? "border-amber-500/70 bg-amber-500/15 text-amber-300"
                        : "border-slate-800 bg-slate-900 text-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div style={{ display: activeTab === "prompt" ? "block" : "none" }}>
          <section className="mx-auto min-h-[calc(100vh-8.5rem)] max-w-3xl space-y-6 px-4 py-5">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  Prompt (English)
                </h2>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-500/60 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedTarget === "prompt" ? "تم النسخ" : "نسخ"}
                </button>
              </div>
              <pre
                dir="ltr"
                className="max-h-[36vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs leading-relaxed text-slate-300"
              >
                {englishPrompt}
              </pre>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-slate-200">
                  Negative Prompt
                </h2>
                <button
                  type="button"
                  onClick={copyNegative}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-500/60 hover:text-amber-300"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedTarget === "negative" ? "تم النسخ" : "نسخ"}
                </button>
              </div>
              <pre
                dir="ltr"
                className="max-h-[28vh] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs leading-relaxed text-slate-300"
              >
                {negativePrompt}
              </pre>
            </div>

            <Link
              href="/"
              className="block w-full rounded-xl bg-amber-500 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-amber-600"
            >
              افتح في Ton الرئيسي
            </Link>
          </section>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`flex-1 border-t-2 py-3 text-sm font-bold transition ${
            activeTab === "simulator"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400"
          }`}
        >
          🎮 المحاكي
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("prompt")}
          className={`flex-1 border-t-2 py-3 text-sm font-bold transition ${
            activeTab === "prompt"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400"
          }`}
        >
          📝 Prompt
        </button>
      </nav>
    </div>
  );
}

useGLTF.preload(XBOT_URL);
