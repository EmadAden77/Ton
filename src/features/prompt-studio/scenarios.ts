import type { SceneState } from "./types";

type ScenarioId = Exclude<NonNullable<SceneState["scenario"]>, "none">;

export interface ScenarioPreset {
  id: ScenarioId;
  labelAr: string;
  labelEn: string;
  apply: (current: SceneState) => SceneState;
}

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "working-laptop",
    labelAr: "أعمل على لابتوب في المكتب",
    labelEn: "Working on laptop at desk",
    apply: (current) => ({
      ...current,
      scenario: "working-laptop",
      poseType: "sitting-chair",
      handPlacement: "at-side",
      freeHandPosition: "on-keyboard",
      headDirection: "down",
      eyeDirection: "down-soft",
      faceExpression: "calm-focus",
      lightingMode: "as-in-photo",
    }),
  },
  {
    id: "bed-laptop",
    labelAr: "أجلس على السرير مع اللابتوب",
    labelEn: "Sitting on bed with laptop",
    apply: (current) => ({
      ...current,
      scenario: "bed-laptop",
      poseType: "sitting-bed",
      handPlacement: "at-side",
      freeHandPosition: "on-keyboard",
      headDirection: "down",
      eyeDirection: "down-soft",
      faceExpression: "calm-focus",
      lightingMode: "as-in-photo",
    }),
  },
  {
    id: "mirror-selfie",
    labelAr: "سيلفي أمام المرآة",
    labelEn: "Mirror selfie",
    apply: (current) => ({
      ...current,
      scenario: "mirror-selfie",
      shotType: "mirror-selfie",
      cameraDistance: "arm-length",
      cameraAngle: "eye-level",
      faceExpression: "soft-smile",
      eyeDirection: "mirror",
      mouthState: "smile-closed",
      lightingMode: "as-in-photo",
    }),
  },
  {
    id: "getting-ready",
    labelAr: "أجهّز نفسي للخروج",
    labelEn: "Getting ready to go out",
    apply: (current) => ({
      ...current,
      scenario: "getting-ready",
      poseType: "standing",
      handPlacement: "at-side",
      freeHandPosition: "on-hair",
      faceExpression: "calm-focus",
      eyeDirection: "mirror",
      lightingMode: "daylight-open",
    }),
  },
  {
    id: "lying-with-phone",
    labelAr: "مستلقٍ على السرير أستخدم الهاتف",
    labelEn: "Lying on bed using phone",
    apply: (current) => ({
      ...current,
      scenario: "lying-with-phone",
      poseType: "lying-bed",
      freeHandPosition: "holding-phone",
      headDirection: "slightly-right",
      eyeDirection: "down-soft",
      faceExpression: "neutral",
      lightingMode: "phone-screen",
    }),
  },
  {
    id: "standing-window",
    labelAr: "واقف قرب النافذة",
    labelEn: "Standing by the window",
    apply: (current) => ({
      ...current,
      scenario: "standing-window",
      poseType: "standing-window",
      handPlacement: "at-side",
      freeHandPosition: "at-side",
      headDirection: "forward",
      eyeDirection: "away-soft",
      faceExpression: "calm-focus",
      lightingMode: "daylight-open",
    }),
  },
  {
    id: "choosing-clothes",
    labelAr: "أختار ملابس من الخزانة",
    labelEn: "Choosing clothes from the closet",
    apply: (current) => ({
      ...current,
      scenario: "choosing-clothes",
      poseType: "standing",
      freeHandPosition: "holding-cloth",
      faceExpression: "calm-focus",
      eyeDirection: "down-soft",
      headDirection: "down",
      lightingMode: "as-in-photo",
    }),
  },
  {
    id: "adjusting-clothing",
    labelAr: "أعدّل ملابسي قبل الخروج",
    labelEn: "Adjusting clothing before going out",
    apply: (current) => ({
      ...current,
      scenario: "adjusting-clothing",
      poseType: "standing",
      freeHandPosition: "on-hair",
      faceExpression: "calm-focus",
      eyeDirection: "mirror",
      headDirection: "forward",
      shoulderPosition: "relaxed",
      backPosture: "straight",
      clothingTop: "sweater",
      clothingBottom: "jeans",
      lightingMode: "daylight-open",
    }),
  },
];
