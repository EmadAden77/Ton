import { resolveLockedState } from "./state";
import type { SceneState } from "./types";

type ScenarioId = Exclude<NonNullable<SceneState["scenario"]>, "none">;

export interface ScenarioPreset {
  id: ScenarioId;
  labelAr: string;
  labelEn: string;
  apply: (current: SceneState) => SceneState;
}

function resolvedPreset(
  apply: (current: SceneState) => SceneState,
): (current: SceneState) => SceneState {
  return (current) => resolveLockedState(apply(current));
}

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "working-laptop",
    labelAr: "أعمل على لابتوب في المكتب",
    labelEn: "Working on laptop at desk",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "working-laptop",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "sitting-chair",
      handPlacement: "at-side",
      freeHandPosition: "on-keyboard",
      phonePosition: "side-soft",
      headDirection: "down",
      eyeDirection: "down-soft",
      faceExpression: "calm-focus",
      lightingMode: "as-in-photo",
    })),
  },
  {
    id: "bed-laptop",
    labelAr: "أجلس على السرير مع اللابتوب",
    labelEn: "Sitting on bed with laptop",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "bed-laptop",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "sitting-bed",
      handPlacement: "at-side",
      freeHandPosition: "on-keyboard",
      phonePosition: "side-soft",
      headDirection: "down",
      eyeDirection: "down-soft",
      faceExpression: "calm-focus",
      lightingMode: "as-in-photo",
    })),
  },
  {
    id: "mirror-selfie",
    labelAr: "سيلفي أمام المرآة",
    labelEn: "Mirror selfie",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "mirror-selfie",
      shotType: "mirror-selfie",
      cameraDistance: "arm-length",
      cameraAngle: "eye-level",
      poseType: "standing",
      phonePosition: "chest-level",
      freeHandPosition: "at-side",
      faceExpression: "soft-smile",
      eyeDirection: "mirror",
      mouthState: "smile-closed",
      lightingMode: "as-in-photo",
    })),
  },
  {
    id: "getting-ready",
    labelAr: "أجهّز نفسي للخروج",
    labelEn: "Getting ready to go out",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "getting-ready",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "standing",
      handPlacement: "at-side",
      freeHandPosition: "on-hair",
      phonePosition: "side-soft",
      faceExpression: "calm-focus",
      eyeDirection: "mirror",
      lightingMode: "daylight-open",
    })),
  },
  {
    id: "lying-with-phone",
    labelAr: "مستلقٍ على السرير ألتقط سيلفي",
    labelEn: "Lying on bed taking a selfie",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "lying-with-phone",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "lying-bed",
      freeHandPosition: "on-chest",
      phonePosition: "above-chest",
      headDirection: "slightly-right",
      eyeDirection: "down-soft",
      faceExpression: "neutral",
      lightingMode: "phone-screen",
    })),
  },
  {
    id: "standing-window",
    labelAr: "واقف قرب النافذة",
    labelEn: "Standing by the window",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "standing-window",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "standing-window",
      handPlacement: "at-side",
      freeHandPosition: "at-side",
      phonePosition: "side-soft",
      headDirection: "forward",
      eyeDirection: "away-soft",
      faceExpression: "calm-focus",
      lightingMode: "daylight-open",
    })),
  },
  {
    id: "choosing-clothes",
    labelAr: "أختار ملابس من الخزانة",
    labelEn: "Choosing clothes from the closet",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "choosing-clothes",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "standing",
      freeHandPosition: "holding-cloth",
      phonePosition: "side-soft",
      faceExpression: "calm-focus",
      eyeDirection: "down-soft",
      headDirection: "down",
      lightingMode: "as-in-photo",
    })),
  },
  {
    id: "adjusting-clothing",
    labelAr: "أعدّل ملابسي قبل الخروج",
    labelEn: "Adjusting clothing before going out",
    apply: resolvedPreset((current) => ({
      ...current,
      scenario: "adjusting-clothing",
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      poseType: "standing",
      freeHandPosition: "on-hair",
      phonePosition: "side-soft",
      faceExpression: "calm-focus",
      eyeDirection: "mirror",
      headDirection: "forward",
      shoulderPosition: "relaxed",
      backPosture: "straight",
      clothingTop: "sweater",
      clothingBottom: "jeans",
      lightingMode: "daylight-open",
    })),
  },
];
