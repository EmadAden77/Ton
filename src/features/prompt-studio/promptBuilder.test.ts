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
  lightingDirection: "front",
  colorTemperature: "neutral",
  roomCleanliness: "natural",
  roomWindow: "medium",
  roomHasBed: true,
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
    expect(
      buildPromptArabic({ ...baseState, roomWindow: "small" }),
    ).toContain("بنافذة صغيرة");
    expect(
      buildPromptArabic({ ...baseState, roomWindow: "large" }),
    ).toContain("بنافذة كبيرة");
    expect(
      buildPromptArabic({ ...baseState, roomWindow: "none" }),
    ).toContain("بلا نافذة");
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
});
