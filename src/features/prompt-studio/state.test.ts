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

  it("locks lying selfie phone geometry above the chest", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "lying-bed",
      phonePosition: "front-of-face",
    });

    expect(resolved.phonePosition).toBe("above-chest");
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
