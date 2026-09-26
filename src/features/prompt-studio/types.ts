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
  hairStyle:
    // تصفيف طبيعي.
    | "natural"
    // شعر ممشط.
    | "combed"
    // فوضى خفيفة.
    | "messy-light"
    // فرق جانبي.
    | "side-part"
    // ممشط إلى الخلف.
    | "slicked-back";
  hairLength:
    // شعر قصير.
    | "short"
    // شعر متوسط الطول.
    | "medium"
    // شعر طويل.
    | "long";
  hairTexture:
    // شعر أملس.
    | "straight"
    // شعر مموج.
    | "wavy"
    // شعر مجعد.
    | "curly";
  poseType:
    // وقوف.
    | "standing"
    // جلوس على السرير.
    | "sitting-bed"
    // جلوس على كرسي.
    | "sitting-chair"
    // استلقاء على السرير.
    | "lying-bed"
    // وقوف قرب النافذة.
    | "standing-window";
  headDirection:
    // الرأس للأمام.
    | "forward"
    // الرأس مائل قليلاً لليسار.
    | "slightly-left"
    // الرأس مائل قليلاً لليمين.
    | "slightly-right"
    // الرأس لأسفل.
    | "down"
    // الرأس لأعلى برفق.
    | "up-soft";
  shoulderPosition:
    // الكتفان مسترخيان.
    | "relaxed"
    // كتف واحد مرتفع قليلاً.
    | "one-raised"
    // الكتفان للخلف.
    | "both-back";
  handPlacement:
    // اليد الحرة بجانب الجسم.
    | "at-side"
    // اليد الحرة تساند الهاتف.
    | "holding-phone"
    // اليد الحرة تلامس الشعر.
    | "touching-hair"
    // اليد الحرة على الحضن.
    | "on-lap"
    // اليد الحرة في الجيب.
    | "in-pocket";
  backPosture:
    // ظهر مستقيم.
    | "straight"
    // ظهر مسترخٍ.
    | "relaxed"
    // ظهر مائل قليلاً.
    | "slightly-leaning";
  faceExpression:
    // تعبير محايد.
    | "neutral"
    // ابتسامة خفيفة.
    | "soft-smile"
    // ابتسامة بفم مغلق.
    | "closed-smile"
    // تركيز هادئ.
    | "calm-focus"
    // نظرة جانبية.
    | "side-glance"
    // تعبير تفكير.
    | "thinking"
    // نعاس خفيف.
    | "sleepy"
    // ضحكة خفيفة.
    | "light-laugh";
  eyeDirection:
    // النظر إلى الكاميرا.
    | "camera"
    // النظر إلى المرآة.
    | "mirror"
    // النظر بعيداً بلطف.
    | "away-soft"
    // النظر إلى الأسفل بلطف.
    | "down-soft";
  mouthState:
    // فم مغلق.
    | "closed"
    // فم مفتوح قليلاً.
    | "slightly-open"
    // ابتسامة بفم مغلق.
    | "smile-closed"
    // ابتسامة مفتوحة خفيفة.
    | "smile-open-light";
  freeHandPosition:
    // بجانب الجسم.
    | "at-side"
    // على الشعر.
    | "on-hair"
    // تحمل كوباً.
    | "holding-cup"
    // تلمس الذقن.
    | "touching-chin"
    // في الجيب.
    | "in-pocket"
    // على السرير.
    | "on-bed"
    // على لوحة المفاتيح.
    | "on-keyboard"
    // تحمل قطعة قماش.
    | "holding-cloth"
    // تحمل الهاتف.
    | "holding-phone";
  handFingersState:
    // أصابع مسترخية.
    | "relaxed"
    // أصابع ملتفة قليلاً.
    | "slightly-curled"
    // قبضة خفيفة.
    | "gripping-soft";
  handVisibility:
    // اليد ظاهرة بالكامل.
    | "fully-visible"
    // اليد ظاهرة جزئياً.
    | "partially-visible"
    // اليد خارج الإطار.
    | "off-frame";
  scenario?:
    // إعداد يدوي بلا سيناريو.
    | "none"
    // عمل على لابتوب عند المكتب.
    | "working-laptop"
    // جلوس على السرير مع لابتوب.
    | "bed-laptop"
    // سيلفي أمام المرآة.
    | "mirror-selfie"
    // استعداد للخروج.
    | "getting-ready"
    // استلقاء مع الهاتف.
    | "lying-with-phone"
    // وقوف قرب النافذة.
    | "standing-window"
    // اختيار الملابس من الخزانة.
    | "choosing-clothes"
    // ترتيب الملابس قبل الخروج.
    | "adjusting-clothing";
}
