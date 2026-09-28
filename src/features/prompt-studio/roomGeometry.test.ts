import { describe, expect, it } from "vitest";

import {
  buildNegativePrompt,
  buildPromptArabic,
  buildPromptEnglish,
} from "./promptBuilder";
import {
  arabicFixedRoomDescription,
  curtainsAreOpen,
  englishFixedRoomDescription,
  roomNegativeGuards,
} from "./roomGeometry";
import { createDefaultSceneState } from "./state";
import type { SceneState } from "./types";

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

describe("engineered fixed bedroom geometry", () => {
  it("locks the spacious room, corrected bed, storage and circulation", () => {
    const room = englishFixedRoomDescription(createDefaultSceneState());

    expect(room).toContain("6.4 m LEFT-to-RIGHT by 7.2 m FRONT-to-BACK");
    expect(room).toContain("3.0 m ceiling");
    expect(room).toContain("genuinely spacious room");
    expect(room).toContain("broad open floor field");
    expect(room).toContain("exactly one 90 cm hinged dark-wood door");
    expect(room).toContain("mattress is exactly 180 x 200 cm and 26 cm thick");
    expect(room).toContain("platform frame about 192 x 212 cm and 28 cm high");
    expect(room).toContain("mattress top is about 54 cm above the floor");
    expect(room).toContain("foot edge is a straight readable edge");
    expect(room).toContain("only 10 cm thick");
    expect(room).toContain(
      "three or four shallow horizontal stitched channels",
    );
    expect(room).toContain("exactly two normal sleeping pillows");
    expect(room).toContain("approximately 3.57 m of true clear width");
    expect(room).toContain("wide aisle is a primary scale anchor");
    expect(room).toContain("glossy light-beige porcelain tiles");
    expect(room).toContain("Twelve small circular recessed downlights");
    expect(room).not.toContain("broad horizontal padded channels");
  });

  it("adds a bed-selfie composition lock for bed poses", () => {
    const room = englishFixedRoomDescription({
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged",
    });

    expect(room).toContain("BED-SELFIE COMPOSITION");
    expect(room).toContain("pelvis near the true center of the mattress");
    expect(room).toContain(
      "Do not let the mattress become a giant foreground plane",
    );
    expect(room).toContain("substantial exposed floor");
  });

  it("keeps one rear opening and switches only the curtain state required by lighting", () => {
    for (const lightingMode of lightingModes) {
      const state = { ...createDefaultSceneState(), lightingMode };
      const room = englishFixedRoomDescription(state);

      if (
        lightingMode === "daylight-open" ||
        lightingMode === "overcast-open"
      ) {
        expect(curtainsAreOpen(state)).toBe(true);
        expect(room).toContain("intentionally pulled to both sides");
        expect(room).toContain("single wide rear window");
        expect(room).toContain("do not invent a second window");
      } else {
        expect(curtainsAreOpen(state)).toBe(false);
        expect(room).toContain("black-to-charcoal blackout curtains");
        expect(room).toContain("center-seam slit");
        expect(room).toContain("bottom gap");
      }
    }
  });

  it("switches negative curtain guards with the selected lighting mode", () => {
    const closedGuards = roomNegativeGuards(createDefaultSceneState()).join(
      ", ",
    );
    const openGuards = roomNegativeGuards({
      ...createDefaultSceneState(),
      lightingMode: "daylight-open",
    }).join(", ");

    expect(closedGuards).toContain("no center-seam daylight slit");
    expect(closedGuards).toContain("no under-curtain light gap");
    expect(openGuards).toContain("no contradictory closed-curtain pattern");
    expect(openGuards).toContain("no extra exterior opening");
  });

  it("emits the same corrected room and bed contract in Arabic", () => {
    const room = arabicFixedRoomDescription({
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged",
    });

    expect(room).toContain("بعرض 6.4 م");
    expect(room).toContain("عمق 7.2 م");
    expect(room).toContain("المرتبة بالضبط 180 × 200 سم وسماكتها 26 سم");
    expect(room).toContain("192 × 212 سم وارتفاعها 28 سم");
    expect(room).toContain("54 سم فوق الأرض");
    expect(room).toContain("سماكة 10 سم فقط");
    expect(room).toContain("ثلاث أو أربع خياطات أفقية ضحلة");
    expect(room).toContain("يقارب 3.57 م");
    expect(room).toContain("تكوين سيلفي السرير");
  });

  it("adds hard guards for giant-bed and narrow-room failure modes", () => {
    const state = {
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged" as const,
    };
    const guards = roomNegativeGuards(state).join(", ");
    const negative = buildNegativePrompt(state);

    expect(guards).toContain("no wall-to-wall bed");
    expect(guards).toContain("no perspective-stretched mattress");
    expect(guards).toContain("no giant foreground mattress plane");
    expect(guards).toContain("no thick stacked-cushion headboard");
    expect(guards).toContain("no collapsed central aisle");
    expect(guards).toContain(
      "no bed filling most of the lower frame solely from perspective",
    );
    expect(negative).toContain("no giant foreground mattress plane");
    expect(negative).toContain("no collapsed central aisle");
  });

  it("uses the corrected room lock end-to-end in both generated prompts", () => {
    const state = {
      ...createDefaultSceneState(),
      poseType: "sitting-bed-cross-legged" as const,
      cameraDistance: "close" as const,
    };
    const english = buildPromptEnglish(state);
    const arabic = buildPromptArabic(state);

    expect(english).toContain("ROOM GEOMETRY LOCK");
    expect(english).toContain("6.4 m LEFT-to-RIGHT by 7.2 m FRONT-to-BACK");
    expect(english).toContain("BED-SELFIE COMPOSITION");
    expect(english).toContain("45-55 cm");
    expect(english).toContain("24 mm-equivalent perspective");

    expect(arabic).toContain("قفل هندسة الغرفة");
    expect(arabic).toContain("6.4 م");
    expect(arabic).toContain("تكوين سيلفي السرير");
    expect(arabic).toContain("45–55 سم");
  });
});
