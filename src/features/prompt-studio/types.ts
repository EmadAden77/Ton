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
}
