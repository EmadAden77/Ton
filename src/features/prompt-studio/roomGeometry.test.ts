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
  it("locks the redesigned room, bed, storage, furniture, finishes and circulation", () => {
    const room = englishFixedRoomDescription(createDefaultSceneState());

    expect(room).toContain("5.2 m LEFT-to-RIGHT by 6.2 m FRONT-to-BACK");
    expect(room).toContain("2.9 m ceiling");
    expect(room).toContain("exactly one 90 cm hinged dark-wood door");
    expect(room).toContain("180 x 200 cm mattress");
    expect(room).toContain("dark tufted-headboard bed on the left");
    expect(room).toContain(
      "dark-charcoal channel-tufted upholstered headboard",
    );
    expect(room).toContain("broad horizontal padded channels");
    expect(room).toContain("exactly one compact dark-walnut nightstand");
    expect(room).toContain(
      "exactly one white wall-mounted split-AC indoor unit",
    );
    expect(room).toContain("one long dark-walnut built-in storage run");
    expect(room).toContain("clear reflective mirror panels");
    expect(room).toContain("one open hanging bay");
    expect(room).toContain("one separate dark-walnut chest of drawers");
    expect(room).toContain("exactly one compact upholstered chair");
    expect(room).toContain("approximately 2.45 m of real clear width");
    expect(room).toContain("glossy light-beige porcelain tiles");
    expect(room).toContain(
      "one broad beige-to-greige low-pile rectangular rug",
    );
    expect(room).toContain("Twelve small circular recessed downlights");
    expect(room).toContain("three naturally scattered footwear pairs");
    expect(room).not.toContain("full-height sliding MIRRORED wardrobe");
    expect(room).not.toContain("grey tile");
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
        expect(room).toContain("no center-seam slit");
        expect(room).toContain("no bottom gap");

        if (
          lightingMode === "daylight-closed" ||
          lightingMode === "blue-hour-closed"
        ) {
          expect(room).toContain("fully covered by heavyweight");
        } else {
          expect(room).toContain("fully hidden behind heavyweight");
        }
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
    expect(closedGuards).not.toContain(
      "no contradictory closed-curtain pattern",
    );
    expect(openGuards).toContain("no contradictory closed-curtain pattern");
    expect(openGuards).toContain("no extra exterior opening");
    expect(openGuards).not.toContain("no center-seam daylight slit");
  });

  it("emits the same engineered room contract in Arabic", () => {
    const room = arabicFixedRoomDescription(createDefaultSceneState());

    expect(room).toContain("بعرض 5.2 م");
    expect(room).toContain("عمق 6.2 م");
    expect(room).toContain("مرتبة منخفضة 180 × 200 سم");
    expect(room).toContain("channel-tufted");
    expect(room).toContain("كومود واحد فقط");
    expect(room).toContain("وحدة split بيضاء واحدة فقط");
    expect(room).toContain("منظومة built-in واحدة طويلة");
    expect(room).toContain("ألواح مرايا عاكسة حقيقية");
    expect(room).toContain("قسم تعليق مفتوح واحد");
    expect(room).toContain("chest of drawers منفصلة");
    expect(room).toContain("كرسي منجد مدمج واحد فقط");
    expect(room).toContain("بلاط porcelain كبير ولامع بلون بيج فاتح");
    expect(room).toContain("اثنتا عشرة وحدة downlight");
    expect(room).not.toContain("خزانة منزلقة واحدة فقط بارتفاع كامل");
  });

  it("adds hard guards for the redesigned room's structural failure modes", () => {
    const state = createDefaultSceneState();
    const guards = roomNegativeGuards(state).join(", ");
    const negative = buildNegativePrompt(state);

    expect(guards).toContain("no bench-like bed");
    expect(guards).toContain("no daybed");
    expect(guards).toContain("no duplicated AC units");
    expect(guards).toContain("no stacked air conditioners");
    expect(guards).toContain("no featureless all-mirror wardrobe");
    expect(guards).toContain("no black-glass wardrobe");
    expect(guards).toContain("no transparent wardrobe");
    expect(guards).toContain("no fully open wardrobe");
    expect(guards).toContain("no duplicated chair");
    expect(guards).toContain("no narrow runner rug");
    expect(guards).toContain("no narrow corridor room");
    expect(guards).toContain("no fisheye room expansion");
    expect(guards).toContain("no center-seam daylight slit");
    expect(negative).toContain("no bench-like bed");
    expect(negative).toContain("no featureless all-mirror wardrobe");
    expect(negative).toContain("no fisheye room expansion");
  });

  it("uses the engineered room lock end-to-end in both generated prompts", () => {
    const state = createDefaultSceneState();
    const english = buildPromptEnglish(state);
    const arabic = buildPromptArabic(state);

    expect(english).toContain("ROOM GEOMETRY LOCK");
    expect(english).toContain("180 x 200 cm mattress");
    expect(english).toContain("one open hanging bay");
    expect(english).toContain("Twelve small circular recessed downlights");
    expect(english).toContain("approximately 2.45 m of real clear width");
    expect(english).not.toContain("glass-door wardrobe");

    expect(arabic).toContain("قفل هندسة الغرفة");
    expect(arabic).toContain("180 × 200 سم");
    expect(arabic).toContain("قسم تعليق مفتوح واحد");
    expect(arabic).toContain("اثنتا عشرة وحدة downlight");
    expect(arabic).not.toContain("خزانة بأبواب زجاجية");
  });
});
