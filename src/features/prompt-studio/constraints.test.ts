import { describe, expect, it } from "vitest";

import { getConflicts, getFieldConstraints } from "./constraints";
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

function option(field: keyof SceneState, state: SceneState, value: string) {
  return getFieldConstraints(field, state)?.options.find(
    (item) => item.value === value,
  );
}

describe("camera constraints", () => {
  it("locks mirror selfie distance to arm length", () => {
    const state = { ...baseState, shotType: "mirror-selfie" as const };
    expect(getFieldConstraints("cameraDistance", state)?.lockedTo).toBe(
      "arm-length",
    );
    expect(option("cameraDistance", state, "close")?.disabled).toBe(true);
  });

  it("disables extended distance for front selfie", () => {
    expect(option("cameraDistance", baseState, "extended")?.disabled).toBe(
      true,
    );
  });

  it("leaves camera angle unconstrained", () => {
    expect(getFieldConstraints("cameraAngle", baseState)).toBeNull();
  });
});

describe("free hand constraints", () => {
  it("limits lying-bed hand positions", () => {
    const state = { ...baseState, poseType: "lying-bed" as const };
    expect(option("freeHandPosition", state, "holding-phone")?.disabled).toBe(
      false,
    );
    expect(option("freeHandPosition", state, "on-keyboard")?.disabled).toBe(
      true,
    );
  });

  it("limits sitting-chair hand positions", () => {
    const state = { ...baseState, poseType: "sitting-chair" as const };
    expect(option("freeHandPosition", state, "on-keyboard")?.disabled).toBe(
      false,
    );
    expect(option("freeHandPosition", state, "on-bed")?.disabled).toBe(true);
  });

  it("disables bed and keyboard hand positions while standing", () => {
    expect(option("freeHandPosition", baseState, "on-bed")?.disabled).toBe(
      true,
    );
    expect(option("freeHandPosition", baseState, "on-keyboard")?.disabled).toBe(
      true,
    );
  });
});

describe("face and gaze constraints", () => {
  it("locks mirror selfie gaze to the mirror", () => {
    const state = { ...baseState, shotType: "mirror-selfie" as const };
    expect(getFieldConstraints("eyeDirection", state)?.lockedTo).toBe("mirror");
  });

  it("disables mirror gaze while lying in a front selfie", () => {
    const state = { ...baseState, poseType: "lying-bed" as const };
    expect(option("eyeDirection", state, "mirror")?.disabled).toBe(true);
  });

  it("disables light laugh while lying on the bed", () => {
    const state = { ...baseState, poseType: "lying-bed" as const };
    expect(option("faceExpression", state, "light-laugh")?.disabled).toBe(true);
  });
});

describe("conflicts", () => {
  it("returns no conflicts for the default scene", () => {
    expect(getConflicts(baseState)).toEqual([]);
  });

  it("reports a stale mirror selfie distance", () => {
    expect(
      getConflicts({
        ...baseState,
        shotType: "mirror-selfie",
        cameraDistance: "close",
      }),
    ).toContain("سيلفي المرآة يتطلب مسافة طول الذراع");
  });

  it("returns null for fields without rules", () => {
    expect(getFieldConstraints("lightingMode", baseState)).toBeNull();
    expect(getFieldConstraints("clothingTop", baseState)).toBeNull();
  });
});
