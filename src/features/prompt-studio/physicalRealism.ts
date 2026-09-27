import type { SceneState } from "./types";

const BED_CONTACT_POSES: readonly SceneState["poseType"][] = [
  "sitting-bed",
  "sitting-bed-edge",
  "sitting-bed-cross-legged",
  "reclining-headboard",
  "lying-bed",
];

function englishHairPhysics(state: SceneState): string {
  const supportPhysics =
    state.poseType === "lying-bed" || state.poseType === "reclining-headboard"
      ? "Hair follows gravity and shows mild localized compression where it contacts the pillow or headboard, with a few natural flyaways rather than floating strands."
      : "Hair follows gravity with small natural strand separation and restrained flyaways, never forming a rigid helmet shape.";

  const identityPhysics = state.referenceProvided
    ? " Preserve the reference hairline, temple shape, density, and natural scalp visibility; styling must not invent extra density or a new hairline."
    : " Keep believable strand density and natural scalp visibility without artificial thickening.";

  return `${supportPhysics}${identityPhysics}`;
}

function arabicHairPhysics(state: SceneState): string {
  const supportPhysics =
    state.poseType === "lying-bed" || state.poseType === "reclining-headboard"
      ? "يتبع الشعر الجاذبية مع انضغاط موضعي خفيف عند ملامسة الوسادة أو لوح السرير، وتظهر خصلات متناثرة طبيعية قليلة من دون خصلات عائمة."
      : "يتبع الشعر الجاذبية مع انفصال طبيعي بسيط بين الخصلات وتناثر محدود، من دون شكل صلب يشبه الخوذة.";

  const identityPhysics = state.referenceProvided
    ? " يُحافظ على خط الشعر وشكل الصدغين والكثافة وظهور فروة الرأس الطبيعي كما في المرجع، ولا تُخترع كثافة إضافية أو خط شعر جديد."
    : " تبقى كثافة الخصلات وظهور فروة الرأس طبيعيين من دون تكثيف اصطناعي.";

  return `${supportPhysics}${identityPhysics}`;
}

function englishClothingContactPhysics(state: SceneState): string {
  if (state.poseType === "lying-bed") {
    return "Clothing flattens and broadens at shoulder, back, hip, and mattress contact zones; gravity-driven folds spread laterally and fabric never clips through the body or bedding.";
  }

  if (state.poseType === "reclining-headboard") {
    return "Clothing compresses against the mattress, pillows, and headboard at real support points, with broad pressure folds and no gap between fabric and the surfaces carrying body load.";
  }

  if (state.poseType === "leaning-dresser") {
    return "Clothing shows localized compression and slight tension where the hip or pelvis contacts the dresser, while the remaining fabric hangs under gravity without intersecting the furniture.";
  }

  if (BED_CONTACT_POSES.includes(state.poseType)) {
    return "Seated fabric compresses under the pelvis and thighs, bunches naturally near the hips and knees, and follows mattress deformation without hovering above the bed.";
  }

  if (state.poseType === "sitting-chair") {
    return "Seated fabric compresses at the chair, pelvis, and upper thighs, with believable fold convergence around hips and knees and no cloth-chair interpenetration.";
  }

  return "Standing fabric hangs under gravity from the shoulders and waist, with local tension near bent joints and the selfie shoulder rather than symmetrical or gravity-defying folds.";
}

function arabicClothingContactPhysics(state: SceneState): string {
  if (state.poseType === "lying-bed") {
    return "تنبسط الملابس وتتسع عند مناطق ملامسة الكتفين والظهر والحوض والمرتبة، وتمتد الثنيات بفعل الجاذبية جانبياً من دون اختراق القماش للجسم أو الفراش.";
  }

  if (state.poseType === "reclining-headboard") {
    return "تنضغط الملابس عند نقاط الدعم الحقيقية مع المرتبة والوسائد ولوح السرير، بثنيات ضغط عريضة ومن دون فراغ بين القماش والأسطح التي تحمل وزن الجسم.";
  }

  if (state.poseType === "leaning-dresser") {
    return "يظهر انضغاط موضعي وشد خفيف في القماش عند ملامسة الورك أو الحوض لخزانة الأدراج، بينما ينسدل باقي القماش بالجاذبية من دون اختراق الأثاث.";
  }

  if (BED_CONTACT_POSES.includes(state.poseType)) {
    return "ينضغط القماش أثناء الجلوس تحت الحوض والفخذين ويتجمع طبيعياً قرب الوركين والركبتين ويتبع تشوه المرتبة من دون أن يطفو فوق السرير.";
  }

  if (state.poseType === "sitting-chair") {
    return "ينضغط القماش عند الكرسي والحوض وأعلى الفخذين مع تجمع منطقي للثنيات حول الوركين والركبتين ومن دون اختراق القماش للكرسي.";
  }

  return "تنسدل الملابس أثناء الوقوف بفعل الجاذبية من الكتفين والخصر، مع شد موضعي عند المفاصل المثنية وكتف السيلفي بدلاً من ثنيات متناظرة أو مخالفة للجاذبية.";
}

function englishHandPhysics(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "The off-frame hand must remain anatomically connected to the shoulder and elbow path; no phantom wrist or detached limb may enter the frame.";
  }

  if (
    state.freeHandPosition === "holding-cup" ||
    state.freeHandPosition === "holding-phone" ||
    state.freeHandPosition === "holding-cloth"
  ) {
    return "The visible fingers wrap the held object with believable contact, pressure, and thumb opposition; the object must not float or merge with the hand.";
  }

  if (state.freeHandPosition === "on-keyboard") {
    return "The free wrist and fingers align with the keyboard surface, with light key contact and no bent-back wrist or hovering fingertips.";
  }

  if (
    state.freeHandPosition === "on-hair" ||
    state.freeHandPosition === "touching-chin"
  ) {
    return "The free hand makes light skin-or-hair contact with relaxed finger spacing and no fused fingers or impossible wrist twist.";
  }

  return "The free arm follows a continuous shoulder-elbow-wrist chain with relaxed joint limits and believable support or gravity.";
}

function arabicHandPhysics(state: SceneState): string {
  if (state.handVisibility === "off-frame") {
    return "تبقى اليد الخارجة من الإطار متصلة تشريحياً بمسار الكتف والكوع، ولا يظهر معصم شبحي أو طرف منفصل داخل الإطار.";
  }

  if (
    state.freeHandPosition === "holding-cup" ||
    state.freeHandPosition === "holding-phone" ||
    state.freeHandPosition === "holding-cloth"
  ) {
    return "تلتف الأصابع الظاهرة حول الجسم المحمول بتلامس وضغط واقعيين مع مقابلة طبيعية للإبهام، ولا يطفو الجسم ولا يندمج مع اليد.";
  }

  if (state.freeHandPosition === "on-keyboard") {
    return "يصطف المعصم والأصابع مع سطح لوحة المفاتيح مع تلامس خفيف للمفاتيح، من دون التواء خلفي للمعصم أو أطراف أصابع عائمة.";
  }

  if (
    state.freeHandPosition === "on-hair" ||
    state.freeHandPosition === "touching-chin"
  ) {
    return "تلامس اليد الشعر أو الجلد بخفة مع تباعد طبيعي بين الأصابع ومن دون أصابع ملتحمة أو التواء غير ممكن للمعصم.";
  }

  return "يتبع الذراع الحر سلسلة تشريحية متصلة من الكتف إلى الكوع فالمعصم ضمن حدود مفصلية مريحة ودعم أو جاذبية منطقيين.";
}

function englishLightingPhysics(state: SceneState): string {
  const common =
    "Every highlight, cast shadow, contact shadow, and color cast must be caused by an active source in the selected lighting mode; there is no unmotivated frontal fill, rim light, or studio-style separation.";

  if (state.lightingMode === "phone-screen") {
    return `${common} Phone-screen light stays local to the face and near hand, falls off rapidly with distance, and never washes the whole room blue; smartphone auto-exposure lifts only what the sensor can plausibly recover, leaving real shadow noise.`;
  }

  if (state.lightingMode === "bedside-lamp-only") {
    return `${common} The warm bedside lamp creates a lateral brightness gradient and inverse-square falloff, while the far side of the face and room remains naturally darker.`;
  }

  if (state.lightingMode === "ceiling-only") {
    return `${common} Ceiling pools remain top-down, with darker eye sockets and modest floor bounce; no hidden frontal source fills facial shadows.`;
  }

  if (state.lightingMode === "as-in-photo") {
    return `${common} Mixed practical lights retain believable local white-balance differences instead of collapsing into one perfectly uniform color temperature.`;
  }

  if (state.lightingMode === "blue-hour-closed") {
    return `${common} Blue-hour ambience remains weak behind closed dark curtains, so exposure is low and interior contrast stays subdued rather than appearing like open-window daylight.`;
  }

  if (state.lightingMode === "daylight-closed") {
    return `${common} Closed curtains diffuse and reduce window light, producing broad soft illumination without a hard sun patch or bright direct beam.`;
  }

  if (state.lightingMode === "overcast-open") {
    return `${common} Overcast window light is broad and soft with restrained specular highlights and little directional hardness.`;
  }

  return `${common} Open-window daylight creates a believable window-to-room exposure gradient with stronger illumination near the window and darker interior falloff.`;
}

function arabicLightingPhysics(state: SceneState): string {
  const common =
    "يجب أن يكون كل لمعان وظل ساقط وظل تماس وانحراف لوني ناتجاً عن مصدر نشط فعلياً في نمط الإضاءة المختار، من دون تعبئة أمامية غير مبررة أو ضوء حافة أو فصل استوديو.";

  if (state.lightingMode === "phone-screen") {
    return `${common} يبقى ضوء الشاشة محلياً على الوجه واليد القريبة ويتناقص بسرعة مع المسافة ولا يغسل الغرفة كلها باللون الأزرق؛ يرفع التعريض التلقائي للهاتف فقط ما يستطيع المستشعر استعادته منطقياً مع بقاء ضجيج حقيقي في الظلال.`;
  }

  if (state.lightingMode === "bedside-lamp-only") {
    return `${common} يصنع مصباح السرير الدافئ تدرجاً جانبياً في السطوع وتناقصاً مع مربع المسافة، وتبقى الجهة البعيدة من الوجه والغرفة أغمق طبيعياً.`;
  }

  if (state.lightingMode === "ceiling-only") {
    return `${common} تبقى بقع السقف علوية الاتجاه مع محاجر عين أغمق وارتداد محدود من الأرض، من دون مصدر أمامي مخفي يملأ ظلال الوجه.`;
  }

  if (state.lightingMode === "as-in-photo") {
    return `${common} تحتفظ المصادر العملية المختلطة باختلافات محلية منطقية في توازن الأبيض بدلاً من التحول إلى حرارة لونية موحدة تماماً.`;
  }

  if (state.lightingMode === "blue-hour-closed") {
    return `${common} يبقى ضوء الساعة الزرقاء ضعيفاً خلف الستائر الداكنة المغلقة، فيظل التعريض منخفضاً والتباين الداخلي هادئاً ولا يبدو كضوء نافذة مفتوحة.`;
  }

  if (state.lightingMode === "daylight-closed") {
    return `${common} تشتت الستائر المغلقة ضوء النافذة وتخفض شدته فتنتج إضاءة عريضة ناعمة من دون بقعة شمس قاسية أو شعاع مباشر ساطع.`;
  }

  if (state.lightingMode === "overcast-open") {
    return `${common} يكون ضوء النافذة الغائم واسعاً وناعماً مع لمعان محدود وصلابة اتجاهية منخفضة.`;
  }

  return `${common} يصنع ضوء النهار عبر النافذة المفتوحة تدرج تعريض واقعي من النافذة إلى عمق الغرفة، مع ضوء أقوى قرب النافذة وتناقص أغمق في الداخل.`;
}

export function englishPhysicalRealismDescription(state: SceneState): string {
  return `Physical realism: ${englishHairPhysics(state)} ${englishClothingContactPhysics(state)} ${englishHandPhysics(state)} ${englishLightingPhysics(state)} Anatomy, support, gravity, perspective, and occlusion remain mutually consistent; no object or limb occupies the same solid space as furniture.`;
}

export function arabicPhysicalRealismDescription(state: SceneState): string {
  return `الواقعية الفيزيائية: ${arabicHairPhysics(state)} ${arabicClothingContactPhysics(state)} ${arabicHandPhysics(state)} ${arabicLightingPhysics(state)} تبقى التشريح ونقاط الدعم والجاذبية والمنظور والحجب متسقة معاً، ولا يشغل أي جسم أو طرف الحيز الصلب نفسه مع الأثاث.`;
}
