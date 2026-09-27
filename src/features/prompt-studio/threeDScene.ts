import { resolveLockedState } from "./state";
import type { SceneState } from "./types";

export type Vec3 = [number, number, number];

export interface ThreeDPoseConfig {
  id: SceneState["poseType"];
  title: string;
  modelPosition: Vec3;
  modelRotation: Vec3;
  viewerPosition: Vec3;
  viewerTarget: Vec3;
  selfieTarget: Vec3;
  phonePosition: Vec3;
}

export interface ThreeDSelfieCameraConfig {
  position: Vec3;
  target: Vec3;
  fov: number;
  near: number;
  far: number;
}

export interface ThreeDLightingConfig {
  id: SceneState["lightingMode"];
  label: string;
  background: string;
  ambientIntensity: number;
  ceilingIntensity: number;
  lampIntensity: number;
  phoneIntensity: number;
  daylightIntensity: number;
  curtainsOpen: boolean;
}

const SELFIE_PREVIEW_FOV = 55;
const CAMERA_DISTANCE_SCALE: Record<SceneState["cameraDistance"], number> = {
  close: 0.78,
  "arm-length": 1,
  extended: 1.18,
};
const CAMERA_ANGLE_OFFSET: Record<SceneState["cameraAngle"], number> = {
  "eye-level": 0,
  "slightly-above": 0.16,
  "slightly-below": -0.14,
};

export const THREE_D_POSES: readonly ThreeDPoseConfig[] = [
  {
    id: "standing",
    title: "وقوف",
    modelPosition: [0, 0, 0],
    modelRotation: [0, 0, 0],
    viewerPosition: [3.8, 2.2, 4.5],
    viewerTarget: [0, 1, 0],
    selfieTarget: [0, 1.52, 0],
    phonePosition: [0.45, 1.45, 0.55],
  },
  {
    id: "standing-window",
    title: "الوقوف قرب النافذة",
    modelPosition: [0, 0, -3.5],
    modelRotation: [0, Math.PI, 0],
    viewerPosition: [3.2, 2.1, 0.8],
    viewerTarget: [0, 1.0, -3.5],
    selfieTarget: [0, 1.52, -3.5],
    phonePosition: [-0.42, 1.45, -2.96],
  },
  {
    id: "standing-wardrobe",
    title: "الوقوف أمام الخزانة",
    modelPosition: [2.35, 0, -0.45],
    modelRotation: [0, -1.1, 0],
    viewerPosition: [4.4, 2.15, 3.2],
    viewerTarget: [2.35, 1.0, -0.45],
    selfieTarget: [2.35, 1.52, -0.45],
    phonePosition: [1.8, 1.46, 0.05],
  },
  {
    id: "leaning-dresser",
    title: "اتكاء خفيف على خزانة الأدراج",
    modelPosition: [3.7, 0, -1.35],
    modelRotation: [0, -0.55, 0.06],
    viewerPosition: [4.4, 2.2, 3.5],
    viewerTarget: [3.55, 1.0, -1.2],
    selfieTarget: [3.55, 1.48, -1.2],
    phonePosition: [2.95, 1.42, -0.62],
  },
  {
    id: "sitting-chair",
    title: "الجلوس على كرسي",
    modelPosition: [1.5, 0.45, 1.0],
    modelRotation: [0, -0.7, 0],
    viewerPosition: [4.0, 2.0, 4.0],
    viewerTarget: [1.5, 1.0, 1.0],
    selfieTarget: [1.5, 1.2, 1.0],
    phonePosition: [0.92, 1.35, 1.55],
  },
  {
    id: "sitting-bed",
    title: "الجلوس على السرير",
    modelPosition: [-1.8, 0.55, -1.2],
    modelRotation: [0, 0.5, 0],
    viewerPosition: [1.3, 2.0, 3.2],
    viewerTarget: [-1.8, 1.05, -1.2],
    selfieTarget: [-1.8, 1.25, -1.2],
    phonePosition: [-1.18, 1.48, -0.58],
  },
  {
    id: "sitting-bed-edge",
    title: "الجلوس على حافة السرير",
    modelPosition: [-1.25, 0.5, 0.2],
    modelRotation: [0, 0.22, 0],
    viewerPosition: [1.55, 1.9, 3.55],
    viewerTarget: [-1.25, 1.0, 0.2],
    selfieTarget: [-1.25, 1.22, 0.2],
    phonePosition: [-0.6, 1.42, 0.82],
  },
  {
    id: "sitting-bed-cross-legged",
    title: "الجلوس متربعاً على السرير",
    modelPosition: [-1.85, 0.72, -1.05],
    modelRotation: [0, 0.38, 0],
    viewerPosition: [1.2, 2.15, 3.0],
    viewerTarget: [-1.8, 1.08, -1.0],
    selfieTarget: [-1.8, 1.22, -1.0],
    phonePosition: [-1.14, 1.44, -0.42],
  },
  {
    id: "reclining-headboard",
    title: "اتكاء على لوح السرير",
    modelPosition: [-1.8, 0.82, -2.05],
    modelRotation: [-0.38, 0.2, 0],
    viewerPosition: [0.7, 2.55, 2.7],
    viewerTarget: [-1.8, 1.0, -1.7],
    selfieTarget: [-1.8, 1.08, -1.78],
    phonePosition: [-1.28, 1.48, -1.1],
  },
  {
    id: "lying-bed",
    title: "الاستلقاء على السرير",
    modelPosition: [-1.8, 0.55, -1.0],
    modelRotation: [-Math.PI / 2, 0, 0],
    viewerPosition: [0.1, 3.4, 1.9],
    viewerTarget: [-1.8, 0.8, -1.0],
    selfieTarget: [-1.8, 0.78, -1.0],
    phonePosition: [-1.8, 1.35, -0.18],
  },
] as const;

export const THREE_D_LIGHTING: Record<
  SceneState["lightingMode"],
  ThreeDLightingConfig
> = {
  "as-in-photo": {
    id: "as-in-photo",
    label: "كما في الصورة",
    background: "#151312",
    ambientIntensity: 0.5,
    ceilingIntensity: 0.55,
    lampIntensity: 2.4,
    phoneIntensity: 0.12,
    daylightIntensity: 0,
    curtainsOpen: false,
  },
  "phone-screen": {
    id: "phone-screen",
    label: "شاشة الهاتف",
    background: "#080a0f",
    ambientIntensity: 0.05,
    ceilingIntensity: 0,
    lampIntensity: 0,
    phoneIntensity: 1.35,
    daylightIntensity: 0,
    curtainsOpen: false,
  },
  "bedside-lamp-only": {
    id: "bedside-lamp-only",
    label: "مصباح السرير فقط",
    background: "#100b08",
    ambientIntensity: 0.12,
    ceilingIntensity: 0,
    lampIntensity: 3.0,
    phoneIntensity: 0.03,
    daylightIntensity: 0,
    curtainsOpen: false,
  },
  "ceiling-only": {
    id: "ceiling-only",
    label: "سبوتات السقف فقط",
    background: "#171716",
    ambientIntensity: 0.25,
    ceilingIntensity: 0.92,
    lampIntensity: 0,
    phoneIntensity: 0.03,
    daylightIntensity: 0,
    curtainsOpen: false,
  },
  "blue-hour-closed": {
    id: "blue-hour-closed",
    label: "الساعة الزرقاء / ستائر مغلقة",
    background: "#162233",
    ambientIntensity: 0.16,
    ceilingIntensity: 0,
    lampIntensity: 0,
    phoneIntensity: 0.03,
    daylightIntensity: 0.22,
    curtainsOpen: false,
  },
  "daylight-closed": {
    id: "daylight-closed",
    label: "نهار / ستائر مغلقة",
    background: "#9da6ad",
    ambientIntensity: 0.55,
    ceilingIntensity: 0,
    lampIntensity: 0,
    phoneIntensity: 0.04,
    daylightIntensity: 0.8,
    curtainsOpen: false,
  },
  "daylight-open": {
    id: "daylight-open",
    label: "نهار / ستائر مفتوحة",
    background: "#c6d2dc",
    ambientIntensity: 0.8,
    ceilingIntensity: 0,
    lampIntensity: 0,
    phoneIntensity: 0.03,
    daylightIntensity: 1.7,
    curtainsOpen: true,
  },
  "overcast-open": {
    id: "overcast-open",
    label: "نهار غائم / ستائر مفتوحة",
    background: "#aebbc4",
    ambientIntensity: 0.72,
    ceilingIntensity: 0,
    lampIntensity: 0,
    phoneIntensity: 0.03,
    daylightIntensity: 1.05,
    curtainsOpen: true,
  },
};

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(vector: Vec3, factor: number): Vec3 {
  return [vector[0] * factor, vector[1] * factor, vector[2] * factor];
}

function horizontalRight(vector: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[2]);
  if (length === 0) return [1, 0, 0];
  return [vector[2] / length, 0, -vector[0] / length];
}

export function getThreeDPose(
  poseType: SceneState["poseType"],
): ThreeDPoseConfig {
  return THREE_D_POSES.find((pose) => pose.id === poseType) ?? THREE_D_POSES[0];
}

export function getThreeDSelfieCamera(
  state: SceneState,
): ThreeDSelfieCameraConfig {
  const pose = getThreeDPose(state.poseType);
  const baseVector = subtract(pose.phonePosition, pose.selfieTarget);
  const distanceScaled = scale(
    baseVector,
    CAMERA_DISTANCE_SCALE[state.cameraDistance],
  );
  let position = add(pose.selfieTarget, distanceScaled);

  const angleOffset = CAMERA_ANGLE_OFFSET[state.cameraAngle];
  position = add(position, [0, angleOffset, 0]);

  if (state.phonePosition === "side-soft") {
    position = add(position, scale(horizontalRight(baseVector), 0.22));
  } else if (state.phonePosition === "chest-level") {
    position = add(position, [0, -0.32, 0]);
  } else if (
    state.phonePosition === "above-chest" &&
    state.poseType !== "lying-bed"
  ) {
    position = add(position, [0, 0.18, 0]);
  }

  return {
    position,
    target: [...pose.selfieTarget],
    fov: SELFIE_PREVIEW_FOV,
    near: 0.05,
    far: 20,
  };
}

export function getThreeDLighting(
  lightingMode: SceneState["lightingMode"],
): ThreeDLightingConfig {
  return THREE_D_LIGHTING[lightingMode];
}

export function selectThreeDPose(
  state: SceneState,
  poseType: SceneState["poseType"],
): SceneState {
  return resolveLockedState({ ...state, poseType });
}

export function selectThreeDLighting(
  state: SceneState,
  lightingMode: SceneState["lightingMode"],
): SceneState {
  return { ...state, lightingMode };
}
