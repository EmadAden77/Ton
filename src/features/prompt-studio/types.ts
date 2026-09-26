export interface SceneState {
  shotType: "front-selfie" | "mirror-selfie";
  lightingSource: "window-day" | "window-sunset" | "ceiling" | "bedside-lamp";
  lightingIntensity: "dim" | "soft" | "medium" | "bright";
  roomType: "simple" | "modern" | "small" | "medium";
}
