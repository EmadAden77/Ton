import { describe, expect, it } from "vitest";

import { createDefaultSceneState } from "./state";
import {
  getThreeDLighting,
  getThreeDPose,
  getThreeDSelfieCamera,
  selectThreeDLighting,
  selectThreeDPose,
  THREE_D_LIGHTING,
  THREE_D_POSES,
  type Vec3,
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

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

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

  it("keeps the selfie capture camera distinct from the room viewer camera", () => {
    const state = createDefaultSceneState();
    const pose = getThreeDPose(state.poseType);
    const camera = getThreeDSelfieCamera(state);

    expect(camera.position).not.toEqual(pose.viewerPosition);
    expect(camera.target).toEqual(pose.selfieTarget);
  });

  it("moves a close selfie camera nearer to the face without changing preview FOV", () => {
    const armLength = createDefaultSceneState();
    const close = { ...armLength, cameraDistance: "close" } as SceneState;

    const armCamera = getThreeDSelfieCamera(armLength);
    const closeCamera = getThreeDSelfieCamera(close);

    expect(distance(closeCamera.position, closeCamera.target)).toBeLessThan(
      distance(armCamera.position, armCamera.target),
    );
    expect(closeCamera.fov).toBe(armCamera.fov);
  });

  it("raises and lowers the capture camera from the same eye target", () => {
    const state = createDefaultSceneState();
    const above = getThreeDSelfieCamera({
      ...state,
      cameraAngle: "slightly-above",
    });
    const eyeLevel = getThreeDSelfieCamera(state);
    const below = getThreeDSelfieCamera({
      ...state,
      cameraAngle: "slightly-below",
    });

    expect(above.target).toEqual(eyeLevel.target);
    expect(below.target).toEqual(eyeLevel.target);
    expect(above.position[1]).toBeGreaterThan(eyeLevel.position[1]);
    expect(below.position[1]).toBeLessThan(eyeLevel.position[1]);
  });

  it("offsets side-soft laterally while preserving the capture target", () => {
    const state = createDefaultSceneState();
    const centered = getThreeDSelfieCamera(state);
    const side = getThreeDSelfieCamera({
      ...state,
      phonePosition: "side-soft",
    });

    expect(side.target).toEqual(centered.target);
    expect(side.position).not.toEqual(centered.position);
  });

  it("uses the constrained above-chest rig for lying selfies", () => {
    const lying = selectThreeDPose(createDefaultSceneState(), "lying-bed");
    const camera = getThreeDSelfieCamera(lying);

    expect(lying.phonePosition).toBe("above-chest");
    expect(camera.position[1]).toBeGreaterThan(camera.target[1]);
  });

  it("does not mutate SceneState while deriving the selfie camera", () => {
    const state = createDefaultSceneState();
    getThreeDSelfieCamera(state);
    expect(state).toEqual(createDefaultSceneState());
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
