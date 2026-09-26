import type { SceneState } from "./types";

export interface ConstraintOption {
  value: string;
  disabled: boolean;
  reason?: string; // سبب التعطيل بالعربية.
}

export interface FieldConstraints {
  options: ConstraintOption[];
  lockedTo?: string; // القيمة المفروضة على الحقل.
  lockReason?: string; // سبب فرض القيمة.
}

type ConstrainedField =
  | "lightingSource"
  | "lightingIntensity"
  | "lightingDirection"
  | "colorTemperature"
  | "cameraDistance"
  | "freeHandPosition"
  | "roomHasBed"
  | "poseType"
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
  lightingSource: ["window-day", "window-sunset", "ceiling", "bedside-lamp"],
  lightingIntensity: ["dim", "soft", "medium", "bright"],
  lightingDirection: ["front", "side", "top", "back-soft"],
  colorTemperature: ["warm", "neutral", "cool"],
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
  roomHasBed: ["true", "false"],
  poseType: [
    "standing",
    "sitting-bed",
    "sitting-chair",
    "lying-bed",
    "standing-window",
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

// خريطة قواعد المصادر: تقبل مصدراً قديماً أو مستقبلياً دون تغيير نوع الحالة.
const intensityRules: Record<string, Rule> = {
  "window-day": {
    allowed: ["soft", "medium", "bright"],
    reason: "ضوء النهار لا يناسب شدة خافتة",
  },
  "window-sunset": {
    allowed: ["soft", "medium"],
    reason: "ضوء الغروب يناسب شدة ناعمة أو متوسطة",
  },
  "bedside-lamp": {
    allowed: ["dim", "soft"],
    reason: "مصباح السرير يناسب شدة خافتة أو ناعمة",
  },
  "laptop-screen": {
    allowed: ["dim"],
    reason: "ضوء شاشة الحاسوب خافت",
  },
};

const directionRules: Record<string, Rule> = {
  ceiling: { lockedTo: "top", lockReason: "إضاءة السقف تأتي من الأعلى" },
  "bedside-lamp": {
    lockedTo: "side",
    lockReason: "مصباح السرير يضيء من الجانب",
  },
  "laptop-screen": {
    lockedTo: "front",
    lockReason: "الشاشة تضيء الوجه من الأمام",
  },
};

const temperatureRules: Record<string, Rule> = {
  "window-sunset": {
    lockedTo: "warm",
    lockReason: "ضوء الغروب دافئ",
  },
  "bedside-lamp": {
    lockedTo: "warm",
    lockReason: "مصباح السرير يعطي ضوءاً دافئاً",
  },
  ceiling: {
    lockedTo: "neutral",
    lockReason: "إضاءة السقف محايدة",
  },
  "window-day": {
    allowed: ["neutral", "cool"],
    reason: "ضوء النافذة النهاري محايد أو بارد",
  },
};

// كل حقل يقرأ الحالة الحالية فقط؛ لا تتغير الحالة أثناء حساب القيود.
const rules: Record<ConstrainedField, (state: SceneState) => Rule> = {
  lightingSource: (state) => {
    if (state.poseType === "lying-bed") {
      return {
        lockedTo: "bedside-lamp",
        lockReason: "الاستلقاء على السرير يتطلب إضاءة مصباح السرير",
      };
    }
    const disabled = [
      ...(state.roomHasBed ? [] : ["bedside-lamp"]),
      ...(state.roomWindow === "none" ? ["window-day", "window-sunset"] : []),
    ];
    return { disabled };
  },
  lightingIntensity: (state) => intensityRules[state.lightingSource] ?? {},
  lightingDirection: (state) => directionRules[state.lightingSource] ?? {},
  colorTemperature: (state) => temperatureRules[state.lightingSource] ?? {},
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
    const allowedByPose: Record<string, readonly string[]> = {
      "lying-bed": ["holding-phone", "on-bed", "at-side"],
      "sitting-chair": [
        "on-keyboard",
        "at-side",
        "holding-cup",
        "touching-chin",
      ],
    };
    if (allowedByPose[state.poseType]) {
      return {
        allowed: allowedByPose[state.poseType],
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
  roomHasBed: (state) =>
    state.poseType === "lying-bed" || state.poseType === "sitting-bed"
      ? { lockedTo: "true", lockReason: "هذه الوضعية تتطلب وجود سرير" }
      : {},
  poseType: (state) => ({
    disabled: [
      ...(state.roomHasBed ? [] : ["sitting-bed", "lying-bed"]),
      ...(state.roomWindow === "none" ? ["standing-window"] : []),
    ],
  }),
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
    state.poseType === "lying-bed" && state.lightingIntensity === "dim"
      ? {
          disabled: ["light-laugh"],
          reason: "الضحك لا يناسب مشهد الاستلقاء بإضاءة خافتة",
        }
      : {},
};

function optionReason(
  field: ConstrainedField,
  value: string,
  state: SceneState,
  rule: Rule,
): string {
  if (field === "lightingSource") {
    if (value === "bedside-lamp" && !state.roomHasBed) {
      return "لا يوجد سرير في الغرفة";
    }
    if (
      (value === "window-day" || value === "window-sunset") &&
      state.roomWindow === "none"
    ) {
      return "لا توجد نافذة";
    }
  }
  if (field === "poseType") {
    if (value === "standing-window") return "لا توجد نافذة";
    return "لا يوجد سرير في الغرفة";
  }
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
          reason: optionReason(name, value, state, rule),
        }
      : { value, disabled: false };
  });

  return { options, lockedTo: rule.lockedTo, lockReason: rule.lockReason };
}

export function getConflicts(state: SceneState): string[] {
  const conflicts: string[] = [];

  for (const field of Object.keys(values) as ConstrainedField[]) {
    const constraints = getFieldConstraints(field, state);
    const value = String(state[field]);
    const option = constraints?.options.find((item) => item.value === value);

    // القيم غير المعروفة من بيانات قديمة لا تكسر الفحص.
    if (constraints?.lockedTo && value !== constraints.lockedTo) {
      conflicts.push(constraints.lockReason ?? "قيمة مقفلة غير متوافقة");
    } else if (option?.disabled) {
      if (
        field === "lightingSource" &&
        value === "bedside-lamp" &&
        !state.roomHasBed
      ) {
        conflicts.push("اختيار مصباح سرير بدون سرير غير ممكن");
      } else {
        conflicts.push(option.reason ?? "اختيار غير متوافق مع المشهد");
      }
    }
  }

  // كشف تناقض السرير حتى عندما يأخذ قفل الاستلقاء أولوية المصدر.
  if (
    !state.roomHasBed &&
    state.lightingSource === "bedside-lamp" &&
    !conflicts.includes("اختيار مصباح سرير بدون سرير غير ممكن")
  ) {
    conflicts.push("اختيار مصباح سرير بدون سرير غير ممكن");
  }

  return conflicts;
}
