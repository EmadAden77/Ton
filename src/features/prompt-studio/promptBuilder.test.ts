import { describe, expect, it } from "vitest";

import { buildPromptArabic } from "./promptBuilder";
import type { SceneState } from "./types";

const baseState: SceneState = {
  shotType: "front-selfie",
  lightingSource: "window-day",
  lightingIntensity: "bright",
  roomType: "simple",
  cameraDistance: "arm-length",
  cameraAngle: "eye-level",
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
});
