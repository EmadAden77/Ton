import { describe, expect, it } from "vitest";

import { SCENARIOS } from "./scenarios";
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

  it("switches the shot type for mirror selfie", () => {
    const preset = SCENARIOS.find((item) => item.id === "mirror-selfie");
    expect(preset?.apply(baseState).shotType).toBe("mirror-selfie");
  });

  it("uses the keyboard for laptop work", () => {
    const preset = SCENARIOS.find((item) => item.id === "working-laptop");
    expect(preset?.apply(baseState).freeHandPosition).toBe("on-keyboard");
  });

  it("uses the phone-screen mode for lying with phone", () => {
    const preset = SCENARIOS.find((item) => item.id === "lying-with-phone");
    const scene = preset?.apply(baseState);
    expect(scene?.freeHandPosition).toBe("holding-phone");
    expect(scene?.lightingMode).toBe("phone-screen");
  });

  it("uses daylight-open for the window scenario", () => {
    const preset = SCENARIOS.find((item) => item.id === "standing-window");
    expect(preset?.apply(baseState).lightingMode).toBe("daylight-open");
  });

  it("keeps clothing scenario behavior", () => {
    const adjust = SCENARIOS.find((item) => item.id === "adjusting-clothing");
    const choose = SCENARIOS.find((item) => item.id === "choosing-clothes");
    expect(adjust?.apply(baseState).clothingTop).toBe("sweater");
    expect(adjust?.apply(baseState).clothingBottom).toBe("jeans");
    expect(choose?.apply(baseState).freeHandPosition).toBe("holding-cloth");
  });
});
