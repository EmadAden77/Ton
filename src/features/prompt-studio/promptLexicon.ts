import type { SceneState } from "./types";

export const FIXED_ROOM_DESCRIPTION_EN =
  "in the fixed realistic modern bedroom: a dark tufted-headboard bed on the left, a bedside table with a lamp, a split AC above the bed, dark curtains at the back window, a glass-door wardrobe on the right, a wooden dresser, a beige rug, grey tiled floor, and recessed ceiling spotlights";

export const FIXED_ROOM_DESCRIPTION_AR =
  "في غرفة النوم الحديثة الواقعية الثابتة: سرير بلوح رأس داكن مبطن على اليسار، وطاولة جانبية مع مصباح، ومكيف سبليت فوق السرير، وستائر داكنة عند النافذة الخلفية، وخزانة بأبواب زجاجية على اليمين، وخزانة أدراج خشبية، وسجادة بيج، وأرضية بلاط رمادية، وسبوتات سقف غائرة";

export const lightingModeLabels: Record<SceneState["lightingMode"], string> = {
  "as-in-photo":
    "dim recessed ceiling spotlights plus a warm bedside lamp, with natural falloff and mixed practical-light shadows",
  "phone-screen":
    "the phone screen is the only active light source on the face; the ceiling spotlights and bedside lamp are off, the room stays very dark, and the light falls off quickly into natural shadow noise",
  "bedside-lamp-only":
    "the bedside lamp is the only practical light, producing a warm lateral pool with inverse-square falloff, soft local bounce, and naturally deeper shadow on the opposite side of the face",
  "ceiling-only":
    "only the recessed ceiling spotlights are on, creating realistic top-down pools, mild eye-socket shadow, modest floor bounce, and no artificial frontal fill",
  "blue-hour-closed":
    "cool blue-hour ambient light filters weakly through the closed dark curtains while indoor practical lights remain off, producing low exposure, cool room ambience, and natural shadow noise",
  "daylight-closed":
    "soft diffused daylight passing through the closed dark curtains; indoor practical lights are off",
  "daylight-open":
    "natural daylight entering through the open back-window curtains; indoor practical lights are off, with realistic window-to-room contrast",
  "overcast-open":
    "broad overcast daylight enters through the open curtains, giving soft low-directionality illumination, gentle facial modelling, restrained highlights, and indoor practical lights off",
};

export const lightingModeLabelsAr: Record<SceneState["lightingMode"], string> =
  {
    "as-in-photo":
      "سبوتات سقف غائرة وخافتة مع مصباح سرير دافئ، بتناقص ضوئي طبيعي وظلال ناتجة عن مصادر الإضاءة العملية المختلطة",
    "phone-screen":
      "شاشة الهاتف هي مصدر الضوء النشط الوحيد على الوجه؛ سبوتات السقف ومصباح السرير مطفأة، والغرفة شديدة العتمة مع تناقص سريع للضوء وضجيج طبيعي في الظلال",
    "bedside-lamp-only":
      "مصباح السرير هو مصدر الإضاءة العملي الوحيد، فيصنع حوضاً ضوئياً دافئاً جانبياً مع تناقص واقعي للشدة وانعكاس محلي خفيف وظل أعمق طبيعياً على الجهة المقابلة من الوجه",
    "ceiling-only":
      "سبوتات السقف الغائرة وحدها مضاءة، فتنتج بقع إضاءة علوية واقعية وظلالاً خفيفة حول محاجر العين وارتداداً محدوداً من الأرض من دون ضوء تعبئة أمامي مصطنع",
    "blue-hour-closed":
      "ضوء الساعة الزرقاء البارد يتسرب بخفة عبر الستائر الداكنة المغلقة مع إطفاء الإضاءة الداخلية، فينتج تعريضاً منخفضاً وجواً بارداً وضجيجاً طبيعياً في الظلال",
    "daylight-closed":
      "ضوء نهار ناعم ومنتشر يمر عبر الستائر الداكنة المغلقة، مع إطفاء الإضاءة الداخلية العملية",
    "daylight-open":
      "ضوء نهار طبيعي يدخل عبر ستائر النافذة الخلفية المفتوحة، مع إطفاء الإضاءة الداخلية والحفاظ على تباين واقعي بين النافذة والغرفة",
    "overcast-open":
      "ضوء نهار غائم واسع يدخل عبر الستائر المفتوحة، بإضاءة ناعمة قليلة الاتجاه ونحت لطيف للوجه ولمعان محدود، مع إطفاء الإضاءة الداخلية",
  };

export const identityPriorityLabels: Record<
  SceneState["identityPriority"],
  string
> = {
  strict: "strict",
  balanced: "balanced",
  flexible: "flexible",
};

export const identityPriorityLabelsAr: Record<
  SceneState["identityPriority"],
  string
> = {
  strict: "قصوى",
  balanced: "متوازنة",
  flexible: "مرنة",
};

export const phonePositionLabels: Record<SceneState["phonePosition"], string> =
  {
    "front-of-face": "held directly in front of the face",
    "chest-level": "held at chest level",
    "above-chest": "raised above the chest",
    "side-soft": "held slightly to the side",
  };

export const phonePositionLabelsAr: Record<
  SceneState["phonePosition"],
  string
> = {
  "front-of-face": "أمام الوجه",
  "chest-level": "على مستوى الصدر",
  "above-chest": "فوق الصدر",
  "side-soft": "جانبي بلطف",
};

export const shotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "سيلفي بالكاميرا الأمامية",
  "mirror-selfie": "سيلفي أمام المرآة",
};

export const englishShotTypes: Record<SceneState["shotType"], string> = {
  "front-selfie": "Front-camera selfie",
  "mirror-selfie": "Mirror selfie",
};

export const cameraDistances: Record<SceneState["cameraDistance"], string> = {
  close: "قريبة من الوجه",
  "arm-length": "عند طول الذراع",
  extended: "عند امتداد الذراع",
};

export const englishCameraDistances: Record<
  SceneState["cameraDistance"],
  string
> = {
  close: "Close to the face",
  "arm-length": "At arm's length",
  extended: "With an extended arm",
};

export const cameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "بمستوى العين",
  "slightly-above": "أعلى من مستوى العين قليلاً",
  "slightly-below": "أسفل من مستوى العين قليلاً",
};

export const englishCameraAngles: Record<SceneState["cameraAngle"], string> = {
  "eye-level": "eye level",
  "slightly-above": "slightly above eye level",
  "slightly-below": "slightly below eye level",
};

export const clothingTopLabels: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "تي شيرت",
  "long-sleeve-tshirt": "تي شيرت طويل الأكمام",
  "polo-shirt": "قميص بولو",
  henley: "قميص هنلي",
  shirt: "قميص",
  overshirt: "قميص خارجي خفيف",
  hoodie: "هودي",
  "pajama-top": "بلوزة نوم",
  sweater: "كنزة",
  "tank-top": "قميص بلا أكمام",
};

export const englishClothingTops: Record<SceneState["clothingTop"], string> = {
  "t-shirt": "T-shirt",
  "long-sleeve-tshirt": "long-sleeve T-shirt",
  "polo-shirt": "polo shirt",
  henley: "Henley shirt",
  shirt: "shirt",
  overshirt: "light overshirt",
  hoodie: "hoodie",
  "pajama-top": "pajama top",
  sweater: "sweater",
  "tank-top": "tank top",
};

export const clothingBottomLabels: Record<
  SceneState["clothingBottom"],
  string
> = {
  jeans: "بنطال جينز",
  chinos: "بنطال تشينو",
  "linen-trousers": "بنطال كتان",
  shorts: "شورت",
  "track-shorts": "شورت رياضي",
  "pajama-pants": "بنطال نوم",
  "lounge-pants": "بنطال منزلي",
  sweatpants: "بنطال رياضي",
  "none-visible": "القطعة السفلية خارج الإطار",
};

export const englishClothingBottoms: Record<
  SceneState["clothingBottom"],
  string
> = {
  jeans: "jeans",
  chinos: "chinos",
  "linen-trousers": "linen trousers",
  shorts: "shorts",
  "track-shorts": "track shorts",
  "pajama-pants": "pajama pants",
  "lounge-pants": "lounge pants",
  sweatpants: "sweatpants",
  "none-visible": "the lower garment outside the frame",
};

export const clothingMaterialLabels: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton: "قطن",
  jersey: "جيرسي",
  poplin: "بوبلين",
  linen: "كتان",
  denim: "دنيم",
  fleece: "فليس",
  wool: "صوف",
  polyester: "بوليستر",
};

export const englishClothingMaterials: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton: "cotton",
  jersey: "jersey",
  poplin: "poplin",
  linen: "linen",
  denim: "denim",
  fleece: "fleece",
  wool: "wool",
  polyester: "polyester",
};

export const englishClothingMaterialPhysics: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton:
    "The cotton has soft body, small natural folds, mild compression creases, and a matte surface response.",
  jersey:
    "The jersey drapes softly, stretches slightly around joints, and forms smooth gravity-led folds without looking rubbery.",
  poplin:
    "The poplin keeps a cleaner light structure with crisp small creases and restrained sheen.",
  linen:
    "The linen hangs with airy structure, visible irregular creasing, and a dry matte texture.",
  denim:
    "The denim stays comparatively structured with thicker fold ridges, limited stretch, and believable tension at bends.",
  fleece:
    "The fleece has soft volume, rounded folds, low sheen, and gentle compression where it contacts the body.",
  wool: "The wool has soft thickness, muted highlights, heavier drape, and broad folds rather than sharp synthetic creases.",
  polyester:
    "The polyester has light synthetic drape with modest sheen, fine folds, and controlled wrinkle recovery.",
};

export const arabicClothingMaterialPhysics: Record<
  SceneState["clothingMaterial"],
  string
> = {
  cotton:
    "يظهر القطن بجسم ناعم وثنيات صغيرة طبيعية وتجعدات ضغط خفيفة واستجابة سطحية مطفأة.",
  jersey:
    "ينسدل الجيرسي بنعومة ويتمدد قليلاً حول المفاصل مع ثنيات تقودها الجاذبية من دون مظهر مطاطي.",
  poplin:
    "يحافظ البوبلين على بنية خفيفة أنظف وتجعدات صغيرة محددة ولمعان محدود.",
  linen: "ينسدل الكتان ببنية هوائية مع تجعدات غير منتظمة واضحة وملمس جاف مطفأ.",
  denim:
    "يبقى الدنيم أكثر تماسكاً بثنيات أكثر سماكة وتمدد محدود وشد واقعي عند الانحناءات.",
  fleece:
    "يظهر الفليس بحجم ناعم وثنيات مستديرة ولمعان منخفض وانضغاط لطيف عند ملامسة الجسم.",
  wool: "يظهر الصوف بسماكة ناعمة ولمعان خافت وانسدال أثقل وثنيات عريضة بدلاً من التجعدات الصناعية الحادة.",
  polyester:
    "ينسدل البوليستر بخفة صناعية مع لمعان معتدل وثنيات دقيقة وارتداد متزن للتجعد.",
};

export const clothingColorLabels: Record<SceneState["clothingColor"], string> =
  {
    neutral: "محايدة",
    dark: "داكنة",
    light: "فاتحة",
    "earth-tone": "ترابية",
    pastel: "باستيل",
  };

export const englishClothingColors: Record<
  SceneState["clothingColor"],
  string
> = {
  neutral: "neutral",
  dark: "dark",
  light: "light",
  "earth-tone": "earth",
  pastel: "pastel",
};

export const hairStyleLabels: Record<SceneState["hairStyle"], string> = {
  natural: "طبيعي",
  combed: "ممشط",
  "messy-light": "فوضوي قليلاً",
  "combed-back": "ممشط للخلف بانتظام",
  "side-part": "مفرق جانبياً",
};

export const englishHairStyles: Record<SceneState["hairStyle"], string> = {
  natural: "natural",
  combed: "combed",
  "messy-light": "slightly tousled",
  "combed-back": "combed back neatly",
  "side-part": "side-parted",
};

export const hairLengthLabels: Record<SceneState["hairLength"], string> = {
  short: "قصير",
  medium: "متوسط",
  long: "طويل",
};

export const englishHairLengths: Record<SceneState["hairLength"], string> = {
  short: "short",
  medium: "medium-length",
  long: "long",
};

export const hairTextureLabels: Record<SceneState["hairTexture"], string> = {
  straight: "أملس",
  wavy: "مموج",
  curly: "مجعد",
};

export const englishHairTextures: Record<SceneState["hairTexture"], string> = {
  straight: "straight",
  wavy: "wavy",
  curly: "curly",
};

export const poseTypeLabels: Record<SceneState["poseType"], string> = {
  standing: "واقف",
  "standing-window": "واقف قرب النافذة",
  "standing-wardrobe": "واقف أمام الخزانة",
  "leaning-dresser": "متكئ بخفة على خزانة الأدراج",
  "sitting-chair": "جالس على كرسي",
  "sitting-bed": "جالس على السرير",
  "sitting-bed-edge": "جالس على حافة السرير",
  "sitting-bed-cross-legged": "جالس متربعاً على السرير",
  "reclining-headboard": "متكئ على لوح السرير",
  "lying-bed": "مستلقٍ على السرير",
};

export const englishPoseTypes: Record<SceneState["poseType"], string> = {
  standing: "standing",
  "standing-window": "standing near the window",
  "standing-wardrobe": "standing beside the wardrobe",
  "leaning-dresser": "leaning lightly against the dresser",
  "sitting-chair": "sitting on a chair",
  "sitting-bed": "sitting on the bed",
  "sitting-bed-edge": "sitting on the edge of the bed",
  "sitting-bed-cross-legged": "sitting cross-legged on the bed",
  "reclining-headboard": "reclining against the headboard",
  "lying-bed": "lying on the bed",
};

export const englishPoseMechanics: Record<SceneState["poseType"], string> = {
  standing:
    "Body weight is balanced naturally through both feet with relaxed knees and no mannequin-stiff posture.",
  "standing-window":
    "The stance stays stable near the window with a small natural weight shift and enough clearance from the curtains.",
  "standing-wardrobe":
    "The subject stands within realistic reach of the wardrobe, with a mild weight shift and shoulders free of the doors.",
  "leaning-dresser":
    "The pelvis or hip makes light supported contact with the dresser while the feet remain load-bearing and the torso keeps believable counterbalance.",
  "sitting-chair":
    "The pelvis is supported by the chair, thighs angle naturally from the hips, and the feet remain plausibly grounded.",
  "sitting-bed":
    "The mattress compresses under the pelvis and thighs while the torso remains supported by the seated base.",
  "sitting-bed-edge":
    "The pelvis sits near the mattress edge with visible cushion compression, thighs descending naturally and feet plausibly reaching the floor.",
  "sitting-bed-cross-legged":
    "Both legs fold naturally on the mattress with asymmetric hip rotation, supported knees, and localized mattress compression.",
  "reclining-headboard":
    "The back and shoulders are supported by the headboard and pillows, with the pelvis settled into the mattress and the spine gently reclined rather than floating.",
  "lying-bed":
    "The body is supported by the mattress with realistic shoulder, hip, and pillow compression and no hovering limbs.",
};

export const arabicPoseMechanics: Record<SceneState["poseType"], string> = {
  standing:
    "يتوزع وزن الجسم طبيعياً على القدمين مع ارتخاء الركبتين وتجنب الوقفة الجامدة.",
  "standing-window":
    "تبقى الوقفة ثابتة قرب النافذة مع انتقال وزن طبيعي بسيط وترك مسافة واقعية عن الستائر.",
  "standing-wardrobe":
    "يقف الشخص ضمن مدى وصول واقعي إلى الخزانة مع انتقال وزن خفيف وابتعاد الكتفين عن مسار الأبواب.",
  "leaning-dresser":
    "يلامس الحوض أو الورك خزانة الأدراج باتكاء خفيف مدعوم، بينما تبقى القدمان حاملتين للوزن ويوازن الجذع نفسه بشكل واقعي.",
  "sitting-chair":
    "يرتكز الحوض على الكرسي وتخرج الفخذان بزاوية طبيعية من الوركين مع بقاء القدمين في موضع أرضي منطقي.",
  "sitting-bed":
    "تنضغط المرتبة تحت الحوض والفخذين بينما يبقى الجذع مدعوماً بقاعدة الجلوس.",
  "sitting-bed-edge":
    "يجلس الحوض قرب حافة المرتبة مع انضغاط واضح للوسادة، وتنزل الفخذان طبيعياً وتصل القدمان إلى الأرض بصورة منطقية.",
  "sitting-bed-cross-legged":
    "تنثني الساقان طبيعياً فوق المرتبة مع دوران غير متماثل للوركين ودعم الركبتين وانضغاط موضعي للمرتبة.",
  "reclining-headboard":
    "يدعم لوح السرير والوسائد الظهر والكتفين بينما يستقر الحوض في المرتبة ويميل العمود الفقري برفق من دون أي إحساس بالطفو.",
  "lying-bed":
    "يدعم السرير الجسم مع انضغاط واقعي عند الكتفين والحوض والوسادة ومن دون أطراف عائمة.",
};

export const headDirectionLabels: Record<SceneState["headDirection"], string> =
  {
    forward: "للأمام",
    "slightly-left": "لليسار قليلاً",
    "slightly-right": "لليمين قليلاً",
    down: "للأسفل",
    "up-soft": "للأعلى قليلاً",
  };

export const englishHeadDirections: Record<
  SceneState["headDirection"],
  string
> = {
  forward: "facing forward",
  "slightly-left": "turned slightly left",
  "slightly-right": "turned slightly right",
  down: "angled down",
  "up-soft": "angled gently upward",
};

export const shoulderPositionLabels: Record<
  SceneState["shoulderPosition"],
  string
> = {
  relaxed: "مسترخيان",
  "one-raised": "أحدهما مرتفع قليلاً",
  "both-back": "للخلف",
};

export const englishShoulderPositions: Record<
  SceneState["shoulderPosition"],
  string
> = {
  relaxed: "relaxed",
  "one-raised": "one slightly raised",
  "both-back": "drawn back",
};

export const backPostureLabels: Record<SceneState["backPosture"], string> = {
  straight: "مستقيم",
  relaxed: "مسترخٍ",
  "slightly-leaning": "مائل قليلاً",
};

export const englishBackPostures: Record<SceneState["backPosture"], string> = {
  straight: "straight",
  relaxed: "relaxed",
  "slightly-leaning": "slightly leaning",
};

export const faceExpressionLabels: Record<
  SceneState["faceExpression"],
  string
> = {
  neutral: "محايد طبيعي",
  "soft-smile": "ابتسامة خفيفة",
  "closed-smile": "ابتسامة مغلقة",
  "calm-focus": "تركيز هادئ",
  "side-glance": "نظرة جانبية",
  thinking: "تفكير",
  sleepy: "نعاس خفيف",
  "light-laugh": "ضحكة خفيفة",
};

export const englishFaceExpressions: Record<
  SceneState["faceExpression"],
  string
> = {
  neutral: "neutral",
  "soft-smile": "a soft smile",
  "closed-smile": "a closed-mouth smile",
  "calm-focus": "calm focus",
  "side-glance": "a side glance",
  thinking: "thoughtful",
  sleepy: "slightly sleepy",
  "light-laugh": "a light laugh",
};

export const eyeDirectionLabels: Record<SceneState["eyeDirection"], string> = {
  camera: "نحو الكاميرا",
  mirror: "نحو المرآة",
  "away-soft": "بعيداً بلطف",
  "down-soft": "للأسفل بلطف",
};

export const englishEyeDirections: Record<SceneState["eyeDirection"], string> =
  {
    camera: "at the camera",
    mirror: "at the mirror",
    "away-soft": "softly away",
    "down-soft": "softly down",
  };

export const mouthStateLabels: Record<SceneState["mouthState"], string> = {
  closed: "مغلق",
  "slightly-open": "مفتوح قليلاً",
  "smile-closed": "في ابتسامة مغلقة",
  "smile-open-light": "في ابتسامة مفتوحة خفيفة",
};

export const englishMouthStates: Record<SceneState["mouthState"], string> = {
  closed: "closed",
  "slightly-open": "slightly open",
  "smile-closed": "in a closed smile",
  "smile-open-light": "in a light open smile",
};

export const freeHandPositionLabels: Record<
  SceneState["freeHandPosition"],
  string
> = {
  "at-side": "بجانب الجسم",
  "on-hair": "على الشعر",
  "holding-cup": "تحمل كوباً",
  "touching-chin": "تلمس الذقن",
  "in-pocket": "في الجيب",
  "on-bed": "على السرير",
  "on-chest": "على الصدر",
  "on-keyboard": "على لوحة المفاتيح",
  "holding-cloth": "تحمل قطعة قماش",
  "holding-phone": "تحمل الهاتف",
};

export const englishFreeHandPositions: Record<
  SceneState["freeHandPosition"],
  string
> = {
  "at-side": "at the side",
  "on-hair": "on the hair",
  "holding-cup": "holding a cup",
  "touching-chin": "touching the chin",
  "in-pocket": "in a pocket",
  "on-bed": "on the bed",
  "on-chest": "on the chest",
  "on-keyboard": "on the keyboard",
  "holding-cloth": "holding a piece of cloth",
  "holding-phone": "holding a phone",
};

export const handFingersStateLabels: Record<
  SceneState["handFingersState"],
  string
> = {
  relaxed: "مسترخية",
  "slightly-curled": "ملتفة قليلاً",
  "gripping-soft": "قابضة برفق",
};

export const englishHandFingersStates: Record<
  SceneState["handFingersState"],
  string
> = {
  relaxed: "relaxed",
  "slightly-curled": "slightly curled",
  "gripping-soft": "gently gripping",
};

export const handVisibilityLabels: Record<
  SceneState["handVisibility"],
  string
> = {
  "fully-visible": "ظاهرة بالكامل في الإطار",
  "partially-visible": "ظاهرة جزئياً في الإطار",
  "off-frame": "خارج الإطار",
};

export const englishHandVisibilities: Record<
  SceneState["handVisibility"],
  string
> = {
  "fully-visible": "fully visible in frame",
  "partially-visible": "partially visible in frame",
  "off-frame": "off-frame",
};
