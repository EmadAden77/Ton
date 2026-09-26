export interface SceneState {
  shotType: "front-selfie" | "mirror-selfie";
  lightingMode:
    // كما في الصورة: سقف خافت + مصباح سرير دافئ.
    | "as-in-photo"
    // ضوء شاشة الهاتف: الغرفة معتمة، الوجه مضاء بالشاشة.
    | "phone-screen"
    // ضوء نهار — ستائر مغلقة: منتشر، خفيف.
    | "daylight-closed"
    // ضوء نهار — ستائر مفتوحة: ساطع، نافذة خلفية.
    | "daylight-open";
  cameraDistance: "close" | "arm-length" | "extended";
  cameraAngle: "eye-level" | "slightly-above" | "slightly-below";
  phonePosition:
    // أمام الوجه (سيلفي أمامي).
    | "front-of-face"
    // على مستوى الصدر (سيلفي أمام المرآة).
    | "chest-level"
    // فوق الصدر (استلقاء).
    | "above-chest"
    // جانبي بلطف.
    | "side-soft";
  clothingTop:
    "t-shirt" | "shirt" | "hoodie" | "pajama-top" | "sweater" | "tank-top";
  clothingBottom:
    "jeans" | "shorts" | "pajama-pants" | "sweatpants" | "none-visible";
  clothingMaterial: "cotton" | "denim" | "wool" | "polyester" | "linen";
  clothingColor: "neutral" | "dark" | "light" | "earth-tone" | "pastel";
  referenceProvided: boolean;
  identityPriority: "strict" | "balanced" | "flexible";
  identityNotes: string;
  hairStyle: "natural" | "combed" | "messy-light" | "combed-back" | "side-part";
  hairLength: "short" | "medium" | "long";
  hairTexture: "straight" | "wavy" | "curly";
  poseType:
    | "standing"
    | "sitting-bed"
    | "sitting-chair"
    | "lying-bed"
    | "standing-window";
  headDirection:
    "forward" | "slightly-left" | "slightly-right" | "down" | "up-soft";
  shoulderPosition: "relaxed" | "one-raised" | "both-back";
  handPlacement:
    "at-side" | "holding-phone" | "touching-hair" | "on-lap" | "in-pocket";
  backPosture: "straight" | "relaxed" | "slightly-leaning";
  faceExpression:
    | "neutral"
    | "soft-smile"
    | "closed-smile"
    | "calm-focus"
    | "side-glance"
    | "thinking"
    | "sleepy"
    | "light-laugh";
  eyeDirection: "camera" | "mirror" | "away-soft" | "down-soft";
  mouthState: "closed" | "slightly-open" | "smile-closed" | "smile-open-light";
  freeHandPosition:
    | "at-side"
    | "on-hair"
    | "holding-cup"
    | "touching-chin"
    | "in-pocket"
    | "on-bed"
    | "on-chest"
    | "on-keyboard"
    | "holding-cloth"
    | "holding-phone";
  handFingersState: "relaxed" | "slightly-curled" | "gripping-soft";
  handVisibility: "fully-visible" | "partially-visible" | "off-frame";
  scenario?:
    | "none"
    | "working-laptop"
    | "bed-laptop"
    | "mirror-selfie"
    | "getting-ready"
    | "lying-with-phone"
    | "standing-window"
    | "choosing-clothes"
    | "adjusting-clothing";
}
