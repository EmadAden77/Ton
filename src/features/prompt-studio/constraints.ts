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

type ConstrainedField =
  | "cameraDistance"
  | "freeHandPosition"
  | "phonePosition"
  | "eyeDirection"
  | "faceExpression";

type Rule = {
  allowed?: readonly string[];
  disabled?: readonly string[];
  reason?: string;
  lockedTo?: string;
  lockReason?: string;
};

const values: Record<ConstrainedField, readonly string[]> = {
  cameraDistance: ["close", "arm-length", "extended"],
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
};

const rules: Record<ConstrainedField, (state: SceneState) => Rule> = {
  cameraDistance: (state) =>
    state.shotType === "mirror-selfie"
      ? {
          lockedTo: "arm-length",
          lockReason: "سيلفي المرآة يتطلب مسافة طول الذراع",
        }
      : {
          disabled: ["extended"],
          reason: "السيلفي الأمامي يتطلب مسافة قريبة",
        },

  freeHandPosition: (state) => {
    if (state.poseType === "lying-bed") {
      return {
        allowed: ["on-bed", "on-chest", "holding-phone"],
        reason: "غير منطقي في وضعية الاستلقاء",
      };
    }

    if (state.poseType === "sitting-chair") {
      return {
        allowed: ["on-keyboard", "at-side", "holding-cup", "touching-chin"],
        reason: "موضع اليد لا يناسب الوضعية المختارة",
      };
    }

    if (state.poseType === "standing") {
      return {
        disabled: ["on-bed", "on-chest"],
        reason: "موضع اليد لا يناسب الوقوف",
      };
    }

    if (state.poseType === "sitting-bed") {
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
        lockReason: "السيلفي أمام المرآة يضع الهاتف عند الصدر",
      };
    }

    if (state.poseType === "lying-bed") {
      return {
        lockedTo: "above-chest",
        lockReason: "الاستلقاء يتطلب رفع الهاتف فوق الصدر",
      };
    }

    // Front-camera selfies can be centered or held slightly to one side.
    // Do not over-constrain the phone here; pose-specific rules are stronger.
    return {};
  },

  eyeDirection: (state) =>
    state.shotType === "mirror-selfie"
      ? {
          lockedTo: "mirror",
          lockReason: "سيلفي المرآة يتطلب النظر إلى المرآة",
        }
      : state.poseType === "lying-bed"
        ? {
            allowed: ["down-soft", "camera", "away-soft"],
            reason: "اتجاه النظر لا يناسب الاستلقاء",
          }
        : {},

  faceExpression: (state) =>
    state.poseType === "lying-bed"
      ? {
          disabled: ["light-laugh"],
          reason: "الضحك لا يناسب وضعية الاستلقاء",
        }
      : {},
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

  for (const field of Object.keys(values) as ConstrainedField[]) {
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

  return conflicts;
}
