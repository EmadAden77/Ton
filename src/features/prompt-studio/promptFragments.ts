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

function englishDistanceMechanics(state: SceneState): string {
  if (state.cameraDistance === "extended") {
    return "Use a real lens-to-face distance of about 70-85 cm. The selfie arm reaches near full extension with minimal elbow flexion, without locking the joint or exceeding natural shoulder reach.";
  }

  if (state.cameraDistance === "close") {
    return "Use a real lens-to-face distance of about 45-55 cm, never an ultra-close 20-30 cm capture. The elbow stays more flexed while the shoulder and wrist remain relaxed and reachable, preventing exaggerated foreground enlargement of the face, limbs, or bed.";
  }

  return "Use a real lens-to-face distance of about 55-70 cm. The selfie arm keeps a slight natural bend at the elbow within realistic shoulder reach.";
}

function arabicDistanceMechanics(state: SceneState): string {
  if (state.cameraDistance === "extended") {
    return "تكون المسافة الحقيقية بين العدسة والوجه نحو 70–85 سم، وتصل ذراع السيلفي إلى قرب الامتداد الكامل مع انثناء طفيف جداً في الكوع من دون قفل المفصل أو تجاوز مدى الكتف الطبيعي.";
  }

  if (state.cameraDistance === "close") {
    return "تكون المسافة الحقيقية بين العدسة والوجه نحو 45–55 سم، وليست لقطة شديدة القرب بمسافة 20–30 سم. يبقى الكوع أكثر انثناءً والكتف والمعصم مرتاحين، مع منع تضخيم الوجه أو الأطراف أو السرير في المقدمة بسبب المنظور.";
  }

  return "تكون المسافة الحقيقية بين العدسة والوجه نحو 55–70 سم، وتحافظ ذراع السيلفي على انحناء طبيعي بسيط في الكوع ضمن مدى وصول واقعي للكتف.";
}

export function englishCaptureGeometry(state: SceneState): string {
  if (state.shotType === "mirror-selfie") {
    return `The phone is ${phonePositionLabels[state.phonePosition]} and is naturally visible in the mirror reflection. The phone-holding arm is bent naturally at the elbow.`;
  }

  const distanceMechanics = englishDistanceMechanics(state);

  if (state.poseType === "lying-bed" || state.phonePosition === "above-chest") {
    return `The front-camera viewpoint is held above the torso and aimed back toward the face. The phone body itself remains outside the captured frame. The selfie arm is raised and remains physically connected and reachable. ${distanceMechanics}`;
  }

  if (state.phonePosition === "side-soft") {
    return `The front-camera viewpoint is offset slightly to the side. The phone body itself remains outside the captured frame. The selfie arm extends forward and slightly sideways. ${distanceMechanics}`;
  }

  if (state.phonePosition === "chest-level") {
    return `The front-camera viewpoint is held from a lower chest-to-face line and aimed back toward the face. The phone body itself remains outside the captured frame. The selfie arm stays physically connected and reachable. ${distanceMechanics}`;
  }

  return `The front-camera viewpoint is directly in front of the face. The phone body itself remains outside the captured frame. The selfie arm extends forward. ${distanceMechanics}`;
}

export function arabicCaptureGeometry(state: SceneState): string {
  if (state.shotType === "mirror-selfie") {
    return `الهاتف ${phonePositionLabelsAr[state.phonePosition]} ويظهر بصورة طبيعية داخل انعكاس المرآة، والذراع الممسكة به منحنية بشكل طبيعي عند الكوع.`;
  }

  const distanceMechanics = arabicDistanceMechanics(state);

  if (state.poseType === "lying-bed" || state.phonePosition === "above-chest") {
    return `منظور الكاميرا الأمامية مرفوع فوق الجذع وموجه نحو الوجه، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي مرفوعة ومتصلة بالجسم ضمن مدى وصول واقعي. ${distanceMechanics}`;
  }

  if (state.phonePosition === "side-soft") {
    return `منظور الكاميرا الأمامية مزاح قليلاً إلى الجانب، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي ممتدة للأمام وإلى الجانب قليلاً. ${distanceMechanics}`;
  }

  if (state.phonePosition === "chest-level") {
    return `منظور الكاميرا الأمامية يأتي من خط منخفض بين الصدر والوجه وموجه نحو الوجه، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي متصلة بالجسم وضمن مدى وصول واقعي. ${distanceMechanics}`;
  }

  return `منظور الكاميرا الأمامية أمام الوجه مباشرة، بينما يبقى جسم الهاتف نفسه خارج الإطار الملتقط. ذراع السيلفي ممتدة للأمام. ${distanceMechanics}`;
}

export function englishCaptureRealism(state: SceneState): string {
  return state.shotType === "front-selfie"
    ? "Authentic front-camera smartphone photography, approximately 24 mm-equivalent perspective, mild wide-angle proximity only, straight architectural lines with only subtle edge distortion, natural deep depth of field, restrained HDR, natural skin texture, slight edge softness, and realistic shadow noise. Never use a 0.5x ultra-wide look, fisheye curvature, or perspective that makes nearby furniture look gigantic."
    : "Authentic handheld smartphone mirror photography, natural wide-angle perspective without fisheye distortion, natural deep depth of field, restrained HDR, natural skin texture, slight edge softness, and realistic shadow noise.";
}

export function arabicCaptureRealism(state: SceneState): string {
  return state.shotType === "front-selfie"
    ? "تصوير واقعي بالكاميرا الأمامية لهاتف ذكي بمنظور يقارب 24 مم مكافئ، واتساع خفيف فقط، مع خطوط معمارية شبه مستقيمة وتشوه طرفي محدود، وعمق ميدان طبيعي وعميق وHDR محدود وملمس بشرة طبيعي وضجيج واقعي في الظلال. ممنوع مظهر 0.5x ultra-wide أو fisheye أو منظور يضخم الأثاث القريب بشكل هائل."
    : "تصوير مرآة واقعي بهاتف محمول باليد، بمنظور واسع طبيعي من دون fisheye، وعمق ميدان طبيعي وعميق، وHDR محدود، وملمس بشرة طبيعي، وليونة طفيفة عند الحواف، وضجيج واقعي في الظلال.";
}
