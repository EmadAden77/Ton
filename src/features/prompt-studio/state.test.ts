import { describe, expect, it } from "vitest";

import {
  createDefaultSceneState,
  DEFAULT_SCENE_STATE,
  resolveLockedState,
} from "./state";

describe("scene state defaults", () => {
  it("creates the expected default selfie state", () => {
    expect(DEFAULT_SCENE_STATE).toMatchObject({
      shotType: "front-selfie",
      cameraDistance: "arm-length",
      cameraAngle: "eye-level",
      phonePosition: "front-of-face",
      poseType: "standing",
      legConfiguration: "neutral",
      torsoLean: "neutral",
      pelvisOrientation: "square",
      weightDistribution: "balanced",
      lightingMode: "as-in-photo",
      referenceProvided: false,
      scenario: "none",
    });
  });

  it("returns a fresh state object for each initializer call", () => {
    const first = createDefaultSceneState();
    const second = createDefaultSceneState();

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});

describe("resolveLockedState", () => {
  it("locks mirror selfie geometry to arm length, chest phone and mirror gaze", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      shotType: "mirror-selfie",
      cameraDistance: "close",
      phonePosition: "side-soft",
      eyeDirection: "camera",
    });

    expect(resolved.cameraDistance).toBe("arm-length");
    expect(resolved.phonePosition).toBe("chest-level");
    expect(resolved.eyeDirection).toBe("mirror");
  });

  it("locks lying selfie geometry and micro-pose support", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "lying-bed",
      phonePosition: "front-of-face",
      torsoLean: "slight-forward",
      pelvisOrientation: "slightly-left",
      weightDistribution: "left-biased",
    });

    expect(resolved.phonePosition).toBe("above-chest");
    expect(resolved.torsoLean).toBe("neutral");
    expect(resolved.pelvisOrientation).toBe("square");
    expect(resolved.weightDistribution).toBe("supported");
  });

  it("falls back from an incompatible leg configuration after a pose change", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "sitting-chair",
      legConfiguration: "staggered",
    });

    expect(resolved.legConfiguration).toBe("neutral");
  });

  it("locks the cross-legged pose to the cross-legged leg configuration", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged",
      legConfiguration: "neutral",
    });

    expect(resolved.legConfiguration).toBe("cross-legged");
  });

  it("does not mutate the input state", () => {
    const input = {
      ...createDefaultSceneState(),
      shotType: "mirror-selfie" as const,
      phonePosition: "side-soft" as const,
    };

    resolveLockedState(input);

    expect(input.phonePosition).toBe("side-soft");
  });
});
