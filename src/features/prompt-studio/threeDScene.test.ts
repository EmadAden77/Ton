import { describe, expect, it } from "vitest";

import { createDefaultSceneState } from "./state";
import {
  getThreeDLighting,
  getThreeDPose,
  selectThreeDLighting,
  selectThreeDPose,
  THREE_D_LIGHTING,
  THREE_D_POSES,
} from "./threeDScene";
import type { SceneState } from "./types";

const poseTypes: SceneState["poseType"][] = [
  "standing",
  "sitting-bed",
  "sitting-chair",
  "lying-bed",
  "standing-window",
];

const lightingModes: SceneState["lightingMode"][] = [
  "as-in-photo",
  "phone-screen",
  "daylight-closed",
  "daylight-open",
];

describe("3D SceneState adapter", () => {
  it("covers every domain pose exactly once", () => {
    expect(THREE_D_POSES.map((pose) => pose.id)).toEqual(poseTypes);
  });

  it("covers every domain lighting mode", () => {
    expect(Object.keys(THREE_D_LIGHTING)).toEqual(lightingModes);
  });

  it("derives the default 3D pose from SceneState", () => {
    expect(getThreeDPose(createDefaultSceneState().poseType).id).toBe(
      "standing",
    );
  });

  it("lets domain constraints set the lying phone position", () => {
    const selected = selectThreeDPose(createDefaultSceneState(), "lying-bed");
    expect(selected.poseType).toBe("lying-bed");
    expect(selected.phonePosition).toBe("above-chest");
  });

  it("does not mutate the source state when selecting a pose", () => {
    const source = createDefaultSceneState();
    selectThreeDPose(source, "lying-bed");
    expect(source.poseType).toBe("standing");
    expect(source.phonePosition).toBe("front-of-face");
  });

  it("uses phone screen as the only active practical light in phone-screen mode", () => {
    const lighting = getThreeDLighting("phone-screen");
    expect(lighting.ceilingIntensity).toBe(0);
    expect(lighting.lampIntensity).toBe(0);
    expect(lighting.daylightIntensity).toBe(0);
    expect(lighting.phoneIntensity).toBeGreaterThan(0);
  });

  it("turns practical lights off for both daylight modes", () => {
    for (const mode of ["daylight-closed", "daylight-open"] as const) {
      const lighting = getThreeDLighting(mode);
      expect(lighting.ceilingIntensity).toBe(0);
      expect(lighting.lampIntensity).toBe(0);
      expect(lighting.daylightIntensity).toBeGreaterThan(0);
    }
  });

  it("opens curtains only for daylight-open", () => {
    expect(getThreeDLighting("daylight-open").curtainsOpen).toBe(true);
    expect(getThreeDLighting("daylight-closed").curtainsOpen).toBe(false);
  });

  it("writes the selected lighting mode directly to SceneState", () => {
    const selected = selectThreeDLighting(
      createDefaultSceneState(),
      "daylight-closed",
    );
    expect(selected.lightingMode).toBe("daylight-closed");
  });
});
