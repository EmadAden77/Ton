import { describe, expect, it } from "vitest";

import {
  legConfigurationOptions,
  pelvisOrientationOptions,
  torsoLeanOptions,
  weightDistributionOptions,
} from "./microPose";
import {
  backPostureOptions,
  cameraAngleOptions,
  cameraDistanceOptions,
  clothingBottomOptions,
  clothingColorOptions,
  clothingMaterialOptions,
  clothingTopOptions,
  eyeDirectionOptions,
  faceExpressionOptions,
  freeHandPositionOptions,
  hairLengthOptions,
  hairStyleOptions,
  hairTextureOptions,
  handFingersStateOptions,
  handVisibilityOptions,
  headDirectionOptions,
  identityPriorityOptions,
  lightingModeOptions,
  mouthStateOptions,
  phonePositionOptions,
  poseTypeOptions,
  shoulderPositionOptions,
  shotTypeOptions,
} from "./options";
import { buildPromptArabic, buildPromptEnglish } from "./promptBuilder";
import { createDefaultSceneState } from "./state";
import { THREE_D_LIGHTING, THREE_D_POSES } from "./threeDScene";
import type { SceneState } from "./types";

type Option = { value: string };

const optionFields: ReadonlyArray<[keyof SceneState, readonly Option[]]> = [
  ["shotType", shotTypeOptions],
  ["lightingMode", lightingModeOptions],
  ["cameraDistance", cameraDistanceOptions],
  ["cameraAngle", cameraAngleOptions],
  ["phonePosition", phonePositionOptions],
  ["clothingTop", clothingTopOptions],
  ["clothingBottom", clothingBottomOptions],
  ["clothingMaterial", clothingMaterialOptions],
  ["clothingColor", clothingColorOptions],
  ["identityPriority", identityPriorityOptions],
  ["hairStyle", hairStyleOptions],
  ["hairLength", hairLengthOptions],
  ["hairTexture", hairTextureOptions],
  ["poseType", poseTypeOptions],
  ["legConfiguration", legConfigurationOptions],
  ["torsoLean", torsoLeanOptions],
  ["pelvisOrientation", pelvisOrientationOptions],
  ["weightDistribution", weightDistributionOptions],
  ["headDirection", headDirectionOptions],
  ["shoulderPosition", shoulderPositionOptions],
  ["backPosture", backPostureOptions],
  ["faceExpression", faceExpressionOptions],
  ["eyeDirection", eyeDirectionOptions],
  ["mouthState", mouthStateOptions],
  ["freeHandPosition", freeHandPositionOptions],
  ["handFingersState", handFingersStateOptions],
  ["handVisibility", handVisibilityOptions],
];

describe("selectable option coverage", () => {
  it("renders every selectable value in both prompt languages without missing mappings", () => {
    const base = {
      ...createDefaultSceneState(),
      referenceProvided: true,
    };

    for (const [field, options] of optionFields) {
      for (const option of options) {
        const state = {
          ...base,
          [field]: option.value,
        } as SceneState;
        const english = buildPromptEnglish(state);
        const arabic = buildPromptArabic(state);

        expect(english, `${String(field)}=${option.value}`).not.toContain(
          "undefined",
        );
        expect(arabic, `${String(field)}=${option.value}`).not.toContain(
          "undefined",
        );
      }
    }
  });

  it("keeps every pose option represented in the 3D domain", () => {
    expect(THREE_D_POSES.map((pose) => pose.id)).toEqual(
      poseTypeOptions.map((option) => option.value),
    );
  });

  it("keeps every lighting option represented in the 3D domain", () => {
    expect(Object.keys(THREE_D_LIGHTING)).toEqual(
      lightingModeOptions.map((option) => option.value),
    );
  });

  it("keeps all option values unique inside each field", () => {
    for (const [field, options] of optionFields) {
      const values = options.map((option) => option.value);
      expect(new Set(values).size, String(field)).toBe(values.length);
    }
  });
});
