import { describe, expect, it } from "vitest";

import { getConflicts, getFieldConstraints } from "./constraints";
import type { SceneState } from "./types";

const baseState: SceneState = {
  shotType: "front-selfie",
  lightingSource: "window-day",
  lightingIntensity: "soft",
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

function option(field: keyof SceneState, state: SceneState, value: string) {
  return getFieldConstraints(field, state)?.options.find(
    (item) => item.value === value,
  );
}

describe("field constraints", () => {
  it("disables the bedside lamp without a bed and gives a reason", () => {
    const choice = option(
      "lightingSource",
      { ...baseState, roomHasBed: false },
      "bedside-lamp",
    );
    expect(choice?.disabled).toBe(true);
    expect(choice?.reason).toBe("لا يوجد سرير في الغرفة");
  });

  it("disables both window lights without a window", () => {
    const state = { ...baseState, roomWindow: "none" } as SceneState;
    expect(option("lightingSource", state, "window-day")?.disabled).toBe(true);
    expect(option("lightingSource", state, "window-sunset")?.disabled).toBe(
      true,
    );
  });

  it("locks mirror selfie distance to arm length", () => {
    const constraints = getFieldConstraints("cameraDistance", {
      ...baseState,
      shotType: "mirror-selfie",
    });
    expect(constraints?.lockedTo).toBe("arm-length");
    expect(
      option(
        "cameraDistance",
        { ...baseState, shotType: "mirror-selfie" },
        "close",
      )?.disabled,
    ).toBe(true);
  });

  it("disables bright bedside lighting", () => {
    expect(
      option(
        "lightingIntensity",
        {
          ...baseState,
          lightingSource: "bedside-lamp",
        },
        "bright",
      )?.disabled,
    ).toBe(true);
  });

  it("disables dim daytime lighting", () => {
    expect(option("lightingIntensity", baseState, "dim")?.disabled).toBe(true);
  });

  it("locks the light to bedside lamp when lying on the bed", () => {
    expect(
      getFieldConstraints("lightingSource", {
        ...baseState,
        poseType: "lying-bed",
      })?.lockedTo,
    ).toBe("bedside-lamp");
  });

  it("disables keyboard and hair placement when lying on the bed", () => {
    const state: SceneState = { ...baseState, poseType: "lying-bed" };
    expect(option("freeHandPosition", state, "on-keyboard")?.disabled).toBe(
      true,
    );
    expect(option("freeHandPosition", state, "on-hair")?.disabled).toBe(true);
    expect(option("freeHandPosition", state, "holding-phone")?.disabled).toBe(
      false,
    );
  });

  it("locks the bed on for sitting or lying on it", () => {
    expect(
      getFieldConstraints("roomHasBed", {
        ...baseState,
        poseType: "sitting-bed",
      })?.lockedTo,
    ).toBe("true");
  });

  it("leaves the window independent of artificial light", () => {
    expect(
      getFieldConstraints("roomWindow", {
        ...baseState,
        lightingSource: "ceiling",
      }),
    ).toBeNull();
  });

  it("rejects sitting or lying on a missing bed", () => {
    const state: SceneState = { ...baseState, roomHasBed: false };
    expect(option("poseType", state, "sitting-bed")?.disabled).toBe(true);
    expect(option("poseType", state, "lying-bed")?.disabled).toBe(true);
  });

  it("handles an older or future laptop screen light without crashing", () => {
    const state = {
      ...baseState,
      lightingSource: "laptop-screen",
    } as unknown as SceneState;
    expect(
      getFieldConstraints("lightingIntensity", state)
        ?.options.filter((item) => !item.disabled)
        .map((item) => item.value),
    ).toEqual(["dim"]);
    expect(getFieldConstraints("lightingDirection", state)?.lockedTo).toBe(
      "front",
    );
  });

  it("returns null for fields without rules", () => {
    expect(getFieldConstraints("clothingTop", baseState)).toBeNull();
  });
});

describe("remaining conflicts", () => {
  it("returns an empty list for the default consistent scene", () => {
    expect(getConflicts(baseState)).toEqual([]);
  });

  it("reports a bedside lamp without a bed in an older scene", () => {
    expect(
      getConflicts({
        ...baseState,
        roomHasBed: false,
        lightingSource: "bedside-lamp",
      }),
    ).toContain("اختيار مصباح سرير بدون سرير غير ممكن");
  });

  it("reports locked fields that still have an old value", () => {
    expect(
      getConflicts({
        ...baseState,
        shotType: "mirror-selfie",
        cameraDistance: "close",
      }),
    ).toContain("سيلفي المرآة يتطلب مسافة طول الذراع");
  });
});
