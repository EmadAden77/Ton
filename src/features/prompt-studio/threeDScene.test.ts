import { describe, expect, it } from "vitest";

import { createDefaultSceneState } from "./state";
import {
  getThreeDLighting,
  getThreeDPose,
  getThreeDPoseForState,
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
  "standing-window",
  "standing-wardrobe",
  "leaning-dresser",
  "sitting-chair",
  "sitting-bed",
  "sitting-bed-edge",
  "sitting-bed-cross-legged",
  "reclining-headboard",
  "lying-bed",
];

const lightingModes: SceneState["lightingMode"][] = [
  "as-in-photo",
  "phone-screen",
  "bedside-lamp-only",
  "ceiling-only",
  "blue-hour-closed",
  "daylight-closed",
  "daylight-open",
  "overcast-open",
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

  it("gives every pose a distinct scene anchor", () => {
    const anchors = THREE_D_POSES.map((pose) =>
      [...pose.modelPosition, ...pose.modelRotation].join(":"),
    );
    expect(new Set(anchors).size).toBe(THREE_D_POSES.length);
  });

  it("derives the default 3D pose from SceneState", () => {
    expect(getThreeDPose(createDefaultSceneState().poseType).id).toBe(
      "standing",
    );
  });

  it("applies micro-pose torso, pelvis and weight transforms to the rendered pose", () => {
    const base = getThreeDPoseForState(createDefaultSceneState());
    const adjusted = getThreeDPoseForState({
      ...createDefaultSceneState(),
      torsoLean: "slight-forward",
      pelvisOrientation: "slightly-left",
      weightDistribution: "right-biased",
    });

    expect(adjusted.modelPosition[0]).toBeGreaterThan(base.modelPosition[0]);
    expect(adjusted.modelRotation[0]).toBeGreaterThan(base.modelRotation[0]);
    expect(adjusted.modelRotation[1]).toBeGreaterThan(base.modelRotation[1]);
    expect(adjusted.selfieTarget[0]).toBeGreaterThan(base.selfieTarget[0]);
  });

  it("lets domain constraints set the lying phone and micro-pose support", () => {
    const selected = selectThreeDPose(createDefaultSceneState(), "lying-bed");
    expect(selected.poseType).toBe("lying-bed");
    expect(selected.phonePosition).toBe("above-chest");
    expect(selected.torsoLean).toBe("neutral");
    expect(selected.pelvisOrientation).toBe("square");
    expect(selected.weightDistribution).toBe("supported");
  });

  it("does not mutate the source state when selecting a pose", () => {
    const source = createDefaultSceneState();
    selectThreeDPose(source, "lying-bed");
    expect(source.poseType).toBe("standing");
    expect(source.phonePosition).toBe("front-of-face");
    expect(source.weightDistribution).toBe("balanced");
  });

  it("keeps the selfie capture camera distinct from the room viewer camera", () => {
    const state = createDefaultSceneState();
    const pose = getThreeDPoseForState(state);
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

  it("orders close, arm-length, and extended by physical capture distance", () => {
    const base = createDefaultSceneState();
    const close = getThreeDSelfieCamera({ ...base, cameraDistance: "close" });
    const armLength = getThreeDSelfieCamera(base);
    const extended = getThreeDSelfieCamera({
      ...base,
      cameraDistance: "extended",
    });

    const closeDistance = distance(close.position, close.target);
    const armDistance = distance(armLength.position, armLength.target);
    const extendedDistance = distance(extended.position, extended.target);

    expect(closeDistance).toBeLessThan(armDistance);
    expect(armDistance).toBeLessThan(extendedDistance);
    expect(extended.fov).toBe(armLength.fov);
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

  it("derives usable selfie cameras for every expanded pose", () => {
    const base = createDefaultSceneState();

    for (const poseType of poseTypes) {
      const state = selectThreeDPose(base, poseType);
      const camera = getThreeDSelfieCamera(state);
      expect(Number.isFinite(distance(camera.position, camera.target))).toBe(
        true,
      );
      expect(distance(camera.position, camera.target)).toBeGreaterThan(0.1);
    }
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

  it("uses the bedside lamp as the only practical source in lamp-only mode", () => {
    const lighting = getThreeDLighting("bedside-lamp-only");
    expect(lighting.lampIntensity).toBeGreaterThan(0);
    expect(lighting.ceilingIntensity).toBe(0);
    expect(lighting.daylightIntensity).toBe(0);
  });

  it("uses ceiling spots without bedside or daylight contribution in ceiling-only mode", () => {
    const lighting = getThreeDLighting("ceiling-only");
    expect(lighting.ceilingIntensity).toBeGreaterThan(0);
    expect(lighting.lampIntensity).toBe(0);
    expect(lighting.daylightIntensity).toBe(0);
  });

  it("keeps blue hour dimmer than open daylight", () => {
    expect(
      getThreeDLighting("blue-hour-closed").daylightIntensity,
    ).toBeLessThan(getThreeDLighting("daylight-open").daylightIntensity);
  });

  it("turns practical lights off for daylight-driven modes", () => {
    for (const mode of [
      "blue-hour-closed",
      "daylight-closed",
      "daylight-open",
      "overcast-open",
    ] as const) {
      const lighting = getThreeDLighting(mode);
      expect(lighting.ceilingIntensity).toBe(0);
      expect(lighting.lampIntensity).toBe(0);
      expect(lighting.daylightIntensity).toBeGreaterThan(0);
    }
  });

  it("opens curtains only for the open-curtain daylight modes", () => {
    expect(getThreeDLighting("daylight-open").curtainsOpen).toBe(true);
    expect(getThreeDLighting("overcast-open").curtainsOpen).toBe(true);
    expect(getThreeDLighting("daylight-closed").curtainsOpen).toBe(false);
    expect(getThreeDLighting("blue-hour-closed").curtainsOpen).toBe(false);
  });

  it("writes the selected lighting mode directly to SceneState", () => {
    const selected = selectThreeDLighting(
      createDefaultSceneState(),
      "overcast-open",
    );
    expect(selected.lightingMode).toBe("overcast-open");
  });
});
