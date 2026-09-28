import { getThreeDMicroPoseTransform } from "./microPose";
import { BEDROOM_DESIGN } from "./roomDesign";
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

const FREE_STANDING_MICRO_POSE: readonly SceneState["poseType"][] = [
  "standing",
  "standing-window",
  "standing-wardrobe",
];

const bedCenter = BEDROOM_DESIGN.bed.center;
const chairCenter = BEDROOM_DESIGN.chair.center;
const dresserCenter = BEDROOM_DESIGN.dresser.center;
const referenceViewerCamera = BEDROOM_DESIGN.reference.viewerCamera;

export const THREE_D_POSES: readonly ThreeDPoseConfig[] = [
  {
    id: "standing",
    title: "وقوف",
    modelPosition: [0.25, 0, 1.05],
    modelRotation: [0, 0, 0],
    viewerPosition: [2.15, 1.95, 2.7],
    viewerTarget: [0.2, 1, 0.55],
    selfieTarget: [0.25, 1.52, 1.05],
    phonePosition: [0.7, 1.45, 1.58],
  },
  {
    id: "standing-window",
    title: "الوقوف قرب الستائر الخلفية",
    modelPosition: [0, 0, -2.3],
    modelRotation: [0, Math.PI, 0],
    viewerPosition: [2.1, 1.95, 1.15],
    viewerTarget: [0, 1, -2.2],
    selfieTarget: [0, 1.52, -2.3],
    phonePosition: [-0.42, 1.45, -1.76],
  },
  {
    id: "standing-wardrobe",
    title: "الوقوف أمام الخزانة",
    modelPosition: [1.45, 0, -0.55],
    modelRotation: [0, -1.1, 0],
    viewerPosition: [2.25, 1.95, 2.25],
    viewerTarget: [1.45, 1, -0.55],
    selfieTarget: [1.45, 1.52, -0.55],
    phonePosition: [0.9, 1.46, -0.05],
  },
  {
    id: "leaning-dresser",
    title: "اتكاء خفيف على خزانة الأدراج",
    modelPosition: [dresserCenter[0] - 0.42, 0, dresserCenter[2] - 0.18],
    modelRotation: [0, -0.55, 0.06],
    viewerPosition: [1.0, 1.95, 2.8],
    viewerTarget: [dresserCenter[0] - 0.45, 1, dresserCenter[2] - 0.18],
    selfieTarget: [dresserCenter[0] - 0.45, 1.48, dresserCenter[2] - 0.18],
    phonePosition: [dresserCenter[0] - 1.02, 1.42, dresserCenter[2] + 0.38],
  },
  {
    id: "sitting-chair",
    title: "الجلوس على كرسي",
    modelPosition: [chairCenter[0], 0.46, chairCenter[2]],
    modelRotation: [0, -0.55, 0],
    viewerPosition: [2.05, 1.9, 0.45],
    viewerTarget: [chairCenter[0], 1.0, chairCenter[2]],
    selfieTarget: [chairCenter[0], 1.2, chairCenter[2]],
    phonePosition: [chairCenter[0] - 0.58, 1.35, chairCenter[2] + 0.55],
  },
  {
    id: "sitting-bed",
    title: "الجلوس على السرير",
    modelPosition: [bedCenter[0] + 0.18, 0.58, bedCenter[2]],
    modelRotation: [0, 0.5, 0],
    viewerPosition: [0.95, 1.95, 2.25],
    viewerTarget: [bedCenter[0] + 0.18, 1.05, bedCenter[2]],
    selfieTarget: [bedCenter[0] + 0.18, 1.25, bedCenter[2]],
    phonePosition: [bedCenter[0] + 0.8, 1.48, bedCenter[2] + 0.62],
  },
  {
    id: "sitting-bed-edge",
    title: "الجلوس على حافة السرير",
    modelPosition: [-0.62, 0.52, -0.05],
    modelRotation: [0, 0.22, 0],
    viewerPosition: [1.45, 1.9, 2.35],
    viewerTarget: [-0.62, 1, -0.05],
    selfieTarget: [-0.62, 1.22, -0.05],
    phonePosition: [0.03, 1.42, 0.57],
  },
  {
    id: "sitting-bed-cross-legged",
    title: "الجلوس متربعاً على السرير",
    modelPosition: [bedCenter[0] + 0.12, 0.74, bedCenter[2]],
    modelRotation: [0, 0.38, 0],
    viewerPosition: [0.85, 2.1, 2.0],
    viewerTarget: [bedCenter[0] + 0.12, 1.08, bedCenter[2]],
    selfieTarget: [bedCenter[0] + 0.12, 1.22, bedCenter[2]],
    phonePosition: [bedCenter[0] + 0.78, 1.44, bedCenter[2] + 0.63],
  },
  {
    id: "reclining-headboard",
    title: "اتكاء على لوح السرير",
    modelPosition: [-2.05, 0.82, bedCenter[2]],
    modelRotation: [-0.38, 0.18, 0],
    viewerPosition: [0.55, 2.35, 1.7],
    viewerTarget: [-1.92, 1.0, bedCenter[2]],
    selfieTarget: [-1.92, 1.08, bedCenter[2]],
    phonePosition: [-1.35, 1.48, bedCenter[2] + 0.72],
  },
  {
    id: "lying-bed",
    title: "الاستلقاء على السرير",
    modelPosition: [bedCenter[0] + 0.08, 0.58, bedCenter[2]],
    modelRotation: [-Math.PI / 2, 0, 0],
    viewerPosition: [0.35, 2.9, 1.45],
    viewerTarget: [bedCenter[0] + 0.08, 0.82, bedCenter[2]],
    selfieTarget: [bedCenter[0] + 0.08, 0.78, bedCenter[2]],
    phonePosition: [bedCenter[0] + 0.08, 1.38, bedCenter[2] + 0.82],
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
    ambientIntensity: 0.42,
    ceilingIntensity: 0.5,
    lampIntensity: 2.15,
    phoneIntensity: 0.1,
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
    lampIntensity: 3,
    phoneIntensity: 0.03,
    daylightIntensity: 0,
    curtainsOpen: false,
  },
  "ceiling-only": {
    id: "ceiling-only",
    label: "سبوتات السقف فقط",
    background: "#171716",
    ambientIntensity: 0.24,
    ceilingIntensity: 0.86,
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

export function canApplyWholeBodyMicroPoseApproximation(
  poseType: SceneState["poseType"],
): boolean {
  return FREE_STANDING_MICRO_POSE.includes(poseType);
}

export function getThreeDPoseForState(state: SceneState): ThreeDPoseConfig {
  const base = getThreeDPose(state.poseType);
  const micro = getThreeDMicroPoseTransform(state);
  const canApproximate = canApplyWholeBodyMicroPoseApproximation(
    state.poseType,
  );
  const positionOffset = (
    canApproximate ? micro.positionOffset : [0, 0, 0]
  ) as Vec3;
  const rotationOffset = (
    canApproximate ? micro.rotationOffset : [0, 0, 0]
  ) as Vec3;

  return {
    ...base,
    modelPosition: add(base.modelPosition, positionOffset),
    modelRotation: add(base.modelRotation, rotationOffset),
    viewerPosition: [...referenceViewerCamera.position] as Vec3,
    viewerTarget: [...referenceViewerCamera.target] as Vec3,
    selfieTarget: add(base.selfieTarget, positionOffset),
    phonePosition: add(base.phonePosition, positionOffset),
  };
}

export function getThreeDSelfieCamera(
  state: SceneState,
): ThreeDSelfieCameraConfig {
  const pose = getThreeDPoseForState(state);
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
  return resolveLockedState({ ...state, lightingMode });
}
