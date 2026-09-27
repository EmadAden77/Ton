import { describe, expect, it } from "vitest";

import { getConflicts } from "./constraints";
import { SCENARIOS } from "./scenarios";
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

const expectedLightingModes = {
  "working-laptop": "as-in-photo",
  "bed-laptop": "as-in-photo",
  "mirror-selfie": "as-in-photo",
  "getting-ready": "daylight-open",
  "lying-with-phone": "phone-screen",
  "standing-window": "daylight-open",
  "choosing-clothes": "as-in-photo",
  "adjusting-clothing": "daylight-open",
} as const;

const removedFields = [
  "roomType",
  "roomCleanliness",
  "roomWindow",
  "roomHasBed",
  "lightingSource",
  "lightingIntensity",
  "lightingDirection",
  "colorTemperature",
] as const;

describe("ready-made scenarios", () => {
  it("contains eight presets", () => {
    expect(SCENARIOS).toHaveLength(8);
  });

  it("returns fresh complete states without mutating the current state", () => {
    for (const preset of SCENARIOS) {
      const result = preset.apply(baseState);
      expect(result).not.toBe(baseState);
      expect(Object.keys(result).sort()).toEqual(Object.keys(baseState).sort());
      expect(result.scenario).toBe(preset.id);
      expect(baseState.scenario).toBe("none");
    }
  });

  it("assigns the requested lighting mode to every preset", () => {
    for (const preset of SCENARIOS) {
      expect(preset.apply(baseState).lightingMode).toBe(
        expectedLightingModes[preset.id],
      );
    }
  });

  it("does not reintroduce removed room or lighting fields", () => {
    for (const preset of SCENARIOS) {
      const result = preset.apply(baseState) as unknown as Record<
        string,
        unknown
      >;
      for (const field of removedFields) {
        expect(Object.prototype.hasOwnProperty.call(result, field)).toBe(false);
      }
    }
  });

  it("produces constraint-safe states from the default scene", () => {
    for (const preset of SCENARIOS) {
      expect(getConflicts(preset.apply(baseState))).toEqual([]);
    }
  });

  it("anchors mirror selfie at the real wardrobe mirror", () => {
    const preset = SCENARIOS.find((item) => item.id === "mirror-selfie");
    const scene = preset?.apply({
      ...baseState,
      poseType: "lying-bed",
      shotType: "front-selfie",
    });
    expect(scene?.shotType).toBe("mirror-selfie");
    expect(scene?.poseType).toBe("standing-wardrobe");
    expect(scene?.phonePosition).toBe("chest-level");
    expect(scene?.eyeDirection).toBe("mirror");
  });

  it("resets non-mirror presets to a front selfie", () => {
    const preset = SCENARIOS.find((item) => item.id === "working-laptop");
    const scene = preset?.apply({
      ...baseState,
      shotType: "mirror-selfie",
      phonePosition: "chest-level",
      eyeDirection: "mirror",
    });
    expect(scene?.shotType).toBe("front-selfie");
    expect(scene?.phonePosition).toBe("side-soft");
  });

  it("uses the keyboard for laptop work", () => {
    const preset = SCENARIOS.find((item) => item.id === "working-laptop");
    expect(preset?.apply(baseState).freeHandPosition).toBe("on-keyboard");
  });

  it("uses the selfie phone itself while lying on the bed", () => {
    const preset = SCENARIOS.find((item) => item.id === "lying-with-phone");
    const scene = preset?.apply(baseState);
    expect(scene?.freeHandPosition).toBe("on-chest");
    expect(scene?.phonePosition).toBe("above-chest");
    expect(scene?.lightingMode).toBe("phone-screen");
  });

  it("uses daylight-open for the window scenario", () => {
    const preset = SCENARIOS.find((item) => item.id === "standing-window");
    expect(preset?.apply(baseState).lightingMode).toBe("daylight-open");
  });

  it("anchors wardrobe-related scenarios at the wardrobe", () => {
    for (const id of [
      "getting-ready",
      "choosing-clothes",
      "adjusting-clothing",
    ] as const) {
      const preset = SCENARIOS.find((item) => item.id === id);
      expect(preset?.apply(baseState).poseType).toBe("standing-wardrobe");
    }
  });

  it("keeps clothing scenario behavior", () => {
    const adjust = SCENARIOS.find((item) => item.id === "adjusting-clothing");
    const choose = SCENARIOS.find((item) => item.id === "choosing-clothes");
    expect(adjust?.apply(baseState).clothingTop).toBe("sweater");
    expect(adjust?.apply(baseState).clothingBottom).toBe("jeans");
    expect(adjust?.apply(baseState).clothingMaterial).toBe("wool");
    expect(choose?.apply(baseState).freeHandPosition).toBe("holding-cloth");
  });
});
