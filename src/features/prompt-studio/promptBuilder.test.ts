import { describe, expect, it } from "vitest";

import { buildPromptArabic } from "./promptBuilder";
import type { SceneState } from "./types";

describe("buildPromptArabic", () => {
  it("describes a bright front selfie in a simple room", () => {
    const state: SceneState = {
      shotType: "front-selfie",
      lightingSource: "window-day",
      lightingIntensity: "bright",
      roomType: "simple",
    };

    const prompt = buildPromptArabic(state);

    expect(prompt).toContain("الكاميرا الأمامية");
    expect(prompt).toContain("بسيطة");
    expect(prompt).toContain("النهار من النافذة");
    expect(prompt).toContain("ساطعة");
  });

  it("describes a dim mirror selfie in a small room", () => {
    const state: SceneState = {
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
});
