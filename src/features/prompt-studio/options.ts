export type SelectOption = { value: string; label: string };

export const shotTypeOptions: SelectOption[] = [
  { value: "front-selfie", label: "سيلفي أمامي (Front selfie)" },
  { value: "mirror-selfie", label: "سيلفي مرآة (Mirror selfie)" },
];

export const cameraDistanceOptions: SelectOption[] = [
  { value: "close", label: "قريبة (Close)" },
  { value: "arm-length", label: "طول الذراع (Arm length)" },
  { value: "extended", label: "ذراع ممدودة (Extended)" },
];

export const cameraAngleOptions: SelectOption[] = [
  { value: "eye-level", label: "بمستوى العين (Eye level)" },
  { value: "slightly-above", label: "أعلى قليلاً (Slightly above)" },
  { value: "slightly-below", label: "أسفل قليلاً (Slightly below)" },
];

export const lightingModeOptions: SelectOption[] = [
  { value: "as-in-photo", label: "كما في الصورة (As in photo)" },
  { value: "phone-screen", label: "ضوء شاشة الهاتف (Phone screen)" },
  {
    value: "daylight-closed",
    label: "ضوء نهار — ستائر مغلقة (Daylight, closed curtains)",
  },
  {
    value: "daylight-open",
    label: "ضوء نهار — ستائر مفتوحة (Daylight, open curtains)",
  },
];

export const identityPriorityOptions: SelectOption[] = [
  { value: "strict", label: "قصوى (Strict)" },
  { value: "balanced", label: "متوازنة (Balanced)" },
  { value: "flexible", label: "مرنة (Flexible)" },
];

export const clothingTopOptions: SelectOption[] = [
  { value: "t-shirt", label: "تي شيرت (T-shirt)" },
  { value: "shirt", label: "قميص (Shirt)" },
  { value: "hoodie", label: "هودي (Hoodie)" },
  { value: "pajama-top", label: "بلوزة نوم (Pajama top)" },
  { value: "sweater", label: "كنزة (Sweater)" },
  { value: "tank-top", label: "قميص بلا أكمام (Tank top)" },
];

export const clothingBottomOptions: SelectOption[] = [
  { value: "jeans", label: "بنطال جينز (Jeans)" },
  { value: "shorts", label: "شورت (Shorts)" },
  { value: "pajama-pants", label: "بنطال نوم (Pajama pants)" },
  { value: "sweatpants", label: "بنطال رياضي (Sweatpants)" },
  { value: "none-visible", label: "غير ظاهرة (Not visible)" },
];

export const clothingMaterialOptions: SelectOption[] = [
  { value: "cotton", label: "قطن (Cotton)" },
  { value: "denim", label: "دنيم (Denim)" },
  { value: "wool", label: "صوف (Wool)" },
  { value: "polyester", label: "بوليستر (Polyester)" },
  { value: "linen", label: "كتان (Linen)" },
];

export const clothingColorOptions: SelectOption[] = [
  { value: "neutral", label: "محايد (Neutral)" },
  { value: "dark", label: "داكن (Dark)" },
  { value: "light", label: "فاتح (Light)" },
  { value: "earth-tone", label: "ترابي (Earth tone)" },
  { value: "pastel", label: "باستيل (Pastel)" },
];

export const hairStyleOptions: SelectOption[] = [
  { value: "natural", label: "طبيعي (Natural)" },
  { value: "combed", label: "ممشط (Combed)" },
  { value: "messy-light", label: "فوضوي خفيف (Light messy)" },
  { value: "combed-back", label: "ممشط للخلف (Combed back)" },
  { value: "side-part", label: "مفرق جانبي (Side part)" },
];

export const hairLengthOptions: SelectOption[] = [
  { value: "short", label: "قصير (Short)" },
  { value: "medium", label: "متوسط (Medium)" },
  { value: "long", label: "طويل (Long)" },
];

export const hairTextureOptions: SelectOption[] = [
  { value: "straight", label: "أملس (Straight)" },
  { value: "wavy", label: "مموج (Wavy)" },
  { value: "curly", label: "مجعد (Curly)" },
];

export const poseTypeOptions: SelectOption[] = [
  { value: "standing", label: "وقوف (Standing)" },
  { value: "sitting-bed", label: "جلوس على السرير (Sitting on bed)" },
  { value: "sitting-chair", label: "جلوس على كرسي (Sitting on chair)" },
  { value: "lying-bed", label: "استلقاء على السرير (Lying on bed)" },
  { value: "standing-window", label: "وقوف قرب النافذة (Standing by window)" },
];

export const headDirectionOptions: SelectOption[] = [
  { value: "forward", label: "للأمام (Forward)" },
  { value: "slightly-left", label: "يساراً قليلاً (Slightly left)" },
  { value: "slightly-right", label: "يميناً قليلاً (Slightly right)" },
  { value: "down", label: "للأسفل (Down)" },
  { value: "up-soft", label: "لأعلى برفق (Gently up)" },
];

export const shoulderPositionOptions: SelectOption[] = [
  { value: "relaxed", label: "مسترخيان (Relaxed)" },
  { value: "one-raised", label: "كتف مرتفع قليلاً (One raised)" },
  { value: "both-back", label: "للخلف (Both back)" },
];

export const backPostureOptions: SelectOption[] = [
  { value: "straight", label: "مستقيم (Straight)" },
  { value: "relaxed", label: "مسترخٍ (Relaxed)" },
  { value: "slightly-leaning", label: "مائل قليلاً (Slightly leaning)" },
];

export const faceExpressionOptions: SelectOption[] = [
  { value: "neutral", label: "محايد طبيعي (Neutral)" },
  { value: "soft-smile", label: "ابتسامة خفيفة (Soft smile)" },
  { value: "closed-smile", label: "ابتسامة مغلقة (Closed smile)" },
  { value: "calm-focus", label: "تركيز هادئ (Calm focus)" },
  { value: "side-glance", label: "نظرة جانبية (Side glance)" },
  { value: "thinking", label: "تفكير (Thinking)" },
  { value: "sleepy", label: "نعاس خفيف (Sleepy)" },
  { value: "light-laugh", label: "ضحكة خفيفة (Light laugh)" },
];

export const eyeDirectionOptions: SelectOption[] = [
  { value: "camera", label: "نحو الكاميرا (Camera)" },
  { value: "mirror", label: "نحو المرآة (Mirror)" },
  { value: "away-soft", label: "بعيداً بلطف (Away)" },
  { value: "down-soft", label: "للأسفل بلطف (Down)" },
];

export const mouthStateOptions: SelectOption[] = [
  { value: "closed", label: "مغلق (Closed)" },
  { value: "slightly-open", label: "مفتوح قليلاً (Slightly open)" },
  { value: "smile-closed", label: "ابتسامة مغلقة (Smile closed)" },
  {
    value: "smile-open-light",
    label: "ابتسامة مفتوحة خفيفة (Light open smile)",
  },
];

export const freeHandPositionOptions: SelectOption[] = [
  { value: "at-side", label: "بجانب الجسم (At side)" },
  { value: "on-hair", label: "على الشعر (On hair)" },
  { value: "holding-cup", label: "تحمل كوباً (Holding cup)" },
  { value: "holding-phone", label: "تحمل الهاتف (Holding phone)" },
  { value: "touching-chin", label: "تلمس الذقن (Touching chin)" },
  { value: "in-pocket", label: "في الجيب (In pocket)" },
  { value: "on-bed", label: "على السرير (On bed)" },
  { value: "on-chest", label: "على الصدر (On chest)" },
  { value: "on-keyboard", label: "على لوحة المفاتيح (On keyboard)" },
  { value: "holding-cloth", label: "تحمل قطعة قماش (Holding cloth)" },
];

export const phonePositionOptions: SelectOption[] = [
  { value: "front-of-face", label: "أمام الوجه (Front of face)" },
  { value: "chest-level", label: "على مستوى الصدر (Chest level)" },
  { value: "above-chest", label: "فوق الصدر (Above chest)" },
  { value: "side-soft", label: "جانبي بلطف (Slightly to the side)" },
];

export const handFingersStateOptions: SelectOption[] = [
  { value: "relaxed", label: "مسترخية (Relaxed)" },
  { value: "slightly-curled", label: "ملتفة قليلاً (Slightly curled)" },
  { value: "gripping-soft", label: "قابضة برفق (Soft grip)" },
];

export const handVisibilityOptions: SelectOption[] = [
  { value: "fully-visible", label: "ظاهرة بالكامل (Fully visible)" },
  { value: "partially-visible", label: "ظاهرة جزئياً (Partially visible)" },
  { value: "off-frame", label: "خارج الإطار (Off-frame)" },
];
