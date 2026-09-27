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

describe("strict fixed bedroom geometry", () => {
  it("locks the default room to one bed, one nightstand, one AC, mirrored wardrobe, dresser, rug, tile and recessed spots", () => {
    const state = createDefaultSceneState();
    const room = englishFixedRoomDescription(state);

    expect(room).toContain("Exactly one bed occupies the LEFT side");
    expect(room).toContain("Exactly one bedside table");
    expect(room).toContain("exactly one warm bedside lamp");
    expect(room).toContain(
      "Exactly one white wall-mounted split-AC indoor unit",
    );
    expect(room).toContain("UPPER-LEFT wall near the ceiling");
    expect(room).toContain("full-height sliding MIRRORED wardrobe");
    expect(room).toContain("all doors fully closed");
    expect(room).toContain("not transparent or smoked glass");
    expect(room).toContain("Exactly one separate dark-wood chest of drawers");
    expect(room).toContain("grey tile");
    expect(room).toContain("Exactly one beige rug");
    expect(room).toContain(
      "Recessed ceiling spotlights are the only ceiling fixtures",
    );
    expect(room).toContain("clear walking aisle between bed and wardrobe");
  });

  it("keeps closed curtains gap-free while allowing only explicit open-curtain lighting modes", () => {
    for (const lightingMode of lightingModes) {
      const state = { ...createDefaultSceneState(), lightingMode };
      const room = englishFixedRoomDescription(state);

      if (
        lightingMode === "daylight-open" ||
        lightingMode === "overcast-open"
      ) {
        expect(curtainsAreOpen(state)).toBe(true);
        expect(room).toContain(
          "selected daylight mode requires the dark blackout curtains to be open",
        );
      } else {
        expect(curtainsAreOpen(state)).toBe(false);
        expect(room).toContain(
          "fully covered by floor-length dark blackout curtains",
        );
        expect(room).toContain("no center-seam slit");
        expect(room).toContain("no bottom gap");
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

  it("emits the same room lock in Arabic without transparent wardrobe or duplicated AC semantics", () => {
    const room = arabicFixedRoomDescription(createDefaultSceneState());

    expect(room).toContain("سرير واحد فقط");
    expect(room).toContain("كومود واحد فقط");
    expect(room).toContain("مكيف سبليت جداري أبيض واحد فقط");
    expect(room).toContain("خزانة منزلقة واحدة فقط بارتفاع كامل وواجهات مرايا");
    expect(room).toContain("ليست زجاجاً شفافاً أو مدخناً");
    expect(room).toContain("سجادة بيج واحدة فقط");
    expect(room).toContain("سبوتات السقف الغائرة هي وحدات السقف الوحيدة");
  });

  it("adds hard negative guards for the room failures seen in generated images", () => {
    const state = createDefaultSceneState();
    const guards = roomNegativeGuards(state).join(", ");
    const negative = buildNegativePrompt(state);

    expect(guards).toContain("no duplicated AC units");
    expect(guards).toContain("no stacked air conditioners");
    expect(guards).toContain("no transparent wardrobe");
    expect(guards).toContain(
      "no visible hanging clothes through closed wardrobe doors",
    );
    expect(guards).toContain("no wardrobe interior lighting");
    expect(guards).toContain("no extra plants");
    expect(guards).toContain("no invented decor");
    expect(guards).toContain("no center-seam daylight slit");
    expect(guards).toContain("no under-curtain light gap");
    expect(negative).toContain("no duplicated AC units");
    expect(negative).toContain("no transparent wardrobe");
    expect(negative).toContain("no extra plants");
  });

  it("uses the strict room lock end-to-end in both generated prompts", () => {
    const state = createDefaultSceneState();
    const english = buildPromptEnglish(state);
    const arabic = buildPromptArabic(state);

    expect(english).toContain("ROOM GEOMETRY LOCK");
    expect(english).toContain("full-height sliding MIRRORED wardrobe");
    expect(english).not.toContain("glass-door wardrobe");
    expect(arabic).toContain("قفل هندسة الغرفة");
    expect(arabic).toContain("واجهات مرايا");
    expect(arabic).not.toContain("خزانة بأبواب زجاجية");
  });
});
