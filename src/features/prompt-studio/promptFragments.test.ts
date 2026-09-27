import { describe, expect, it } from "vitest";

import {
  effectiveEyeDirection,
  effectiveMouthState,
  englishCaptureGeometry,
  englishIdentityDescription,
} from "./promptFragments";
import { createDefaultSceneState } from "./state";

describe("prompt fragments", () => {
  it("keeps identity text conditional on a reference image", () => {
    const state = createDefaultSceneState();
    expect(englishIdentityDescription(state)).toContain("reference image");
    expect(
      englishIdentityDescription({ ...state, referenceProvided: false }),
    ).toBe("");
  });

  it("normalizes sleepy open-smile mouth state to closed", () => {
    const state = createDefaultSceneState();
    expect(
      effectiveMouthState({
        ...state,
        faceExpression: "sleepy",
        mouthState: "smile-open-light",
      }),
    ).toBe("closed");
  });

  it("normalizes side-glance camera gaze away from the camera", () => {
    const state = createDefaultSceneState();
    expect(
      effectiveEyeDirection({
        ...state,
        faceExpression: "side-glance",
        eyeDirection: "camera",
      }),
    ).toBe("away-soft");
  });

  it("keeps front-selfie phone body outside the captured frame", () => {
    const state = createDefaultSceneState();
    expect(englishCaptureGeometry(state)).toContain(
      "phone body itself remains outside the captured frame",
    );
  });

  it("keeps mirror-selfie phone visible in the reflection", () => {
    const state = createDefaultSceneState();
    expect(
      englishCaptureGeometry({
        ...state,
        shotType: "mirror-selfie",
        phonePosition: "chest-level",
      }),
    ).toContain("naturally visible in the mirror reflection");
  });
});
