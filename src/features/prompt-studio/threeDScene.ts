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
  phonePosition: Vec3;
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

export const THREE_D_POSES: readonly ThreeDPoseConfig[] = [
  {
    id: "standing",
    title: "وقوف",
    modelPosition: [0, 0, 0],
    modelRotation: [0, 0, 0],
    viewerPosition: [3.8, 2.2, 4.5],
    viewerTarget: [0, 1, 0],
    phonePosition: [0.45, 1.45, 0.55],
  },
  {
    id: "sitting-bed",
    title: "الجلوس على السرير",
    modelPosition: [-1.8, 0.55, -1.2],
    modelRotation: [0, 0.5, 0],
    viewerPosition: [1.3, 2.0, 3.2],
    viewerTarget: [-1.8, 1.05, -1.2],
    phonePosition: [-1.18, 1.48, -0.58],
  },
  {
    id: "sitting-chair",
    title: "الجلوس على كرسي",
    modelPosition: [1.5, 0.45, 1.0],
    modelRotation: [0, -0.7, 0],
    viewerPosition: [4.0, 2.0, 4.0],
    viewerTarget: [1.5, 1.0, 1.0],
    phonePosition: [0.92, 1.35, 1.55],
  },
  {
    id: "lying-bed",
    title: "الاستلقاء على السرير",
    modelPosition: [-1.8, 0.55, -1.0],
    modelRotation: [-Math.PI / 2, 0, 0],
    viewerPosition: [0.1, 3.4, 1.9],
    viewerTarget: [-1.8, 0.8, -1.0],
    phonePosition: [-1.8, 1.35, -0.18],
  },
  {
    id: "standing-window",
    title: "الوقوف قرب النافذة",
    modelPosition: [0, 0, -3.5],
    modelRotation: [0, Math.PI, 0],
    viewerPosition: [3.2, 2.1, 0.8],
    viewerTarget: [0, 1.0, -3.5],
    phonePosition: [-0.42, 1.45, -2.96],
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
};

export function getThreeDPose(
  poseType: SceneState["poseType"],
): ThreeDPoseConfig {
  return THREE_D_POSES.find((pose) => pose.id === poseType) ?? THREE_D_POSES[0];
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
