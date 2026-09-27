import {
  arabicCaptureGeometry,
  arabicCaptureRealism,
  arabicHandDescription,
  arabicIdentityDescription,
  arabicScenarioDescription,
  effectiveEyeDirection,
  effectiveMouthState,
  englishCaptureGeometry,
  englishCaptureRealism,
  englishHairDescription,
  englishHandDescription,
  englishIdentityDescription,
  englishScenarioDescription,
} from "./promptFragments";
import {
  backPostureLabels,
  cameraAngles,
  cameraDistances,
  clothingBottomLabels,
  clothingColorLabels,
  clothingMaterialLabels,
  clothingTopLabels,
  englishBackPostures,
  englishCameraAngles,
  englishCameraDistances,
  englishClothingBottoms,
  englishClothingColors,
  englishClothingMaterials,
  englishClothingTops,
  englishEyeDirections,
  englishFaceExpressions,
  englishHeadDirections,
  englishMouthStates,
  englishPoseTypes,
  englishShoulderPositions,
  englishShotTypes,
  eyeDirectionLabels,
  faceExpressionLabels,
  FIXED_ROOM_DESCRIPTION_AR,
  FIXED_ROOM_DESCRIPTION_EN,
  hairLengthLabels,
  hairStyleLabels,
  hairTextureLabels,
  headDirectionLabels,
  lightingModeLabels,
  lightingModeLabelsAr,
  mouthStateLabels,
  poseTypeLabels,
  shoulderPositionLabels,
  shotTypes,
} from "./promptLexicon";
import type { SceneState } from "./types";

export function buildPromptEnglish(state: SceneState): string {
  return `${englishIdentityDescription(state)}${englishShotTypes[state.shotType]}, the subject is ${englishPoseTypes[state.poseType]}, head ${englishHeadDirections[state.headDirection]}, shoulders ${englishShoulderPositions[state.shoulderPosition]}, back ${englishBackPostures[state.backPosture]}.${englishScenarioDescription(state)} Facial expression: ${englishFaceExpressions[state.faceExpression]}, eyes ${englishEyeDirections[effectiveEyeDirection(state)]}, mouth ${englishMouthStates[effectiveMouthState(state)]}. Hair: ${englishHairDescription(state)}. Wearing: a ${englishClothingMaterials[state.clothingMaterial]} ${englishClothingTops[state.clothingTop]} in ${englishClothingColors[state.clothingColor]} tones, and ${englishClothingBottoms[state.clothingBottom]}. ${englishHandDescription(state)} ${englishCaptureGeometry(state)} ${englishCameraDistances[state.cameraDistance]}, camera at ${englishCameraAngles[state.cameraAngle]}. ${FIXED_ROOM_DESCRIPTION_EN}. Lighting: ${lightingModeLabels[state.lightingMode]}. ${englishCaptureRealism(state)}`;
}

export function buildPromptArabic(state: SceneState): string {
  return `${arabicIdentityDescription(state)}${shotTypes[state.shotType]}، الشخص ${poseTypeLabels[state.poseType]}، رأسه ${headDirectionLabels[state.headDirection]}، وكتفاه ${shoulderPositionLabels[state.shoulderPosition]}، وظهره ${backPostureLabels[state.backPosture]}.${arabicScenarioDescription(state)} تعبير الوجه: ${faceExpressionLabels[state.faceExpression]}، والعينان ${eyeDirectionLabels[effectiveEyeDirection(state)]}، والفم ${mouthStateLabels[effectiveMouthState(state)]}. الشعر: ${hairLengthLabels[state.hairLength]} ${hairTextureLabels[state.hairTexture]} ${hairStyleLabels[state.hairStyle]}. الملابس: ${clothingTopLabels[state.clothingTop]} من ${clothingMaterialLabels[state.clothingMaterial]} بدرجات ${clothingColorLabels[state.clothingColor]}، و${clothingBottomLabels[state.clothingBottom]}. ${arabicHandDescription(state)} ${arabicCaptureGeometry(state)} الكاميرا ${cameraDistances[state.cameraDistance]}، عند ${cameraAngles[state.cameraAngle]}. ${FIXED_ROOM_DESCRIPTION_AR}. الإضاءة: ${lightingModeLabelsAr[state.lightingMode]}. ${arabicCaptureRealism(state)}`;
}
