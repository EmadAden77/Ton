import { describe, expect, it } from "vitest";

import { getFieldConstraints } from "./constraints";
import {
  getThreeDMicroPoseTransform,
  legConfigurationOptions,
  pelvisOrientationOptions,
  torsoLeanOptions,
  weightDistributionOptions,
} from "./microPose";
import { buildPromptArabic, buildPromptEnglish } from "./positivePrompt";
import { createDefaultSceneState, resolveLockedState } from "./state";
import type { SceneState } from "./types";

function optionDisabled(
  field:
    | "legConfiguration"
    | "torsoLean"
    | "pelvisOrientation"
    | "weightDistribution",
  state: SceneState,
  value: string,
): boolean | undefined {
  return getFieldConstraints(field, state)?.options.find(
    (item) => item.value === value,
  )?.disabled;
}

describe("micro-pose catalog", () => {
  it("exposes the four micro-pose dimensions", () => {
    expect(legConfigurationOptions).toHaveLength(7);
    expect(torsoLeanOptions).toHaveLength(5);
    expect(pelvisOrientationOptions).toHaveLength(3);
    expect(weightDistributionOptions).toHaveLength(4);
  });

  it("keeps standing leg choices load-bearing and disables seated-only choices", () => {
    const state = createDefaultSceneState();

    expect(optionDisabled("legConfiguration", state, "staggered")).toBe(false);
    expect(optionDisabled("legConfiguration", state, "one-knee-bent")).toBe(
      false,
    );
    expect(optionDisabled("legConfiguration", state, "cross-legged")).toBe(
      true,
    );
    expect(optionDisabled("legConfiguration", state, "legs-extended")).toBe(
      true,
    );
  });

  it("locks the supported dresser lean and rejects unsupported forward torso lean", () => {
    const state = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "leaning-dresser",
      torsoLean: "slight-forward",
      weightDistribution: "left-biased",
    });

    expect(state.weightDistribution).toBe("supported");
    expect(state.torsoLean).toBe("neutral");
  });

  it("locks reclining support and backward torso lean", () => {
    const state = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "reclining-headboard",
      torsoLean: "slight-forward",
      weightDistribution: "balanced",
    });

    expect(state.torsoLean).toBe("slight-back");
    expect(state.weightDistribution).toBe("supported");
  });

  it("keeps lying pelvis square and support-based", () => {
    const state = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "lying-bed",
      pelvisOrientation: "slightly-right",
      weightDistribution: "right-biased",
    });

    expect(state.pelvisOrientation).toBe("square");
    expect(state.weightDistribution).toBe("supported");
  });
});

describe("micro-pose prompt language", () => {
  it("describes staggered stance, right pelvis rotation and left-biased weight in English", () => {
    const prompt = buildPromptEnglish({
      ...createDefaultSceneState(),
      legConfiguration: "staggered",
      torsoLean: "slight-left",
      pelvisOrientation: "slightly-right",
      weightDistribution: "left-biased",
    });

    expect(prompt).toContain("one foot sits slightly ahead of the other");
    expect(prompt).toContain("torso shifts slightly left");
    expect(prompt).toContain("pelvis rotates subtly right");
    expect(prompt).toContain("body load shifts modestly left");
  });

  it("describes supported lying micro-pose in Arabic after constraint resolution", () => {
    const state = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "lying-bed",
      legConfiguration: "one-knee-bent",
      weightDistribution: "balanced",
    });
    const prompt = buildPromptArabic(state);

    expect(prompt).toContain("تنثني ركبة واحدة");
    expect(prompt).toContain("سطح الدعم الحقيقي");
    expect(prompt).toContain("يبقى الحوض بمحاذاة مستقيمة");
  });
});

describe("micro-pose 3D transform", () => {
  it("derives torso, pelvis and weight offsets without changing the leg hint", () => {
    const transform = getThreeDMicroPoseTransform({
      ...createDefaultSceneState(),
      legConfiguration: "staggered",
      torsoLean: "slight-right",
      pelvisOrientation: "slightly-left",
      weightDistribution: "left-biased",
    });

    expect(transform.positionOffset[0]).toBeLessThan(0);
    expect(transform.rotationOffset[1]).toBeGreaterThan(0);
    expect(transform.rotationOffset[2]).toBeLessThan(0);
    expect(transform.legHint).toBe("staggered");
  });

  it("keeps the neutral default transform at zero", () => {
    expect(getThreeDMicroPoseTransform(createDefaultSceneState())).toEqual({
      positionOffset: [0, 0, 0],
      rotationOffset: [0, 0, 0],
      legHint: "neutral",
    });
  });
});
