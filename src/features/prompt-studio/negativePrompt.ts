import type { SceneState } from "./types";

export function buildNegativePrompt(state: SceneState): string {
  const constraints = [
    "no AI-looking artifacts",
    "no watermark",
    "no text artifacts",
    "no distorted face; no waxy skin; no plastic skin",
    "no unrealistic lighting; no excessive HDR",
    "no cinematic grading; no portrait-mode bokeh",
    "no studio lighting; no ring light; no softbox",
    "no warped furniture",
  ];

  if (state.referenceProvided) {
    constraints.unshift("no identity change", "no face alteration");
  }

  if (state.handVisibility === "fully-visible") {
    constraints.push("no extra fingers; no malformed hands; no fused fingers");
  } else if (state.handVisibility === "partially-visible") {
    constraints.push("no malformed visible fingers");
  }

  if (state.shotType === "front-selfie") {
    constraints.push(
      "no visible selfie phone body; no third-person camera viewpoint; no floating camera; no detached selfie arm",
    );
  } else {
    constraints.push(
      "no incorrect reflections; no mirrored text; no duplicated phone; no duplicated arms",
    );
  }

  if (state.poseType === "lying-bed") {
    constraints.push("no elongated arms", "no distorted shoulders");
  }

  if (state.scenario === "adjusting-clothing") {
    constraints.push(
      "no nudity; no partially undressed subject; no suggestive pose; no exposed skin beyond face and hands",
    );
  }

  return constraints.join(", ");
}
