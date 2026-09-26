export interface SceneState {
  shotType: "front-selfie" | "mirror-selfie";
  lightingSource: "window-day" | "window-sunset" | "ceiling" | "bedside-lamp";
  lightingIntensity: "dim" | "soft" | "medium" | "bright";
  roomType: "simple" | "modern" | "small" | "medium";
  cameraDistance:
    // قريبة من الوجه.
    | "close"
    // عند طول الذراع.
    | "arm-length"
    // عند امتداد الذراع.
    | "extended";
  cameraAngle:
    // بمستوى العين.
    | "eye-level"
    // أعلى من مستوى العين قليلاً.
    | "slightly-above"
    // أسفل من مستوى العين قليلاً.
    | "slightly-below";
  lightingDirection:
    // من الأمام.
    | "front"
    // من الجانب.
    | "side"
    // من الأعلى.
    | "top"
    // من الخلف بضوء ناعم.
    | "back-soft";
  colorTemperature:
    // لون دافئ.
    | "warm"
    // لون محايد.
    | "neutral"
    // لون بارد.
    | "cool";
  roomCleanliness:
    // مرتبة جداً.
    | "very-tidy"
    // ترتيب طبيعي.
    | "natural"
    // فوضى خفيفة.
    | "light-mess"
    // فوضى متوسطة.
    | "moderate-mess";
  roomWindow:
    // بلا نافذة.
    | "none"
    // نافذة صغيرة.
    | "small"
    // نافذة متوسطة.
    | "medium"
    // نافذة كبيرة.
    | "large";
  // وجود سرير في الغرفة: نعم أو لا.
  roomHasBed: boolean;
  clothingTop:
    // تي شيرت.
    | "t-shirt"
    // قميص بأزرار.
    | "shirt"
    // كنزة بغطاء رأس.
    | "hoodie"
    // بلوزة نوم.
    | "pajama-top"
    // كنزة.
    | "sweater"
    // قميص بلا أكمام.
    | "tank-top";
  clothingBottom:
    // بنطال جينز.
    | "jeans"
    // شورت.
    | "shorts"
    // بنطال نوم.
    | "pajama-pants"
    // بنطال رياضي.
    | "sweatpants"
    // القطعة السفلية غير ظاهرة.
    | "none-visible";
  clothingMaterial:
    // قطن.
    | "cotton"
    // دنيم.
    | "denim"
    // صوف.
    | "wool"
    // بوليستر.
    | "polyester"
    // كتان.
    | "linen";
  clothingColor:
    // لون محايد.
    | "neutral"
    // لون داكن.
    | "dark"
    // لون فاتح.
    | "light"
    // لون ترابي.
    | "earth-tone"
    // لون باستيل.
    | "pastel";
  // هل لدى المستخدم صورة مرجعية؛ لا ترفع الصورة في هذه المرحلة.
  referenceProvided: boolean;
  identityPriority:
    // الحفاظ على الهوية بأولوية قصوى.
    | "strict"
    // توازن الهوية مع مرونة المشهد.
    | "balanced"
    // مرونة أكبر مع احتمال ضعف حفظ الهوية.
    | "flexible";
  // ملاحظات اختيارية عن الملامح المراد الحفاظ عليها.
  identityNotes: string;
}
