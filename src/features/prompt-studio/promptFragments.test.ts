import { describe, expect, it } from "vitest";

import {
  arabicCaptureGeometry,
  effectiveEyeDirection,
  effectiveMouthState,
  englishCaptureGeometry,
  englishCaptureRealism,
  englishIdentityDescription,
} from "./promptFragments";
import { createDefaultSceneState } from "./state";

describe("prompt fragments", () => {
  it("keeps identity text conditional on a reference image", () => {
    const state = { ...createDefaultSceneState(), referenceProvided: true };
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

  it("uses bounded near-full extension for extended front selfies", () => {
    const state = {
      ...createDefaultSceneState(),
      cameraDistance: "extended" as const,
    };

    expect(englishCaptureGeometry(state)).toContain("70-85 cm");
    expect(englishCaptureGeometry(state)).toContain("near full extension");
    expect(arabicCaptureGeometry(state)).toContain("70–85 سم");
    expect(arabicCaptureGeometry(state)).toContain("قرب الامتداد الكامل");
  });

  it("prevents ultra-close distortion for close front selfies", () => {
    const state = {
      ...createDefaultSceneState(),
      cameraDistance: "close" as const,
    };

    expect(englishCaptureGeometry(state)).toContain("45-55 cm");
    expect(englishCaptureGeometry(state)).toContain("never an ultra-close 20-30 cm");
    expect(englishCaptureGeometry(state)).toContain(
      "preventing exaggerated foreground enlargement",
    );
    expect(arabicCaptureGeometry(state)).toContain("45–55 سم");
  });

  it("uses a restrained phone-lens perspective instead of ultra-wide distortion", () => {
    const state = createDefaultSceneState();
    const realism = englishCaptureRealism(state);

    expect(realism).toContain("24 mm-equivalent perspective");
    expect(realism).toContain("Never use a 0.5x ultra-wide look");
    expect(realism).toContain("nearby furniture look gigantic");
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
