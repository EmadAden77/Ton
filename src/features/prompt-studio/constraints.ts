import {
  getMicroPoseRule,
  MICRO_POSE_VALUES,
  type MicroPoseField,
} from "./microPose";
import type { SceneState } from "./types";

export interface ConstraintOption {
  value: string;
  disabled: boolean;
  reason?: string;
}

export interface FieldConstraints {
  options: ConstraintOption[];
  lockedTo?: string;
  lockReason?: string;
}

type CoreConstrainedField =
  | "poseType"
  | "cameraDistance"
  | "identityPriority"
  | "clothingMaterial"
  | "hairStyle"
  | "shoulderPosition"
  | "backPosture"
  | "freeHandPosition"
  | "phonePosition"
  | "eyeDirection"
  | "faceExpression"
  | "mouthState"
  | "handFingersState"
  | "handVisibility";

type ConstrainedField = CoreConstrainedField | MicroPoseField;

type Rule = {
  allowed?: readonly string[];
  disabled?: readonly string[];
  reason?: string;
  lockedTo?: string;
  lockReason?: string;
};

const values: Record<ConstrainedField, readonly string[]> = {
  poseType: [
    "standing",
    "sitting-bed",
    "sitting-chair",
    "lying-bed",
    "standing-window",
    "sitting-bed-edge",
    "sitting-bed-cross-legged",
    "reclining-headboard",
    "standing-wardrobe",
    "leaning-dresser",
  ],
  cameraDistance: ["close", "arm-length", "extended"],
  identityPriority: ["strict", "balanced", "flexible"],
  clothingMaterial: [
    "cotton",
    "denim",
    "wool",
    "polyester",
    "linen",
    "jersey",
    "fleece",
    "poplin",
  ],
  hairStyle: ["natural", "combed", "messy-light", "combed-back", "side-part"],
  shoulderPosition: ["relaxed", "one-raised", "both-back"],
  backPosture: ["straight", "relaxed", "slightly-leaning"],
  freeHandPosition: [
    "at-side",
    "on-hair",
    "holding-cup",
    "touching-chin",
    "in-pocket",
    "on-bed",
    "on-chest",
    "on-keyboard",
    "holding-cloth",
    "holding-phone",
  ],
  phonePosition: ["front-of-face", "chest-level", "above-chest", "side-soft"],
  eyeDirection: ["camera", "mirror", "away-soft", "down-soft"],
  faceExpression: [
    "neutral",
    "soft-smile",
    "closed-smile",
    "calm-focus",
    "side-glance",
    "thinking",
    "sleepy",
    "light-laugh",
  ],
  mouthState: ["closed", "slightly-open", "smile-closed", "smile-open-light"],
  handFingersState: ["relaxed", "slightly-curled", "gripping-soft"],
  handVisibility: ["fully-visible", "partially-visible", "off-frame"],
  legConfiguration: MICRO_POSE_VALUES.legConfiguration,
  torsoLean: MICRO_POSE_VALUES.torsoLean,
  pelvisOrientation: MICRO_POSE_VALUES.pelvisOrientation,
  weightDistribution: MICRO_POSE_VALUES.weightDistribution,
};

export const CONSTRAINED_FIELDS = Object.keys(values) as ConstrainedField[];

const BED_SEATED_POSES: readonly SceneState["poseType"][] = [
  "sitting-bed",
  "sitting-bed-edge",
  "sitting-bed-cross-legged",
];

const STANDING_POSES: readonly SceneState["poseType"][] = [
  "standing",
  "standing-window",
  "standing-wardrobe",
  "leaning-dresser",
];

const TOP_MATERIALS: Record<
  SceneState["clothingTop"],
  readonly SceneState["clothingMaterial"][]
> = {
  "t-shirt": ["cotton", "jersey", "polyester"],
  "long-sleeve-tshirt": ["cotton", "jersey", "polyester"],
  "polo-shirt": ["cotton", "jersey", "polyester"],
  henley: ["cotton", "jersey", "linen"],
  shirt: ["cotton", "poplin", "linen", "polyester"],
  overshirt: ["cotton", "denim", "wool", "linen"],
  hoodie: ["cotton", "fleece", "polyester", "jersey"],
  "pajama-top": ["cotton", "jersey", "polyester"],
  sweater: ["wool", "cotton", "fleece", "polyester"],
  "tank-top": ["cotton", "jersey", "polyester"],
};

const VISIBLE_ACTION_HANDS: readonly SceneState["freeHandPosition"][] = [
  "on-hair",
  "holding-cup",
  "holding-phone",
  "touching-chin",
  "on-keyboard",
  "holding-cloth",
];

const GRIPPING_HANDS: readonly SceneState["freeHandPosition"][] = [
  "holding-cup",
  "holding-phone",
  "holding-cloth",
];

const rules: Record<ConstrainedField, (state: SceneState) => Rule> = {
  poseType: (state) =>
    state.shotType === "mirror-selfie"
      ? {
          lockedTo: "standing-wardrobe",
          lockReason:
            "سيلفي المرآة يجب أن يكون أمام المرآة الفعلية في الخزانة داخل الغرفة الثابتة",
        }
      : {},

  cameraDistance: (state) =>
    state.shotType === "mirror-selfie"
      ? {
          lockedTo: "arm-length",
          lockReason: "سيلفي المرآة يتطلب مسافة طول الذراع",
        }
      : {},

  identityPriority: (state) =>
    state.referenceProvided
      ? {}
      : {
          lockedTo: "balanced",
          lockReason: "أولوية الهوية لا يكون لها أثر من دون صورة مرجعية",
        },

  clothingMaterial: (state) => ({
    allowed: TOP_MATERIALS[state.clothingTop],
    reason: "الخامة المختارة لا تناسب بنية القطعة العلوية بشكل واقعي",
  }),

  hairStyle: (state) =>
    state.hairLength === "short"
      ? {
          disabled: ["combed-back"],
          reason: "التسريح الكامل للخلف يحتاج طول شعر كافياً ولا يجب اختراع طول إضافي",
        }
      : {},

  shoulderPosition: (state) =>
    state.poseType === "lying-bed" || state.poseType === "reclining-headboard"
      ? {
          disabled: ["both-back"],
          reason: "سحب الكتفين للخلف يتعارض مع سطح الدعم خلف الكتفين والظهر",
        }
      : {},

  backPosture: (state) => {
    if (state.poseType === "lying-bed") {
      return {
        lockedTo: "relaxed",
        lockReason: "الاستلقاء يتطلب ظهراً مدعوماً ومسترخياً على المرتبة",
      };
    }

    if (
      state.poseType === "reclining-headboard" ||
      state.poseType === "leaning-dresser" ||
      state.torsoLean !== "neutral"
    ) {
      return {
        lockedTo: "slightly-leaning",
        lockReason: "ميل الجذع أو الاتكاء يجب أن ينعكس على وضع الظهر الفعلي",
      };
    }

    return {};
  },

  freeHandPosition: (state) => {
    if (state.poseType === "lying-bed") {
      return {
        allowed: ["on-bed", "on-chest", "holding-phone"],
        reason: "غير منطقي في وضعية الاستلقاء",
      };
    }

    if (state.poseType === "reclining-headboard") {
      return {
        allowed: [
          "on-bed",
          "on-chest",
          "holding-phone",
          "touching-chin",
          "on-hair",
        ],
        reason: "موضع اليد لا يناسب الاتكاء على لوح السرير",
      };
    }

    if (state.poseType === "sitting-chair") {
      return {
        allowed: ["on-keyboard", "at-side", "holding-cup", "touching-chin"],
        reason: "موضع اليد لا يناسب الوضعية المختارة",
      };
    }

    if (STANDING_POSES.includes(state.poseType)) {
      return {
        disabled: ["on-bed", "on-chest", "on-keyboard"],
        reason: "موضع اليد لا يناسب وضعية الوقوف",
      };
    }

    if (BED_SEATED_POSES.includes(state.poseType)) {
      return {
        disabled: ["in-pocket"],
        reason: "موضع اليد لا يناسب الجلوس على السرير",
      };
    }

    return {};
  },

  phonePosition: (state) => {
    if (state.shotType === "mirror-selfie") {
      return {
        lockedTo: "chest-level",
        lockReason: "السيلفي أمام المرآة يضع الهاتف عند الصدر ضمن انعكاس طبيعي",
      };
    }

    if (state.poseType === "lying-bed") {
      return {
        lockedTo: "above-chest",
        lockReason: "الاستلقاء يتطلب رفع الهاتف فوق الصدر ضمن مدى الذراع",
      };
    }

    return {};
  },

  eyeDirection: (state) => {
    if (state.shotType === "mirror-selfie") {
      return {
        lockedTo: "mirror",
        lockReason: "سيلفي المرآة يتطلب النظر إلى المرآة",
      };
    }

    const disabled: SceneState["eyeDirection"][] = [];
    if (state.poseType !== "standing-wardrobe") disabled.push("mirror");
    if (state.faceExpression === "side-glance") disabled.push("camera");

    return disabled.length
      ? {
          disabled,
          reason:
            "اتجاه النظر يجب أن يتوافق مع موقع المرآة الفعلي وتعبير الوجه المختار",
        }
      : {};
  },

  faceExpression: (state) =>
    state.poseType === "lying-bed"
      ? {
          disabled: ["light-laugh"],
          reason: "الضحك الخفيف لا يناسب وضعية الاستلقاء الهادئة في هذا المشهد",
        }
      : {},

  mouthState: (state) => {
    if (state.faceExpression === "closed-smile") {
      return {
        lockedTo: "smile-closed",
        lockReason: "الابتسامة المغلقة تتطلب بقاء الفم في ابتسامة مغلقة",
      };
    }

    if (state.faceExpression === "soft-smile") {
      return {
        allowed: ["smile-closed", "smile-open-light"],
        reason: "حالة الفم لا تتوافق مع ابتسامة خفيفة",
      };
    }

    if (state.faceExpression === "light-laugh") {
      return {
        allowed: ["slightly-open", "smile-open-light"],
        reason: "الضحكة الخفيفة تحتاج فتحة فم طبيعية وليست فماً مغلقاً",
      };
    }

    if (state.faceExpression === "sleepy") {
      return {
        allowed: ["closed", "slightly-open"],
        reason: "تعبير النعاس لا يتوافق مع ابتسامة مصطنعة",
      };
    }

    return {
      allowed: ["closed", "slightly-open"],
      reason: "حالة الفم لا تتوافق مع تعبير الوجه المختار",
    };
  },

  handFingersState: (state) => {
    if (state.handVisibility === "off-frame") {
      return {
        lockedTo: "relaxed",
        lockReason: "حالة الأصابع غير مرئية عندما تكون اليد خارج الإطار",
      };
    }

    if (GRIPPING_HANDS.includes(state.freeHandPosition)) {
      return {
        lockedTo: "gripping-soft",
        lockReason: "حمل جسم يتطلب قبضة خفيفة متصلة بالجسم المحمول",
      };
    }

    return {
      allowed: ["relaxed", "slightly-curled"],
      reason: "القبضة لا تناسب موضع اليد من دون جسم محمول",
    };
  },

  handVisibility: (state) => {
    if (state.freeHandPosition === "in-pocket") {
      return {
        allowed: ["partially-visible", "off-frame"],
        reason: "اليد داخل الجيب لا يمكن أن تكون ظاهرة بالكامل تشريحياً",
      };
    }

    if (VISIBLE_ACTION_HANDS.includes(state.freeHandPosition)) {
      return {
        disabled: ["off-frame"],
        reason: "الفعل المختار يحتاج أن تبقى اليد ظاهرة جزئياً على الأقل",
      };
    }

    return {};
  },

  legConfiguration: (state) => getMicroPoseRule("legConfiguration", state),
  torsoLean: (state) => getMicroPoseRule("torsoLean", state),
  pelvisOrientation: (state) => getMicroPoseRule("pelvisOrientation", state),
  weightDistribution: (state) => getMicroPoseRule("weightDistribution", state),
};

function optionReason(rule: Rule): string {
  return rule.reason ?? rule.lockReason ?? "الخيار لا يناسب المشهد الحالي";
}

export function getFieldConstraints(
  field: keyof SceneState,
  state: SceneState,
): FieldConstraints | null {
  if (!Object.prototype.hasOwnProperty.call(rules, field)) return null;

  const name = field as ConstrainedField;
  const rule = rules[name](state);
  const options = values[name].map((value): ConstraintOption => {
    const disabled =
      (rule.lockedTo !== undefined && value !== rule.lockedTo) ||
      (rule.allowed !== undefined && !rule.allowed.includes(value)) ||
      (rule.disabled?.includes(value) ?? false);

    return disabled
      ? {
          value,
          disabled: true,
          reason: optionReason(rule),
        }
      : { value, disabled: false };
  });

  return {
    options,
    lockedTo: rule.lockedTo,
    lockReason: rule.lockReason,
  };
}

export function getConflicts(state: SceneState): string[] {
  const conflicts: string[] = [];
  const lyingWithPhoneInFront =
    state.poseType === "lying-bed" && state.phonePosition === "front-of-face";

  if (lyingWithPhoneInFront) {
    conflicts.push("الهاتف أمام الوجه في وضعية الاستلقاء غير منطقي");
  }

  for (const field of CONSTRAINED_FIELDS) {
    if (field === "phonePosition" && lyingWithPhoneInFront) continue;

    const constraints = getFieldConstraints(field, state);
    const value = String(state[field]);
    const option = constraints?.options.find((item) => item.value === value);

    if (constraints?.lockedTo && value !== constraints.lockedTo) {
      conflicts.push(constraints.lockReason ?? "قيمة مقفلة غير متوافقة");
    } else if (option?.disabled) {
      conflicts.push(option.reason ?? "اختيار غير متوافق مع المشهد");
    }
  }

  return [...new Set(conflicts)];
}
