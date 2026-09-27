import { describe, expect, it } from "vitest";

import { getFieldConstraints } from "./constraints";
import {
  clothingBottomOptions,
  clothingMaterialOptions,
  clothingTopOptions,
  lightingModeOptions,
  poseTypeOptions,
} from "./options";
import { buildPromptArabic, buildPromptEnglish } from "./positivePrompt";
import { createDefaultSceneState } from "./state";
import type { SceneState } from "./types";

function optionDisabled(
  field: keyof SceneState,
  state: SceneState,
  value: string,
): boolean | undefined {
  return getFieldConstraints(field, state)?.options.find(
    (item) => item.value === value,
  )?.disabled;
}

describe("expanded pose catalog", () => {
  it("exposes ten physically distinct pose choices", () => {
    expect(poseTypeOptions.map((item) => item.value)).toEqual([
      "standing",
      "standing-window",
      "standing-wardrobe",
      "leaning-dresser",
      "sitting-chair",
      "sitting-bed",
      "sitting-bed-edge",
      "sitting-bed-cross-legged",
      "reclining-headboard",
      "lying-bed",
    ]);
  });

  it("describes mattress support for the new cross-legged pose", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged",
    });

    expect(prompt).toContain("localized mattress compression");
    expect(prompt).toContain("asymmetric hip rotation");
  });

  it("keeps standing-by-wardrobe hand placement away from bed-only positions", () => {
    const state = {
      ...createDefaultSceneState(),
      poseType: "standing-wardrobe" as const,
    };

    expect(optionDisabled("freeHandPosition", state, "on-bed")).toBe(true);
    expect(optionDisabled("freeHandPosition", state, "on-keyboard")).toBe(true);
    expect(optionDisabled("freeHandPosition", state, "at-side")).toBe(false);
  });

  it("limits reclining-headboard hand choices to supported positions", () => {
    const state = {
      ...createDefaultSceneState(),
      poseType: "reclining-headboard" as const,
    };

    expect(optionDisabled("freeHandPosition", state, "on-bed")).toBe(false);
    expect(optionDisabled("freeHandPosition", state, "holding-phone")).toBe(
      false,
    );
    expect(optionDisabled("freeHandPosition", state, "in-pocket")).toBe(true);
  });
});

describe("expanded clothing catalog", () => {
  it("exposes ten tops, nine bottoms, and eight materials", () => {
    expect(clothingTopOptions).toHaveLength(10);
    expect(clothingBottomOptions).toHaveLength(9);
    expect(clothingMaterialOptions).toHaveLength(8);
  });

  it("adds material-specific drape physics in English", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      clothingTop: "overshirt",
      clothingBottom: "chinos",
      clothingMaterial: "poplin",
    });

    expect(prompt).toContain("light overshirt");
    expect(prompt).toContain("chinos");
    expect(prompt).toContain("crisp small creases");
  });

  it("adds material-specific drape physics in Arabic", () => {
    const prompt = buildPromptArabic({
      ...createDefaultSceneState(),
      clothingTop: "long-sleeve-tshirt",
      clothingBottom: "lounge-pants",
      clothingMaterial: "jersey",
    });

    expect(prompt).toContain("تي شيرت طويل الأكمام");
    expect(prompt).toContain("بنطال منزلي");
    expect(prompt).toContain("تقودها الجاذبية");
  });
});

describe("expanded lighting catalog", () => {
  it("exposes eight causally distinct lighting modes", () => {
    expect(lightingModeOptions).toHaveLength(8);
  });

  it("describes bedside-lamp-only without invented fill light", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      lightingMode: "bedside-lamp-only",
    });

    expect(prompt).toContain("bedside lamp is the only practical light");
    expect(prompt).toContain("opposite side of the face");
  });

  it("describes ceiling-only as top-down practical lighting", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      lightingMode: "ceiling-only",
    });

    expect(prompt).toContain("top-down pools");
    expect(prompt).toContain("no artificial frontal fill");
  });

  it("keeps blue-hour practical lights off", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      lightingMode: "blue-hour-closed",
    });

    expect(prompt).toContain("indoor practical lights remain off");
    expect(prompt).toContain("natural shadow noise");
  });

  it("describes overcast daylight as broad and low-directionality", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      lightingMode: "overcast-open",
    });

    expect(prompt).toContain("broad overcast daylight");
    expect(prompt).toContain("soft low-directionality illumination");
  });
});
