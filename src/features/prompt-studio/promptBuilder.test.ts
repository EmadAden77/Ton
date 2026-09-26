import { describe, expect, it } from "vitest";

import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "./promptBuilder";
import type { SceneState } from "./types";

const baseState: SceneState = {
  shotType: "front-selfie",
  lightingSource: "window-day",
  lightingIntensity: "bright",
  roomType: "simple",
  cameraDistance: "arm-length",
  cameraAngle: "eye-level",
  lightingDirection: "front",
  colorTemperature: "neutral",
  roomCleanliness: "natural",
  roomWindow: "medium",
  roomHasBed: true,
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
};

describe("buildPromptArabic", () => {
  it("describes a bright front selfie in a simple room", () => {
    const prompt = buildPromptArabic(baseState);

    expect(prompt).toContain("الكاميرا الأمامية");
    expect(prompt).toContain("بسيطة");
    expect(prompt).toContain("النهار من النافذة");
    expect(prompt).toContain("ساطعة");
  });

  it("describes a dim mirror selfie in a small room", () => {
    const state: SceneState = {
      ...baseState,
      shotType: "mirror-selfie",
      lightingSource: "bedside-lamp",
      lightingIntensity: "dim",
      roomType: "small",
    };

    const prompt = buildPromptArabic(state);

    expect(prompt).toContain("المرآة");
    expect(prompt).toContain("صغيرة");
    expect(prompt).toContain("مصباح بجانب السرير");
    expect(prompt).toContain("خافتة");
  });

  it("describes the selected camera distance", () => {
    expect(
      buildPromptArabic({ ...baseState, cameraDistance: "close" }),
    ).toContain("قريبة من الوجه");
    expect(buildPromptArabic(baseState)).toContain("عند طول الذراع");
    expect(
      buildPromptArabic({ ...baseState, cameraDistance: "extended" }),
    ).toContain("عند امتداد الذراع");
  });

  it("describes the selected camera angle", () => {
    expect(buildPromptArabic(baseState)).toContain("بمستوى العين");
    expect(
      buildPromptArabic({ ...baseState, cameraAngle: "slightly-above" }),
    ).toContain("أعلى من مستوى العين قليلاً");
    expect(
      buildPromptArabic({ ...baseState, cameraAngle: "slightly-below" }),
    ).toContain("أسفل من مستوى العين قليلاً");
  });

  it("describes front and side light directions", () => {
    expect(buildPromptArabic(baseState)).toContain("اتجاه الضوء من الأمام");
    expect(
      buildPromptArabic({ ...baseState, lightingDirection: "side" }),
    ).toContain("اتجاه الضوء من الجانب");
  });

  it("describes top and soft back light directions", () => {
    expect(
      buildPromptArabic({ ...baseState, lightingDirection: "top" }),
    ).toContain("اتجاه الضوء من الأعلى");
    expect(
      buildPromptArabic({ ...baseState, lightingDirection: "back-soft" }),
    ).toContain("اتجاه الضوء ناعم من الخلف");
  });

  it("describes warm and neutral color temperature", () => {
    expect(
      buildPromptArabic({ ...baseState, colorTemperature: "warm" }),
    ).toContain("حرارة اللون دافئة");
    expect(buildPromptArabic(baseState)).toContain("حرارة اللون محايدة");
  });

  it("describes cool color temperature after light direction", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      lightingDirection: "side",
      colorTemperature: "cool",
    });

    expect(prompt).toContain("حرارة اللون باردة");
    expect(prompt.indexOf("اتجاه الضوء")).toBeLessThan(
      prompt.indexOf("حرارة اللون"),
    );
  });
  it("describes the selected room cleanliness", () => {
    expect(buildPromptArabic(baseState)).toContain("بترتيب طبيعي");
    expect(
      buildPromptArabic({ ...baseState, roomCleanliness: "very-tidy" }),
    ).toContain("مرتبة جداً");
    expect(
      buildPromptArabic({ ...baseState, roomCleanliness: "light-mess" }),
    ).toContain("بفوضى خفيفة");
    expect(
      buildPromptArabic({ ...baseState, roomCleanliness: "moderate-mess" }),
    ).toContain("بفوضى متوسطة");
  });

  it("describes the selected window size", () => {
    expect(buildPromptArabic(baseState)).toContain("بنافذة متوسطة");
    expect(buildPromptArabic({ ...baseState, roomWindow: "small" })).toContain(
      "بنافذة صغيرة",
    );
    expect(buildPromptArabic({ ...baseState, roomWindow: "large" })).toContain(
      "بنافذة كبيرة",
    );
    expect(buildPromptArabic({ ...baseState, roomWindow: "none" })).toContain(
      "بلا نافذة",
    );
  });

  it("includes a tidy bed when the room has a bed", () => {
    expect(buildPromptArabic(baseState)).toContain("مع سرير مرتب في الخلفية");
  });

  it("omits the bed when the room has no bed", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      roomHasBed: false,
      lightingSource: "ceiling",
    });

    expect(prompt).not.toContain("سرير");
    expect(prompt).toContain("إنارة السقف");
  });

  it("does not mention a bed for a bedside lamp in a room without a bed", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      roomHasBed: false,
      lightingSource: "bedside-lamp",
    });

    expect(prompt).not.toContain("سرير");
  });

  it("uses an appropriate side lamp description without a bed", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      roomHasBed: false,
      lightingSource: "bedside-lamp",
    });

    expect(prompt).toContain("مصدر الإضاءة مصباح جانبي");
  });

  it("describes the selected clothing top", () => {
    expect(buildPromptArabic(baseState)).toContain("القطعة العلوية تي شيرت");
    expect(
      buildPromptArabic({ ...baseState, clothingTop: "hoodie" }),
    ).toContain("القطعة العلوية هودي");
  });

  it("describes the selected clothing bottom without inventing a garment", () => {
    expect(buildPromptArabic(baseState)).toContain("القطعة السفلية شورت");
    expect(
      buildPromptArabic({ ...baseState, clothingBottom: "none-visible" }),
    ).toContain("القطعة السفلية غير ظاهرة في الإطار");
  });

  it("describes the selected clothing material", () => {
    expect(buildPromptArabic(baseState)).toContain("مادة القماش قطن");
    expect(
      buildPromptArabic({ ...baseState, clothingMaterial: "linen" }),
    ).toContain("مادة القماش كتان");
  });

  it("describes the selected clothing color category", () => {
    expect(buildPromptArabic(baseState)).toContain("فئة اللون محايدة");
    expect(
      buildPromptArabic({ ...baseState, clothingColor: "earth-tone" }),
    ).toContain("فئة اللون ترابية");
  });
});

describe("buildPromptEnglish", () => {
  it("describes the selected selfie shot", () => {
    expect(buildPromptEnglish(baseState)).toContain("front-camera selfie");
    expect(
      buildPromptEnglish({ ...baseState, shotType: "mirror-selfie" }),
    ).toContain("mirror selfie");
  });

  it("describes lighting intensity and source in English", () => {
    expect(buildPromptEnglish(baseState)).toContain(
      "bright daylight from the window",
    );
    expect(
      buildPromptEnglish({
        ...baseState,
        lightingIntensity: "soft",
        lightingSource: "ceiling",
      }),
    ).toContain("soft ceiling light");
  });

  it("contains no Arabic characters", () => {
    expect(buildPromptEnglish(baseState)).not.toMatch(/[\u0600-\u06FF]/);
  });

  it("keeps room and clothing details coherent with absent objects", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      roomWindow: "none",
      roomHasBed: false,
      lightingSource: "bedside-lamp",
      clothingBottom: "none-visible",
    });

    expect(prompt).toContain("no window");
    expect(prompt).toContain("side lamp light");
    expect(prompt).toContain("lower garment outside the frame");
    expect(prompt).not.toContain("bedside lamp light");
    expect(prompt).not.toContain("neatly made bed");
  });
});

describe("buildNegativePrompt", () => {
  it("includes visible hand and baseline realism constraints", () => {
    const prompt = buildNegativePrompt(baseState);

    expect(prompt).toContain("no extra fingers");
    expect(prompt).toContain("no malformed hands");
    expect(prompt).toContain("no waxy skin");
    expect(prompt).toContain("no watermark");
  });

  it("adds reflection constraints for a mirror selfie", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      shotType: "mirror-selfie",
    });

    expect(prompt).toContain("no incorrect reflections");
    expect(prompt).toContain("no mirrored text");
  });

  it("omits mirror constraints for a front selfie", () => {
    const prompt = buildNegativePrompt(baseState);

    expect(prompt).not.toContain("no incorrect reflections");
  });

  it("keeps conditional constraints within ten comma-separated groups", () => {
    const bright = buildNegativePrompt({
      ...baseState,
      shotType: "mirror-selfie",
      lightingIntensity: "bright",
    });
    const dim = buildNegativePrompt({
      ...baseState,
      roomHasBed: false,
      lightingIntensity: "dim",
    });

    expect(bright).toContain("no blown highlights");
    expect(bright).toContain("no warped furniture");
    expect(dim).toContain("no excessive noise reduction");
    expect(dim).not.toContain("no warped furniture");
    expect(bright.split(", ")).toHaveLength(9);
  });
});

describe("windowless room lighting", () => {
  it("does not invent a window in English for daylight or sunset", () => {
    const daylight = buildPromptEnglish({ ...baseState, roomWindow: "none" });
    const sunset = buildPromptEnglish({
      ...baseState,
      roomWindow: "none",
      lightingSource: "window-sunset",
    });

    expect(daylight).toContain("no window");
    expect(daylight).toContain("bright daylight");
    expect(daylight).not.toContain("from the window");
    expect(sunset).toContain("sunset light");
    expect(sunset).not.toContain("from the window");
  });

  it("does not invent a window in Arabic for daylight or sunset", () => {
    const daylight = buildPromptArabic({ ...baseState, roomWindow: "none" });
    const sunset = buildPromptArabic({
      ...baseState,
      roomWindow: "none",
      lightingSource: "window-sunset",
    });

    expect(daylight).toContain("بلا نافذة");
    expect(daylight).toContain("ضوء النهار");
    expect(daylight).not.toContain("من النافذة");
    expect(sunset).toContain("ضوء الغروب");
    expect(sunset).not.toContain("من النافذة");
  });
});

describe("reference image preferences", () => {
  it("uses strict identity priority in English when a reference is provided", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        referenceProvided: true,
        identityPriority: "strict",
      }),
    ).toContain("reference image with strict priority");
  });

  it("uses balanced identity priority in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        referenceProvided: true,
        identityPriority: "balanced",
      }),
    ).toContain("balanced with scene flexibility");
  });

  it("uses flexible identity priority in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        referenceProvided: true,
        identityPriority: "flexible",
      }),
    ).toContain("allowing scene adjustments");
  });

  it("omits reference image instructions when no reference is provided", () => {
    expect(buildPromptEnglish(baseState)).not.toContain("reference image");
    expect(buildPromptArabic(baseState)).not.toContain("الصورة المرجعية");
  });

  it("includes trimmed identity notes when provided", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      identityNotes: "  short hair, thin eyebrows  ",
    });
    expect(prompt).toContain(
      "Additional identity notes: short hair, thin eyebrows",
    );
    expect(
      buildPromptEnglish({
        ...baseState,
        identityNotes: "  ",
      }),
    ).not.toContain("Additional identity notes");
  });

  it("uses Arabic identity priority and notes when a reference is provided", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      referenceProvided: true,
      identityPriority: "strict",
      identityNotes: "شعر قصير",
    });
    expect(prompt).toContain("الصورة المرجعية بأولوية قصوى");
    expect(prompt).toContain("ملاحظات إضافية عن الهوية: شعر قصير");
  });

  it("keeps identity preferences out of the negative prompt", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      referenceProvided: true,
      identityPriority: "strict",
      identityNotes: "short hair",
    });
    expect(prompt).not.toContain("reference image");
    expect(prompt).not.toContain("short hair");
  });
});

describe("hair descriptions", () => {
  it("includes the selected hair style in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        hairStyle: "slicked-back",
      }),
    ).toContain("slicked-back hair");
  });

  it("describes the hair length and texture in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        hairLength: "short",
        hairTexture: "curly",
      }),
    ).toContain("short curly natural hair");
  });

  it("includes the selected hair style in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        hairStyle: "side-part",
      }),
    ).toContain("مفرق جانبياً");
  });

  it("describes the hair length and texture in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        hairLength: "long",
        hairTexture: "straight",
      }),
    ).toContain("شعر طويل أملس طبيعي");
  });

  it("keeps the hair description after clothing and before lighting", () => {
    const prompt = buildPromptEnglish(baseState);
    expect(prompt.indexOf("hair;")).toBeGreaterThan(prompt.indexOf("tones"));
    expect(prompt.indexOf("hair;")).toBeLessThan(prompt.indexOf("lighting is"));
  });
});

describe("pose descriptions", () => {
  it("includes the selected pose type in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        poseType: "sitting-chair",
      }),
    ).toContain("sitting on a chair");
  });

  it("includes head direction in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        headDirection: "slightly-left",
      }),
    ).toContain("head turned slightly left");
  });

  it("includes free hand placement in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        freeHandPosition: "on-hair",
      }),
    ).toContain("free hand is on the hair");
  });

  it("includes the selected pose type in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        poseType: "lying-bed",
      }),
    ).toContain("الشخص مستلقٍ على السرير");
  });

  it("keeps sitting on the bed and a hand on the bed coherent", () => {
    const scene = {
      ...baseState,
      poseType: "sitting-bed" as const,
      freeHandPosition: "on-bed" as const,
    };
    expect(buildPromptEnglish(scene)).toContain("sitting on the bed");
    expect(buildPromptEnglish(scene)).toContain("free hand is on the bed");
    expect(buildPromptArabic(scene)).toContain("جالس على السرير");
    expect(buildPromptArabic(scene)).toContain("اليد الحرة على السرير");
  });

  it("avoids a bed pose when the room has no bed", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      roomHasBed: false,
      poseType: "lying-bed",
    });
    expect(prompt).not.toContain("lying on the bed");
    expect(prompt).toContain("in a relaxed pose in the room");
  });

  it("avoids window position when the room has no window", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      roomWindow: "none",
      poseType: "standing-window",
    });
    expect(prompt).toContain("the subject is standing");
    expect(prompt).not.toContain("standing near the window");
  });
});

describe("facial expression descriptions", () => {
  it("describes the selected expression in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        faceExpression: "soft-smile",
      }),
    ).toContain("facial expression is a soft smile");
  });

  it("describes eye direction in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        eyeDirection: "down-soft",
      }),
    ).toContain("eyes directed softly down");
  });

  it("describes mouth state in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        mouthState: "slightly-open",
      }),
    ).toContain("mouth slightly open");
  });

  it("describes the selected expression in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        faceExpression: "calm-focus",
      }),
    ).toContain("تعبير الوجه تركيز هادئ");
  });

  it("avoids an open smile when the expression is sleepy", () => {
    const state = {
      ...baseState,
      faceExpression: "sleepy" as const,
      mouthState: "smile-open-light" as const,
    };
    expect(buildPromptEnglish(state)).toContain(
      "facial expression is slightly sleepy",
    );
    expect(buildPromptEnglish(state)).toContain("mouth closed");
    expect(buildPromptEnglish(state)).not.toContain("open smile");
    expect(buildPromptArabic(state)).toContain("الفم مغلق");
  });

  it("avoids a closed smile during a light laugh", () => {
    const state = {
      ...baseState,
      faceExpression: "light-laugh" as const,
      mouthState: "smile-closed" as const,
    };
    expect(buildPromptEnglish(state)).toContain("mouth slightly open");
    expect(buildPromptEnglish(state)).not.toContain("mouth in a closed smile");
    expect(buildPromptArabic(state)).toContain("الفم مفتوح قليلاً");
  });

  it("keeps a closed smile and side glance internally consistent", () => {
    const smile = buildPromptEnglish({
      ...baseState,
      faceExpression: "closed-smile",
      mouthState: "slightly-open",
    });
    const glance = buildPromptEnglish({
      ...baseState,
      faceExpression: "side-glance",
      eyeDirection: "camera",
    });
    expect(smile).toContain("mouth in a closed smile");
    expect(smile).not.toContain("mouth slightly open");
    expect(glance).toContain("eyes directed softly away");
  });
});

describe("free hand visibility and position", () => {
  it("describes the selected free hand position in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        freeHandPosition: "holding-cup",
      }),
    ).toContain("the free hand is holding a cup");
  });

  it("describes the selected finger state in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        handFingersState: "slightly-curled",
      }),
    ).toContain("fingers slightly curled");
  });

  it("describes hand visibility in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        handVisibility: "partially-visible",
      }),
    ).toContain("اليد ظاهرة جزئياً في الإطار");
  });

  it("includes three hand constraints when fully visible", () => {
    const prompt = buildNegativePrompt(baseState);
    expect(prompt).toContain("no extra fingers");
    expect(prompt).toContain("no malformed hands");
    expect(prompt).toContain("no fused fingers");
  });

  it("limits hand constraints when partially visible", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      handVisibility: "partially-visible",
    });
    expect(prompt).toContain("no malformed visible fingers");
    expect(prompt).not.toContain("no extra fingers");
  });

  it("omits hand constraints when off-frame", () => {
    const state = {
      ...baseState,
      handVisibility: "off-frame" as const,
    };
    const prompt = buildNegativePrompt(state);
    expect(prompt).not.toContain("no extra fingers");
    expect(prompt).not.toContain("no malformed hands");
    expect(prompt).not.toContain("no fused fingers");
    expect(prompt).not.toContain("no malformed visible fingers");
    expect(buildPromptEnglish(state)).toContain("free hand is off-frame");
    expect(buildPromptEnglish(state)).not.toContain("fingers relaxed");
  });
});

describe("free hand control precedence", () => {
  it("respects an explicit at-side selection despite an older pose hand value", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      handPlacement: "touching-hair",
      freeHandPosition: "at-side",
    });
    expect(prompt).toContain("the free hand is at the side");
    expect(prompt).not.toContain("free hand is touching the hair");
  });
});

describe("phone in free hand", () => {
  it("mentions holding a phone in English", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      freeHandPosition: "holding-phone",
    });
    expect(prompt).toContain("holding a phone");
  });

  it("mentions holding the phone in Arabic", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      freeHandPosition: "holding-phone",
    });
    expect(prompt).toContain("تحمل الهاتف");
  });
});

describe("modest adjusting-clothing scene", () => {
  it("includes the requested clothing safety constraints only for this scenario", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      scenario: "adjusting-clothing",
    });
    expect(prompt).toContain("no nudity");
    expect(prompt).toContain("no partially undressed subject");
    expect(prompt).toContain("no suggestive pose");
    expect(prompt).toContain("no exposed skin beyond face and hands");
  });

  it("does not add clothing safety constraints to working-laptop", () => {
    expect(
      buildNegativePrompt({
        ...baseState,
        scenario: "working-laptop",
      }),
    ).not.toContain("no nudity");
  });

  it("describes a fully dressed subject in both positive prompts", () => {
    const scene = {
      ...baseState,
      scenario: "adjusting-clothing" as const,
    };
    expect(buildPromptEnglish(scene)).toContain("Fully dressed");
    expect(buildPromptArabic(scene)).toContain("بملابس كاملة محتشمة");
    expect(
      buildPromptEnglish({ ...baseState, scenario: "none" }),
    ).not.toContain("Fully dressed");
  });
});
