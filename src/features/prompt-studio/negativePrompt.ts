import { roomNegativeGuards } from "./roomGeometry";
import type { SceneState } from "./types";

export function buildNegativePrompt(state: SceneState): string {
  const constraints = [
    "no AI-looking artifacts",
    "no watermark",
    "no text artifacts",
    "no distorted face; no waxy skin; no plastic skin",
    "no impossible joint angles; no broken anatomy; no detached limbs; no floating limbs",
    "no unsupported body contact; no body-furniture interpenetration; no missing contact shadows",
    "no gravity-defying clothing folds; no rigid fabric; no clothing clipping through body or furniture",
    "no helmet-like hair; no floating hair strands; no artificial hair thickening",
    "no unrealistic lighting; no contradictory active light sources; no inconsistent shadow direction",
    "no unmotivated frontal fill; no fake rim light; no excessive HDR",
    "no cinematic grading; no portrait-mode bokeh",
    "no studio lighting; no ring light; no softbox",
    "no warped furniture",
    ...roomNegativeGuards(state),
  ];

  if (state.referenceProvided) {
    constraints.unshift(
      "no identity change",
      "no face alteration",
      "no hairline change; no temple-shape change; no hair-density increase",
    );
  }

  if (state.handVisibility === "fully-visible") {
    constraints.push(
      "no extra fingers; no malformed hands; no fused fingers; no impossible wrist twist",
    );
  } else if (state.handVisibility === "partially-visible") {
    constraints.push("no malformed visible fingers; no phantom wrist");
  } else {
    constraints.push(
      "no phantom off-frame hand entering without a connected forearm",
    );
  }

  if (
    state.freeHandPosition === "holding-cup" ||
    state.freeHandPosition === "holding-phone" ||
    state.freeHandPosition === "holding-cloth"
  ) {
    constraints.push(
      "no floating held object; no object fused into fingers; no missing thumb opposition",
    );
  }

  if (state.freeHandPosition === "on-keyboard") {
    constraints.push(
      "no hovering fingertips above keyboard; no wrist bending backward through the keyboard plane",
    );
  }

  if (state.shotType === "front-selfie") {
    constraints.push(
      "no visible selfie phone body; no third-person camera viewpoint; no floating camera; no detached selfie arm",
    );
  } else {
    constraints.push(
      "no incorrect reflections; no mirrored text; no duplicated phone; no duplicated arms; no reflection-camera mismatch",
    );
  }

  if (state.poseType === "lying-bed") {
    constraints.push(
      "no elongated arms",
      "no distorted shoulders",
      "no gap between supported body and mattress",
      "no hovering heels or hips above the mattress",
    );
  }

  if (state.poseType === "reclining-headboard") {
    constraints.push(
      "no gap between back and headboard support",
      "no unsupported backward lean",
    );
  }

  if (state.poseType === "leaning-dresser") {
    constraints.push(
      "no visible gap at the dresser support contact",
      "no body clipping into the dresser",
      "no floating feet during the lean",
    );
  }

  if (state.lightingMode === "phone-screen") {
    constraints.push(
      "no active ceiling lights; no bedside-lamp glow; no daylight fill; no room-wide blue screen wash",
    );
  } else if (state.lightingMode === "bedside-lamp-only") {
    constraints.push(
      "no active ceiling lights; no daylight fill; no hidden frontal fill",
    );
  } else if (state.lightingMode === "ceiling-only") {
    constraints.push(
      "no bedside-lamp glow; no daylight fill; no hidden frontal fill",
    );
  } else if (
    state.lightingMode === "daylight-open" ||
    state.lightingMode === "overcast-open"
  ) {
    constraints.push(
      "no indoor practical lights; no closed-curtain lighting pattern",
    );
  } else if (
    state.lightingMode === "daylight-closed" ||
    state.lightingMode === "blue-hour-closed"
  ) {
    constraints.push(
      "no open-curtain beam; no hard direct sun patch; no indoor practical lights",
    );
  }

  if (state.scenario === "adjusting-clothing") {
    constraints.push(
      "no nudity; no partially undressed subject; no suggestive pose; no exposed skin beyond face and hands",
    );
  }

  return constraints.join(", ");
}
