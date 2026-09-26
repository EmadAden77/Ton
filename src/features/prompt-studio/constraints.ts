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
  "cameraDistance" | "freeHandPosition" | "eyeDirection" | "faceExpression";

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
    "on-keyboard",
    "holding-cloth",
    "holding-phone",
  ],
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
    const allowedByPose: Partial<
      Record<SceneState["poseType"], readonly SceneState["freeHandPosition"][]>
    > = {
      "lying-bed": ["holding-phone", "on-bed", "at-side"],
      "sitting-chair": [
        "on-keyboard",
        "at-side",
        "holding-cup",
        "touching-chin",
      ],
    };

    const allowed = allowedByPose[state.poseType];
    if (allowed) {
      return {
        allowed,
        reason: "موضع اليد لا يناسب الوضعية المختارة",
      };
    }

    if (state.poseType === "standing") {
      return {
        disabled: ["on-bed", "on-keyboard"],
        reason: "موضع اليد لا يناسب الوقوف",
      };
    }

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

  for (const field of Object.keys(values) as ConstrainedField[]) {
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
