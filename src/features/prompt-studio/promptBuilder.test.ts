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
