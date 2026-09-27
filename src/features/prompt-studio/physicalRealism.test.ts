import { describe, expect, it } from "vitest";

import { getConflicts, getFieldConstraints } from "./constraints";
import {
  arabicPhysicalRealismDescription,
  englishPhysicalRealismDescription,
} from "./physicalRealism";
import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "./promptBuilder";
import { SCENARIOS } from "./scenarios";
import { createDefaultSceneState, resolveLockedState } from "./state";
import {
  getThreeDPose,
  getThreeDPoseForState,
  selectThreeDPose,
} from "./threeDScene";
import type { SceneState } from "./types";

function disabled(
  field: keyof SceneState,
  state: SceneState,
  value: string,
): boolean | undefined {
  return getFieldConstraints(field, state)?.options.find(
    (option) => option.value === value,
  )?.disabled;
}

describe("maximum physical realism integration", () => {
  it("keeps the default scene constraint-safe", () => {
    expect(getConflicts(createDefaultSceneState())).toEqual([]);
  });

  it("anchors mirror selfies to the real wardrobe mirror and reachable capture geometry", () => {
    const scene = resolveLockedState({
      ...createDefaultSceneState(),
      shotType: "mirror-selfie",
      poseType: "lying-bed",
      cameraDistance: "close",
      phonePosition: "above-chest",
      eyeDirection: "camera",
    });

    expect(scene.poseType).toBe("standing-wardrobe");
    expect(scene.cameraDistance).toBe("arm-length");
    expect(scene.phonePosition).toBe("chest-level");
    expect(scene.eyeDirection).toBe("mirror");
    expect(getConflicts(scene)).toEqual([]);
  });

  it("prevents unsupported mirror gaze away from the wardrobe mirror", () => {
    const scene = createDefaultSceneState();
    expect(disabled("eyeDirection", scene, "mirror")).toBe(true);
  });

  it("keeps clothing materials compatible with the selected upper garment", () => {
    const hoodie = {
      ...createDefaultSceneState(),
      clothingTop: "hoodie" as const,
    };
    expect(disabled("clothingMaterial", hoodie, "fleece")).toBe(false);
    expect(disabled("clothingMaterial", hoodie, "denim")).toBe(true);

    const resolved = resolveLockedState({
      ...hoodie,
      clothingMaterial: "denim",
    });
    expect(resolved.clothingMaterial).toBe("cotton");
  });

  it("does not invent enough hair length for a full combed-back style", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      hairLength: "short",
      hairStyle: "combed-back",
    });
    expect(resolved.hairStyle).toBe("natural");
  });

  it("keeps spine wording coherent with an explicit torso lean", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      torsoLean: "slight-forward",
      backPosture: "straight",
    });
    expect(resolved.backPosture).toBe("slightly-leaning");
  });

  it("keeps supported lying shoulders and back physically plausible", () => {
    const resolved = resolveLockedState({
      ...createDefaultSceneState(),
      poseType: "lying-bed",
      shoulderPosition: "both-back",
      backPosture: "straight",
    });
    expect(resolved.shoulderPosition).toBe("relaxed");
    expect(resolved.backPosture).toBe("relaxed");
    expect(resolved.weightDistribution).toBe("supported");
  });

  it("makes mouth state agree with the facial expression", () => {
    const smile = resolveLockedState({
      ...createDefaultSceneState(),
      faceExpression: "soft-smile",
      mouthState: "closed",
    });
    expect(smile.mouthState).toBe("smile-closed");

    const laugh = resolveLockedState({
      ...createDefaultSceneState(),
      faceExpression: "light-laugh",
      mouthState: "closed",
    });
    expect(laugh.mouthState).toBe("slightly-open");
  });

  it("uses object-aware finger contact and visibility rules", () => {
    const holding = resolveLockedState({
      ...createDefaultSceneState(),
      freeHandPosition: "holding-cup",
      handFingersState: "relaxed",
      handVisibility: "off-frame",
    });
    expect(holding.handFingersState).toBe("gripping-soft");
    expect(holding.handVisibility).not.toBe("off-frame");

    const pocket = resolveLockedState({
      ...createDefaultSceneState(),
      freeHandPosition: "in-pocket",
      handVisibility: "fully-visible",
    });
    expect(pocket.handVisibility).toBe("partially-visible");
  });

  it("adds state-driven physical realism to both prompt languages", () => {
    const state = resolveLockedState({
      ...createDefaultSceneState(),
      referenceProvided: true,
      poseType: "lying-bed",
      lightingMode: "phone-screen",
    });
    const english = buildPromptEnglish(state);
    const arabic = buildPromptArabic(state);

    expect(english).toContain("Physical realism:");
    expect(english).toContain("Preserve the reference hairline");
    expect(english).toContain("mattress contact zones");
    expect(english).toContain("Phone-screen light stays local");
    expect(arabic).toContain("الواقعية الفيزيائية:");
    expect(arabic).toContain("خط الشعر");
    expect(arabic).toContain("المرتبة");
  });

  it("keeps direct realism fragment builders complete", () => {
    const state = createDefaultSceneState();
    expect(englishPhysicalRealismDescription(state)).not.toContain("undefined");
    expect(arabicPhysicalRealismDescription(state)).not.toContain("undefined");
  });

  it("adds mode-specific negative safeguards for light and support", () => {
    const phoneScreen = buildNegativePrompt({
      ...createDefaultSceneState(),
      lightingMode: "phone-screen",
    });
    expect(phoneScreen).toContain("no active ceiling lights");
    expect(phoneScreen).toContain("no room-wide blue screen wash");

    const lying = buildNegativePrompt(
      selectThreeDPose(createDefaultSceneState(), "lying-bed"),
    );
    expect(lying).toContain("no gap between supported body and mattress");
  });

  it("never applies whole-body micro transforms to supported poses", () => {
    const base = getThreeDPose("sitting-bed");
    const derived = getThreeDPoseForState({
      ...createDefaultSceneState(),
      poseType: "sitting-bed",
      torsoLean: "slight-left",
      pelvisOrientation: "slightly-right",
      weightDistribution: "left-biased",
    });

    expect(derived.modelPosition).toEqual(base.modelPosition);
    expect(derived.modelRotation).toEqual(base.modelRotation);
  });

  it("keeps every ready-made scenario physically resolved", () => {
    const base = createDefaultSceneState();
    for (const scenario of SCENARIOS) {
      expect(getConflicts(scenario.apply(base))).toEqual([]);
    }
  });
});
