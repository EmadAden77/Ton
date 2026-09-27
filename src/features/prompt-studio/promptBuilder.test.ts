import { describe, expect, it } from "vitest";

import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "./promptBuilder";
import type { SceneState } from "./types";

const baseState: SceneState = {
  shotType: "front-selfie",
  lightingMode: "as-in-photo",
  cameraDistance: "arm-length",
  cameraAngle: "eye-level",
  phonePosition: "front-of-face",
  clothingTop: "t-shirt",
  clothingBottom: "shorts",
  clothingMaterial: "cotton",
  clothingColor: "neutral",
  referenceProvided: true,
  identityPriority: "balanced",
  identityNotes: "",
  hairStyle: "natural",
  hairLength: "medium",
  hairTexture: "wavy",
  poseType: "standing",
  legConfiguration: "neutral",
  torsoLean: "neutral",
  pelvisOrientation: "square",
  weightDistribution: "balanced",
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
  scenario: "none",
};

describe("person-first prompt structure", () => {
  it("starts the English prompt with the identity directive when a reference exists", () => {
    expect(buildPromptEnglish(baseState)).toMatch(
      /^Preserve the subject's identity/,
    );
  });

  it("omits the identity directive when no reference is provided", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      referenceProvided: false,
    });
    expect(prompt).toMatch(/^Front-camera selfie/);
    expect(prompt).not.toContain("reference image");
    expect(prompt).not.toContain("balanced priority");
  });

  it("ignores identity notes when no reference is provided", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      referenceProvided: false,
      identityNotes: "short hair, thin eyebrows",
    });
    expect(prompt).not.toContain("Additional identity notes");
  });

  it("uses the fixed bedroom geometry without baking in an active light state", () => {
    expect(buildPromptEnglish(baseState)).toContain(
      "in the fixed realistic modern bedroom",
    );
    expect(buildPromptEnglish(baseState)).toContain(
      "dark tufted-headboard bed on the left",
    );
  });

  it("places the room after the subject description", () => {
    const prompt = buildPromptEnglish(baseState);
    expect(prompt.indexOf("the subject is standing")).toBeGreaterThanOrEqual(0);
    expect(
      prompt.indexOf("in the fixed realistic modern bedroom"),
    ).toBeGreaterThan(prompt.indexOf("the subject is standing"));
  });

  it("starts the Arabic prompt with the identity directive when a reference exists", () => {
    expect(buildPromptArabic(baseState)).toMatch(/^حافظ على هوية الشخص/);
  });

  it("starts the Arabic prompt with the shot type when no reference exists", () => {
    expect(
      buildPromptArabic({ ...baseState, referenceProvided: false }),
    ).toMatch(/^سيلفي بالكاميرا الأمامية/);
  });

  it("places the Arabic room after the subject description", () => {
    const prompt = buildPromptArabic(baseState);
    expect(prompt.indexOf("الشخص واقف")).toBeGreaterThanOrEqual(0);
    expect(
      prompt.indexOf("في غرفة النوم الحديثة الواقعية الثابتة"),
    ).toBeGreaterThan(prompt.indexOf("الشخص واقف"));
  });

  it("adds trimmed identity notes directly after the identity directive", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        identityNotes: "  short hair, thin eyebrows  ",
      }),
    ).toContain("Additional identity notes: short hair, thin eyebrows");
  });

  it("supports strict identity priority in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, identityPriority: "strict" }),
    ).toContain("with strict priority");
  });
});

describe("lighting modes", () => {
  it("describes phone-screen lighting in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, lightingMode: "phone-screen" }),
    ).toContain("phone screen is the only active light source");
  });

  it("turns practical lights off in phone-screen mode", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      lightingMode: "phone-screen",
    });
    expect(prompt).toContain("ceiling spotlights and bedside lamp are off");
    expect(prompt).not.toContain(
      "Lighting: dim recessed ceiling spotlights plus a warm bedside lamp",
    );
  });

  it("describes open-curtain daylight in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, lightingMode: "daylight-open" }),
    ).toContain(
      "natural daylight entering through the open back-window curtains",
    );
  });

  it("describes as-in-photo lighting in English", () => {
    expect(buildPromptEnglish(baseState)).toContain("warm bedside lamp");
  });

  it("describes phone-screen lighting in Arabic", () => {
    expect(
      buildPromptArabic({ ...baseState, lightingMode: "phone-screen" }),
    ).toContain("شاشة الهاتف هي مصدر الضوء النشط الوحيد");
  });

  it("describes closed-curtain daylight in both languages", () => {
    const state = { ...baseState, lightingMode: "daylight-closed" as const };
    expect(buildPromptEnglish(state)).toContain("soft diffused daylight");
    expect(buildPromptArabic(state)).toContain("الستائر الداكنة المغلقة");
  });
});

describe("camera descriptions", () => {
  it("describes both selfie shot types", () => {
    expect(buildPromptEnglish(baseState)).toContain("Front-camera selfie");
    expect(
      buildPromptEnglish({ ...baseState, shotType: "mirror-selfie" }),
    ).toContain("Mirror selfie");
  });

  it("describes camera distance", () => {
    expect(buildPromptEnglish(baseState)).toContain("At arm's length");
    expect(
      buildPromptEnglish({ ...baseState, cameraDistance: "close" }),
    ).toContain("Close to the face");
  });

  it("describes camera angle", () => {
    expect(
      buildPromptEnglish({ ...baseState, cameraAngle: "slightly-above" }),
    ).toContain("camera at slightly above eye level");
  });
});

describe("selfie capture geometry", () => {
  it("treats a front selfie as the camera viewpoint, not a visible phone prop", () => {
    const prompt = buildPromptEnglish(baseState);
    expect(prompt).toContain(
      "front-camera viewpoint is directly in front of the face",
    );
    expect(prompt).toContain(
      "phone body itself remains outside the captured frame",
    );
    expect(prompt).not.toContain("The phone is held directly in front");
  });

  it("describes a side-held front camera without making the phone visible", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      phonePosition: "side-soft",
    });
    expect(prompt).toContain(
      "front-camera viewpoint is offset slightly to the side",
    );
    expect(prompt).toContain(
      "phone body itself remains outside the captured frame",
    );
    expect(prompt).toContain("extends forward and slightly sideways");
  });

  it("keeps the phone visible for a mirror selfie", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      shotType: "mirror-selfie",
      phonePosition: "chest-level",
    });
    expect(prompt).toContain("held at chest level");
    expect(prompt).toContain("naturally visible in the mirror reflection");
    expect(prompt).not.toContain("phone body itself remains outside");
  });

  it("uses physically reachable raised-arm mechanics while lying", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      poseType: "lying-bed",
      phonePosition: "above-chest",
    });
    expect(prompt).toContain("held above the torso");
    expect(prompt).toContain(
      "phone body itself remains outside the captured frame",
    );
    expect(prompt).toContain("physically connected and reachable");
  });

  it("describes the same lying selfie geometry in Arabic", () => {
    const prompt = buildPromptArabic({
      ...baseState,
      poseType: "lying-bed",
      phonePosition: "above-chest",
    });
    expect(prompt).toContain("مرفوع فوق الجذع");
    expect(prompt).toContain("جسم الهاتف نفسه خارج الإطار الملتقط");
    expect(prompt).toContain("ضمن مدى وصول واقعي");
  });
});

describe("clothing and hair descriptions", () => {
  it("describes clothing choices", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      clothingTop: "hoodie",
      clothingBottom: "jeans",
      clothingMaterial: "cotton",
      clothingColor: "dark",
    });
    expect(prompt).toContain(
      "Wearing: a cotton hoodie in dark tones, and jeans",
    );
  });

  it("handles lower garment outside the frame", () => {
    expect(
      buildPromptEnglish({ ...baseState, clothingBottom: "none-visible" }),
    ).toContain("lower garment outside the frame");
  });

  it("describes combed-back hair clearly in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        hairLength: "medium",
        hairTexture: "wavy",
        hairStyle: "combed-back",
      }),
    ).toContain("medium-length wavy hair, combed back neatly");
  });

  it("describes hair in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        hairLength: "long",
        hairTexture: "straight",
        hairStyle: "side-part",
      }),
    ).toContain("الشعر: طويل أملس مفرق جانبياً");
  });
});

describe("pose and face descriptions", () => {
  it("describes a bed pose", () => {
    expect(
      buildPromptEnglish({ ...baseState, poseType: "lying-bed" }),
    ).toContain("lying on the bed");
  });

  it("describes head and back posture", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      headDirection: "slightly-left",
      backPosture: "straight",
    });
    expect(prompt).toContain("head turned slightly left");
    expect(prompt).toContain("back straight");
  });

  it("describes facial expression and eye direction", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      faceExpression: "calm-focus",
      eyeDirection: "down-soft",
    });
    expect(prompt).toContain("Facial expression: calm focus");
    expect(prompt).toContain("eyes softly down");
  });

  it("keeps sleepy expression and mouth coherent", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      faceExpression: "sleepy",
      mouthState: "smile-open-light",
    });
    expect(prompt).toContain("mouth closed");
    expect(prompt).not.toContain("light open smile");
  });

  it("keeps light laugh and mouth coherent", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        faceExpression: "light-laugh",
        mouthState: "smile-closed",
      }),
    ).toContain("mouth slightly open");
  });

  it("keeps side glance and eye direction coherent", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        faceExpression: "side-glance",
        eyeDirection: "camera",
      }),
    ).toContain("eyes softly away");
  });
});

describe("free hand descriptions", () => {
  it("describes hand position and fingers", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      freeHandPosition: "holding-cup",
      handFingersState: "slightly-curled",
    });
    expect(prompt).toContain("free hand is holding a cup");
    expect(prompt).toContain("fingers slightly curled");
  });

  it("describes partial visibility in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        handVisibility: "partially-visible",
      }),
    ).toContain("ظاهرة جزئياً في الإطار");
  });

  it("omits finger wording when hand is off-frame", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      handVisibility: "off-frame",
    });
    expect(prompt).toContain("free hand is off-frame");
    expect(prompt).not.toContain("fingers relaxed");
  });
});

describe("scenario descriptions", () => {
  it("describes choosing clothes", () => {
    const scene = {
      ...baseState,
      scenario: "choosing-clothes" as const,
      freeHandPosition: "holding-cloth" as const,
    };
    expect(buildPromptEnglish(scene)).toContain(
      "chooses clothes from the bedroom closet",
    );
    expect(buildPromptArabic(scene)).toContain(
      "يختار قطعة ملابس من خزانة الغرفة",
    );
  });

  it("describes adjusting clothing modestly", () => {
    const scene = { ...baseState, scenario: "adjusting-clothing" as const };
    expect(buildPromptEnglish(scene)).toContain("Fully dressed");
    expect(buildPromptArabic(scene)).toContain("بملابس كاملة محتشمة");
  });
});

describe("negative prompt", () => {
  it("starts with identity preservation constraints when a reference exists", () => {
    expect(buildNegativePrompt(baseState)).toMatch(
      /^no identity change, no face alteration/,
    );
  });

  it("omits identity constraints without a reference", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      referenceProvided: false,
    });
    expect(prompt).not.toContain("no identity change");
    expect(prompt).not.toContain("no face alteration");
    expect(prompt).toMatch(/^no AI-looking artifacts/);
  });

  it("keeps baseline realism constraints", () => {
    const prompt = buildNegativePrompt(baseState);
    expect(prompt).toContain("no waxy skin");
    expect(prompt).toContain("no warped furniture");
    expect(prompt).toContain("no portrait-mode bokeh");
    expect(prompt).toContain("no ring light");
  });

  it("adds full hand constraints when visible", () => {
    const prompt = buildNegativePrompt(baseState);
    expect(prompt).toContain("no extra fingers");
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

  it("prevents third-person and visible-phone artifacts for front selfies", () => {
    const prompt = buildNegativePrompt(baseState);
    expect(prompt).toContain("no visible selfie phone body");
    expect(prompt).toContain("no third-person camera viewpoint");
    expect(prompt).toContain("no floating camera");
    expect(prompt).not.toContain("no incorrect reflections");
  });

  it("uses reflection-specific constraints for mirror selfies", () => {
    const prompt = buildNegativePrompt({
      ...baseState,
      shotType: "mirror-selfie",
    });
    expect(prompt).toContain("no incorrect reflections");
    expect(prompt).toContain("no duplicated phone");
    expect(prompt).not.toContain("no visible selfie phone body");
  });

  it("adds arm and shoulder constraints for lying on the bed", () => {
    const prompt = buildNegativePrompt({ ...baseState, poseType: "lying-bed" });
    expect(prompt).toContain("no elongated arms");
    expect(prompt).toContain("no distorted shoulders");
  });

  it("adds clothing safety constraints for adjusting clothing", () => {
    expect(
      buildNegativePrompt({
        ...baseState,
        scenario: "adjusting-clothing",
      }),
    ).toContain("no partially undressed subject");
  });
});

describe("capture realism tail", () => {
  it("adds front-camera smartphone behavior in English", () => {
    const prompt = buildPromptEnglish(baseState);
    expect(prompt).toContain("Authentic front-camera smartphone photography");
    expect(prompt).toContain("mild wide-angle proximity");
    expect(prompt).toContain("natural deep depth of field");
    expect(prompt).toContain("restrained HDR");
    expect(prompt).toContain("realistic shadow noise");
  });

  it("adds mirror-specific smartphone behavior in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, shotType: "mirror-selfie" }),
    ).toContain("Authentic handheld smartphone mirror photography");
  });

  it("adds the equivalent realism tail in Arabic", () => {
    expect(buildPromptArabic(baseState)).toContain(
      "تصوير واقعي بالكاميرا الأمامية لهاتف ذكي",
    );
  });
});

describe("English prompt language", () => {
  it("contains no Arabic characters", () => {
    expect(buildPromptEnglish(baseState)).not.toMatch(/[\u0600-\u06FF]/);
  });
});
