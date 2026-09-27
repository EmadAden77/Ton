import { getFieldConstraints } from "./constraints";
import type { SceneState } from "./types";

const constrainedFields: (keyof SceneState)[] = [
  "cameraDistance",
  "freeHandPosition",
  "phonePosition",
  "eyeDirection",
  "faceExpression",
];

export const DEFAULT_SCENE_STATE: SceneState = {
  shotType: "front-selfie",
  lightingMode: "as-in-photo",
  cameraDistance: "arm-length",
  cameraAngle: "eye-level",
  phonePosition: "front-of-face",
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

export function createDefaultSceneState(): SceneState {
  return { ...DEFAULT_SCENE_STATE };
}

export function resolveLockedState(state: SceneState): SceneState {
  let resolved = { ...state };

  for (let pass = 0; pass < constrainedFields.length; pass += 1) {
    let changed = false;

    for (const field of constrainedFields) {
      const constraints = getFieldConstraints(field, resolved);
      if (constraints?.lockedTo === undefined) continue;

      if (String(resolved[field]) !== constraints.lockedTo) {
        resolved = {
          ...resolved,
          [field]: constraints.lockedTo,
        } as SceneState;
        changed = true;
      }
    }

    if (!changed) break;
  }

  return resolved;
}
