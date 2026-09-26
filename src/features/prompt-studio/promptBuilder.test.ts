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
  scenario: "none",
};

describe("person-first prompt structure", () => {
  it("starts the English prompt with the identity directive", () => {
    expect(buildPromptEnglish(baseState)).toMatch(
      /^Preserve the subject's identity/,
    );
  });

  it("always includes identity priority even without a reference upload", () => {
    expect(buildPromptEnglish(baseState)).toContain("with balanced priority");
  });

  it("uses the short realistic bedroom description in English", () => {
    expect(buildPromptEnglish(baseState)).toContain(
      "in a realistic modern bedroom with dim ceiling spotlights and a warm bedside lamp",
    );
  });

  it("places the room after the subject description", () => {
    const prompt = buildPromptEnglish(baseState);
    expect(prompt.indexOf("the subject is standing")).toBeGreaterThanOrEqual(0);
    expect(prompt.indexOf("in a realistic modern bedroom")).toBeGreaterThan(
      prompt.indexOf("the subject is standing"),
    );
  });

  it("starts the Arabic prompt with the identity directive", () => {
    expect(buildPromptArabic(baseState)).toMatch(/^حافظ على هوية الشخص/);
  });

  it("places the Arabic room after the subject description", () => {
    const prompt = buildPromptArabic(baseState);
    expect(prompt.indexOf("الشخص واقف")).toBeGreaterThanOrEqual(0);
    expect(prompt.indexOf("في غرفة نوم حديثة واقعية")).toBeGreaterThan(
      prompt.indexOf("الشخص واقف"),
    );
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
    ).toContain("phone screen");
  });

  it("describes open-curtain daylight in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, lightingMode: "daylight-open" }),
    ).toContain("bright natural daylight");
  });

  it("describes as-in-photo lighting in English", () => {
    expect(buildPromptEnglish(baseState)).toContain("warm bedside lamp");
  });

  it("describes phone-screen lighting in Arabic", () => {
    expect(
      buildPromptArabic({ ...baseState, lightingMode: "phone-screen" }),
    ).toContain("ضوء شاشة الهاتف");
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

describe("phone and arm geometry", () => {
  it("describes the front-selfie phone arm as extended forward", () => {
    expect(buildPromptEnglish(baseState)).toContain("extended forward");
  });

  it("describes the mirror-selfie phone arm at chest height", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        shotType: "mirror-selfie",
        phonePosition: "chest-level",
      }),
    ).toContain("chest height");
  });

  it("describes above-chest phone position in English", () => {
    expect(
      buildPromptEnglish({ ...baseState, phonePosition: "above-chest" }),
    ).toContain("above the chest");
  });

  it("describes above-chest phone position in Arabic", () => {
    expect(
      buildPromptArabic({ ...baseState, phonePosition: "above-chest" }),
    ).toContain("فوق الصدر");
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
  it("starts with identity preservation constraints", () => {
    expect(buildNegativePrompt(baseState)).toMatch(
      /^no identity change, no face alteration/,
    );
  });

  it("contains no identity change", () => {
    expect(buildNegativePrompt(baseState)).toContain("no identity change");
  });

  it("keeps baseline realism constraints", () => {
    const prompt = buildNegativePrompt(baseState);
    expect(prompt).toContain("no waxy skin");
    expect(prompt).toContain("no warped furniture");
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

  it("adds mirror constraints only for mirror selfie", () => {
    expect(
      buildNegativePrompt({ ...baseState, shotType: "mirror-selfie" }),
    ).toContain("no incorrect reflections");
    expect(buildNegativePrompt(baseState)).not.toContain(
      "no incorrect reflections",
    );
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

describe("quality tail", () => {
  it("adds the smartphone realism tail in English", () => {
    expect(buildPromptEnglish(baseState)).toContain(
      "Realistic smartphone photography, natural skin texture, balanced dynamic range.",
    );
  });

  it("adds the equivalent realism tail in Arabic", () => {
    expect(buildPromptArabic(baseState)).toContain(
      "تصوير هاتف ذكي واقعي، ملمس بشرة طبيعي، ونطاق ديناميكي متوازن",
    );
  });
});

describe("English prompt language", () => {
  it("contains no Arabic characters", () => {
    expect(buildPromptEnglish(baseState)).not.toMatch(/[\u0600-\u06FF]/);
  });
});
