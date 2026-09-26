import { describe, expect, it } from "vitest";

import { SCENARIOS } from "./scenarios";
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

describe("ready-made scenarios", () => {
  it("contains six presets", () => {
    expect(SCENARIOS).toHaveLength(6);
  });

  it("returns fresh complete scene states without mutating the current state", () => {
    for (const preset of SCENARIOS) {
      const result = preset.apply(baseState);
      expect(result).not.toBe(baseState);
      expect(Object.keys(result).sort()).toEqual(Object.keys(baseState).sort());
      expect(result.lightingSource).toBeTruthy();
      expect(result.poseType).toBeTruthy();
      expect(result.scenario).toBe(preset.id);
      expect(baseState.scenario).toBe("none");
    }
  });

  it("switches the shot type for the mirror selfie", () => {
    const preset = SCENARIOS.find((item) => item.id === "mirror-selfie");
    expect(preset?.apply(baseState).shotType).toBe("mirror-selfie");
  });

  it("provides a bed for the bed laptop scenario", () => {
    const preset = SCENARIOS.find((item) => item.id === "bed-laptop");
    expect(preset?.apply({ ...baseState, roomHasBed: false }).roomHasBed).toBe(
      true,
    );
  });

  it("uses the available free hand field for keyboard and hair gestures", () => {
    expect(
      SCENARIOS.find((item) => item.id === "working-laptop")?.apply(baseState)
        .freeHandPosition,
    ).toBe("on-keyboard");
    expect(
      SCENARIOS.find((item) => item.id === "getting-ready")?.apply(baseState)
        .freeHandPosition,
    ).toBe("on-hair");
  });

  it("ensures the window scenario has a window without changing unrelated clothing", () => {
    const preset = SCENARIOS.find((item) => item.id === "standing-window");
    const result = preset?.apply({
      ...baseState,
      roomWindow: "none",
      clothingTop: "hoodie",
    });
    expect(result?.roomWindow).toBe("medium");
    expect(result?.clothingTop).toBe("hoodie");
  });
});
