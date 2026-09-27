import {
  englishFreeHandPositions,
  englishHairLengths,
  englishHairStyles,
  englishHairTextures,
  englishHandFingersStates,
  englishHandVisibilities,
  freeHandPositionLabels,
  handFingersStateLabels,
  handVisibilityLabels,
  identityPriorityLabels,
  identityPriorityLabelsAr,
  phonePositionLabels,
  phonePositionLabelsAr,
} from "./promptLexicon";
import type { SceneState } from "./types";

export function effectiveMouthState(
  state: SceneState,
): SceneState["mouthState"] {
  if (
    state.faceExpression === "sleepy" &&
    state.mouthState === "smile-open-light"
  ) {
    return "closed";
  }
  if (state.faceExpression === "closed-smile") return "smile-closed";
  if (
    state.faceExpression === "light-laugh" &&
    (state.mouthState === "closed" || state.mouthState === "smile-closed")
  ) {
    return "slightly-open";
  }
  return state.mouthState;
}

export function effectiveEyeDirection(
  state: SceneState,
): SceneState["eyeDirection"] {
  return state.faceExpression === "side-glance" &&
    state.eyeDirection === "camera"
    ? "away-soft"
    : state.eyeDirection;
}

export function englishHairDescription(state: SceneState): string {
  if (state.hairStyle === "combed-back") {
    return `${englishHairLengths[state.hairLength]} ${englishHairTextures[state.hairTexture]} hair, combed back neatly`;
  }
  return `${englishHairLengths[state.hairLength]} ${englishHairTextures[state.hairTexture]} ${englishHairStyles[state.hairStyle]} hair`;
}

export function englishIdentityDescription(state: SceneState): string {
  if (!state.referenceProvided) return "";

  const notes = state.identityNotes.trim();
  const notesDescription = notes ? ` Additional identity notes: ${notes}.` : "";
  return `Preserve the subject's identity from the reference image with ${identityPriorityLabels[state.identityPriority]} priority.${notesDescription} `;
}

export function arabicIdentityDescription(state: SceneState): string {
  if (!state.referenceProvided) return "";

  const notes = state.identityNotes.trim();
  const notesDescription = notes ? ` ملاحظات إضافية عن الهوية: ${notes}.` : "";
  return `حافظ على هوية الشخص من الصورة المرجعية بأولوية ${identityPriorityLabelsAr[state.identityPriority]}.${notesDescription} `;
}

export function englishScenarioDescription(state: SceneState): string {
  if (state.scenario === "adjusting-clothing") {
    return " Fully dressed, the subject checks their outfit before going out while smoothing their hair in the mirror.";
  }
  if (state.scenario === "choosing-clothes") {
    return " The subject chooses clothes from the bedroom closet while holding a garment.";
  }
  return "";
}

export function arabicScenarioDescription(state: SceneState): string {
  if (state.scenario === "adjusting-clothing") {
    return " الشخص بملابس كاملة محتشمة يفحص مظهره قبل الخروج ويرتب شعره أمام المرآة.";
  }
  if (state.scenario === "choosing-clothes") {
    return " يختار قطعة ملابس من خزانة الغرفة وهو ممسك بها.";
  }
  return "";
}

export function englishHandDescription(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "The free hand is off-frame.";
  }
  return `The free hand is ${englishFreeHandPositions[state.freeHandPosition]}, fingers ${englishHandFingersStates[state.handFingersState]}, ${englishHandVisibilities[state.handVisibility]}.`;
}

export function arabicHandDescription(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "اليد الحرة خارج الإطار.";
  }
  return `اليد الحرة ${freeHandPositionLabels[state.freeHandPosition]}، والأصابع ${handFingersStateLabels[state.handFingersState]}، واليد ${handVisibilityLabels[state.handVisibility]}.`;
}

export function englishCaptureGeometry(state: SceneState): string {
  if (state.shotType === "mirror-selfie") {
    return `The phone is ${phonePositionLabels[state.phonePosition]} and is naturally visible in the mirror reflection. The phone-holding arm is bent naturally at the elbow.`;
  }

  if (state.poseType === "lying-bed" || state.phonePosition === "above-chest") {
    return "The front-camera viewpoint is held above the torso and aimed back toward the face. The phone body itself remains outside the captured frame. The selfie arm is raised with a natural bend at the elbow and remains physically connected and reachable.";
  }

  if (state.phonePosition === "side-soft") {
    return "The front-camera viewpoint is offset slightly to the side. The phone body itself remains outside the captured frame. The selfie arm extends forward and slightly sideways with a natural bend at the elbow.";
  }

  if (state.phonePosition === "chest-level") {
    return "The front-camera viewpoint is held from a lower chest-to-face line and aimed back toward the face. The phone body itself remains outside the captured frame. The selfie arm stays naturally bent and physically reachable.";
  }

  return "The front-camera viewpoint is directly in front of the face. The phone body itself remains outside the captured frame. The selfie arm extends forward with a slight natural bend at the elbow.";
}

export function arabicCaptureGeometry(state: SceneState): string {
  if (state.shotType === "mirror-selfie") {
    return `الهاتف ${phonePositionLabelsAr[state.phonePosition]} ويظهر بصورة طبيعية داخل انعكاس المرآة، والذراع الممسكة به منحنية بشكل طبيعي عند الكوع.`;
  }

  if (state.poseType === "lying-bed" || state.phonePosition === "above-chest") {
    return "منظور الكاميرا الأمامية مرفوع فوق الجذع وموجه نحو الوجه، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي مرفوعة بانحناء طبيعي عند الكوع ومتصلة بالجسم ضمن مدى وصول واقعي.";
  }

  if (state.phonePosition === "side-soft") {
    return "منظور الكاميرا الأمامية مزاح قليلاً إلى الجانب، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي ممتدة للأمام وإلى الجانب قليلاً مع انحناء طبيعي عند الكوع.";
  }

  if (state.phonePosition === "chest-level") {
    return "منظور الكاميرا الأمامية يأتي من خط منخفض بين الصدر والوجه وموجه نحو الوجه، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي منحنية بشكل طبيعي وضمن مدى وصول واقعي.";
  }

  return "منظور الكاميرا الأمامية أمام الوجه مباشرة، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي ممتدة للأمام مع انحناء طبيعي بسيط عند الكوع.";
}

export function englishCaptureRealism(state: SceneState): string {
  return state.shotType === "front-selfie"
    ? "Authentic front-camera smartphone photography, mild wide-angle proximity, natural deep depth of field, restrained HDR, natural skin texture, slight edge softness, and realistic shadow noise."
    : "Authentic handheld smartphone mirror photography, natural wide-angle perspective, natural deep depth of field, restrained HDR, natural skin texture, slight edge softness, and realistic shadow noise.";
}

export function arabicCaptureRealism(state: SceneState): string {
  return state.shotType === "front-selfie"
    ? "تصوير واقعي بالكاميرا الأمامية لهاتف ذكي، بمنظور قريب واسع قليلاً، وعمق ميدان طبيعي وعميق، وHDR محدود، وملمس بشرة طبيعي، وليونة طفيفة عند الحواف، وضجيج واقعي في الظلال."
    : "تصوير مرآة واقعي بهاتف محمول باليد، بمنظور واسع طبيعي، وعمق ميدان طبيعي وعميق، وHDR محدود، وملمس بشرة طبيعي، وليونة طفيفة عند الحواف، وضجيج واقعي في الظلال.";
}
