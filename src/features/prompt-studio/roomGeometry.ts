import type { SceneState } from "./types";

const openCurtainModes: SceneState["lightingMode"][] = [
  "daylight-open",
  "overcast-open",
];

export function curtainsAreOpen(state: SceneState): boolean {
  return openCurtainModes.includes(state.lightingMode);
}

function englishCurtainState(state: SceneState): string {
  if (curtainsAreOpen(state)) {
    return "The single back-wall window is exposed only because the selected daylight mode requires the dark blackout curtains to be open; no second window, extra opening, or alternate curtain state is allowed.";
  }

  if (
    state.lightingMode === "daylight-closed" ||
    state.lightingMode === "blue-hour-closed"
  ) {
    return "The single back-wall window is fully covered by floor-length dark blackout curtains. Ambient light may diffuse weakly through the curtain fabric as required by the selected mode, but with no visible exterior, no center-seam slit, no bottom gap, no hard beam, and no direct light leak.";
  }

  return "The single back-wall window is fully covered by floor-length dark blackout curtains with no visible exterior, no center-seam slit, no bottom gap, and no daylight leak.";
}

function arabicCurtainState(state: SceneState): string {
  if (curtainsAreOpen(state)) {
    return "النافذة الوحيدة في الجدار الخلفي تظهر فقط لأن نمط ضوء النهار المختار يفرض فتح ستائر الـblackout الداكنة؛ لا توجد نافذة ثانية أو فتحة إضافية أو حالة ستائر بديلة.";
  }

  if (
    state.lightingMode === "daylight-closed" ||
    state.lightingMode === "blue-hour-closed"
  ) {
    return "النافذة الوحيدة في الجدار الخلفي مغطاة بالكامل بستائر blackout داكنة بطول الأرض. يمكن للضوء المحيط أن ينتشر بخفة عبر نسيج الستارة حسب النمط المختار، لكن من دون إظهار الخارج، ومن دون شق في المنتصف، ومن دون فراغ أسفل الستارة، ومن دون حزمة ضوء مباشرة أو تسريب واضح.";
  }

  return "النافذة الوحيدة في الجدار الخلفي مغطاة بالكامل بستائر blackout داكنة بطول الأرض، من دون إظهار الخارج أو شق في المنتصف أو فراغ أسفل الستارة أو أي تسريب لضوء النهار.";
}

export function englishFixedRoomDescription(state: SceneState): string {
  return [
    "ROOM GEOMETRY LOCK — in the fixed realistic modern bedroom, the architecture and furniture layout are fixed; do not redesign or reinterpret them.",
    "Exactly one bed occupies the LEFT side of the room: a dark tufted-headboard bed on the left, aligned straight with the room geometry and never diagonal, with one tall dark-charcoal tufted headboard and grey bedding.",
    "Exactly one bedside table sits beside the bed with exactly one warm bedside lamp; do not add a second nightstand, extra lamp, plant, books, or invented bedside decor.",
    "Exactly one white wall-mounted split-AC indoor unit is installed high on the UPPER-LEFT wall near the ceiling beside the bed area; no second AC, stacked AC, duplicated vent unit, or ceiling AC.",
    englishCurtainState(state),
    "The RIGHT wall contains exactly one full-height sliding MIRRORED wardrobe with all doors fully closed. It is reflective mirror, not transparent or smoked glass; no open wardrobe section, no visible hanging clothes, and no internal wardrobe lighting.",
    "Exactly one separate dark-wood chest of drawers stands near the wardrobe while remaining physically distinct from it, with a simple uncluttered top unless an object is explicitly requested.",
    "The floor is grey tile with straight perspective-consistent grout lines. Exactly one beige rug lies flat in the clear walking aisle between the bed and wardrobe, never floating, curled, moved under the bed, or intersecting furniture.",
    "Recessed ceiling spotlights are the only ceiling fixtures and stay physically recessed; no chandelier, pendant, LED strip, hidden ceiling glow, or extra ceiling light.",
    "Keep a believable clear walking aisle between bed and wardrobe. Furniture remains flush with its supporting floor or wall with no clipping, overlap, duplication, impossible intersection, warped wall, changed room dimensions, or spontaneous architectural additions.",
  ].join(" ");
}

export function arabicFixedRoomDescription(state: SceneState): string {
  return [
    "قفل هندسة الغرفة — في غرفة النوم الحديثة الواقعية الثابتة، بنية الغرفة وتوزيع الأثاث ثابتان ولا يجوز إعادة تصميمهما أو تفسيرهما من جديد.",
    "يوجد سرير واحد فقط على الجهة اليسرى، بمحور مستقيم ومتوافق مع هندسة الغرفة وليس قطرياً، مع لوح رأس واحد طويل داكن فحمي ومبطن وتنجيد سرير رمادي.",
    "يوجد كومود واحد فقط بجانب السرير وعليه مصباح سرير دافئ واحد فقط؛ لا كومود ثانٍ ولا مصباح إضافي ولا نباتات ولا كتب ولا ديكور جانبي مخترع.",
    "يوجد مكيف سبليت جداري أبيض واحد فقط، مثبت عالياً على الجدار العلوي الأيسر قرب السقف بجوار منطقة السرير؛ لا مكيف ثانٍ ولا وحدات متراكبة ولا فتحة مكررة ولا مكيف سقفي.",
    arabicCurtainState(state),
    "يحتوي الجدار الأيمن على خزانة منزلقة واحدة فقط بارتفاع كامل وواجهات مرايا، وجميع الأبواب مغلقة تماماً. الواجهات مرايا عاكسة وليست زجاجاً شفافاً أو مدخناً؛ لا قسم مفتوح ولا ملابس معلقة ظاهرة ولا إضاءة داخلية للخزانة.",
    "توجد خزانة أدراج خشبية داكنة واحدة منفصلة قرب الخزانة، وتبقى منفصلة عنها مادياً، وسطحها بسيط وغير مزدحم ما لم يُطلب جسم محدد.",
    "الأرضية بلاط رمادي بخطوط فواصل مستقيمة ومتسقة منظورياً. توجد سجادة بيج واحدة فقط ومسطحة في ممر المشي المفتوح بين السرير والخزانة، ولا تطفو ولا تلتف ولا تنتقل تحت السرير ولا تتقاطع مع الأثاث.",
    "سبوتات السقف الغائرة هي وحدات السقف الوحيدة وتبقى غائرة فعلياً؛ لا ثريا ولا إضاءة معلقة ولا شريط LED ولا توهج سقفي مخفي ولا وحدات سقفية إضافية.",
    "يبقى ممر مشي واقعي وواضح بين السرير والخزانة. كل قطعة أثاث ملاصقة لسطح دعمها الصحيح من دون clipping أو تداخل أو تكرار أو اختراق مستحيل أو جدران مشوهة أو تغيير أبعاد الغرفة أو إضافات معمارية تلقائية.",
  ].join(" ");
}

export function roomNegativeGuards(state: SceneState): string[] {
  const guards = [
    "no duplicated AC units; no stacked air conditioners; no second split-AC indoor unit; no ceiling AC",
    "no duplicated bedside table; no second nightstand; no duplicated bedside lamp; no extra lamps",
    "no transparent wardrobe; no smoked-glass wardrobe; no open wardrobe; no visible hanging clothes through closed wardrobe doors; no wardrobe interior lighting",
    "no extra plants; no invented decor; no extra furniture; no spontaneous room accessories",
    "no duplicated bed; no diagonal bed; no duplicated headboard; no moved dresser; no dresser merged into wardrobe",
    "no floating rug; no curled rug; no rug under the bed; no furniture clipping; no furniture overlap; no wall or floor intersection",
    "no redesigned bedroom layout; no changed wall positions; no extra window; no changed room dimensions; no warped architecture",
    "no chandelier; no pendant light; no LED strip; no hidden ceiling glow; no extra ceiling fixtures",
  ];

  if (curtainsAreOpen(state)) {
    guards.push(
      "no contradictory closed-curtain pattern; no second window; no extra exterior opening",
    );
  } else {
    guards.push(
      "no visible exterior through closed curtains; no center-seam daylight slit; no under-curtain light gap; no hard daylight beam through closed curtains",
    );
  }

  return guards;
}
