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

describe("fixed room and lighting modes", () => {
  it("uses the fixed room description in English", () => {
    expect(buildPromptEnglish(baseState)).toContain(
      "dark tufted headboard bed",
    );
  });

  it("uses the fixed room description in Arabic", () => {
    expect(buildPromptArabic(baseState)).toContain(
      "سرير بظهر منجّد غامق على الجانب الأيسر",
    );
  });

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
    expect(buildPromptEnglish(baseState)).toContain("front-camera selfie");
    expect(
      buildPromptEnglish({ ...baseState, shotType: "mirror-selfie" }),
    ).toContain("mirror selfie");
  });

  it("describes camera distance", () => {
    expect(buildPromptEnglish(baseState)).toContain("at arm's length");
    expect(
      buildPromptEnglish({ ...baseState, cameraDistance: "close" }),
    ).toContain("close to the face");
  });

  it("describes camera angle", () => {
    expect(
      buildPromptEnglish({ ...baseState, cameraAngle: "slightly-above" }),
    ).toContain("slightly above eye level");
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
    expect(prompt).toContain("cotton hoodie and jeans");
    expect(prompt).toContain("dark tones");
  });

  it("handles lower garment outside the frame", () => {
    expect(
      buildPromptEnglish({ ...baseState, clothingBottom: "none-visible" }),
    ).toContain("lower garment outside the frame");
  });

  it("describes hair in English", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        hairLength: "short",
        hairTexture: "curly",
        hairStyle: "slicked-back",
      }),
    ).toContain("short curly slicked-back hair");
  });

  it("describes hair in Arabic", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        hairLength: "long",
        hairTexture: "straight",
        hairStyle: "side-part",
      }),
    ).toContain("شعر طويل أملس مفرق جانبياً");
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
    expect(prompt).toContain("back posture straight");
  });

  it("describes facial expression and eye direction", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      faceExpression: "calm-focus",
      eyeDirection: "down-soft",
    });
    expect(prompt).toContain("facial expression is calm focus");
    expect(prompt).toContain("eyes directed softly down");
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
    ).toContain("eyes directed softly away");
  });
});

describe("free hand descriptions", () => {
  it("describes hand position and fingers", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      freeHandPosition: "holding-cup",
      handFingersState: "slightly-curled",
    });
    expect(prompt).toContain("holding a cup");
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

  it("avoids an in-pocket hand while lying on the bed", () => {
    const prompt = buildPromptEnglish({
      ...baseState,
      poseType: "lying-bed",
      freeHandPosition: "in-pocket",
    });
    expect(prompt).toContain("free hand is at the side");
  });
});

describe("reference image preferences", () => {
  it("adds strict identity priority when a reference is present", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        referenceProvided: true,
        identityPriority: "strict",
      }),
    ).toContain("reference image with strict priority");
  });

  it("omits identity instruction without a reference", () => {
    expect(buildPromptEnglish(baseState)).not.toContain("reference image");
  });

  it("adds trimmed identity notes", () => {
    expect(
      buildPromptEnglish({
        ...baseState,
        identityNotes: "  short hair, thin eyebrows  ",
      }),
    ).toContain("Additional identity notes: short hair, thin eyebrows");
  });

  it("supports Arabic identity instructions", () => {
    expect(
      buildPromptArabic({
        ...baseState,
        referenceProvided: true,
        identityPriority: "strict",
        identityNotes: "شعر قصير",
      }),
    ).toContain("ملاحظات إضافية عن الهوية: شعر قصير");
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

  it("adds clothing safety constraints for adjusting clothing", () => {
    expect(
      buildNegativePrompt({
        ...baseState,
        scenario: "adjusting-clothing",
      }),
    ).toContain("no partially undressed subject");
  });
});

describe("English prompt language", () => {
  it("contains no Arabic characters", () => {
    expect(buildPromptEnglish(baseState)).not.toMatch(/[\u0600-\u06FF]/);
  });
});
