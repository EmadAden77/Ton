import { BEDROOM_DESIGN, bedToWardrobeClearance } from "./roomDesign";
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
    return "The BACK-wall blackout curtains are intentionally pulled to both sides for the selected daylight mode, exposing only the single wide rear window behind them. Preserve the same curtain track, fabric volume, window size, sill position, and wall opening; do not invent a second window, balcony door, extra opening, or alternate curtain system.";
  }

  if (
    state.lightingMode === "daylight-closed" ||
    state.lightingMode === "blue-hour-closed"
  ) {
    return "The single BACK-wall window is fully covered by heavyweight black-to-charcoal blackout curtains from the ceiling track to the floor. Ambient exterior light may diffuse weakly through the fabric according to the selected mode, but no exterior view, center-seam slit, bottom gap, hard beam, or direct light leak is visible.";
  }

  return "The single BACK-wall window is fully hidden behind heavyweight black-to-charcoal blackout curtains running from the ceiling track to the floor, with natural vertical folds and no visible exterior, center-seam slit, bottom gap, or daylight leak.";
}

function arabicCurtainState(state: SceneState): string {
  if (curtainsAreOpen(state)) {
    return "تُسحب ستائر الـblackout الداكنة في الجدار الخلفي إلى الجانبين فقط لأن نمط ضوء النهار المختار يفرض ذلك، فتظهر نافذة خلفية عريضة واحدة فقط. تبقى سكة الستارة وحجم القماش وأبعاد النافذة وموضعها ثابتة، ولا تُضاف نافذة ثانية أو باب شرفة أو فتحة أخرى أو نظام ستائر مختلف.";
  }

  if (
    state.lightingMode === "daylight-closed" ||
    state.lightingMode === "blue-hour-closed"
  ) {
    return "النافذة الوحيدة في الجدار الخلفي مغطاة بالكامل بستائر blackout ثقيلة سوداء إلى فحمية من سكة السقف حتى الأرض. يمكن للضوء الخارجي المحيط أن ينتشر بخفة عبر القماش حسب النمط المختار، لكن من دون رؤية الخارج أو شق وسطي أو فراغ سفلي أو حزمة ضوء قاسية أو تسريب مباشر.";
  }

  return "النافذة الخلفية الوحيدة مخفية بالكامل خلف ستائر blackout ثقيلة سوداء إلى فحمية تمتد من سكة السقف حتى الأرض بثنيات رأسية طبيعية، من دون رؤية الخارج أو شق وسطي أو فراغ سفلي أو تسريب لضوء النهار.";
}

export function englishFixedRoomDescription(state: SceneState): string {
  const { dimensions } = BEDROOM_DESIGN;
  const aisle = bedToWardrobeClearance().toFixed(2);

  return [
    `ROOM GEOMETRY LOCK — in the fixed realistic modern bedroom, use one fixed engineered lived-in master bedroom measuring ${dimensions.width.toFixed(1)} m LEFT-to-RIGHT by ${dimensions.depth.toFixed(1)} m FRONT-to-BACK with a ${dimensions.height.toFixed(1)} m ceiling. The room is physically spacious because of real floor area and furniture spacing, never because of fisheye distortion, stretched walls, miniaturized furniture, or an exaggerated field of view.`,
    "COORDINATE FRAME — FRONT is the entrance/camera end; BACK is the curtain wall; LEFT is the bed and split-AC wall; RIGHT is the built-in storage and dresser wall. Preserve corner order, wall lengths, tile-grid vanishing directions, circulation paths, and all furniture footprints across every image.",
    "ENTRANCE — exactly one 90 cm hinged dark-wood door is fixed near the FRONT-LEFT corner with a clear inward swing zone. It never moves behind the bed, changes wall, duplicates, or intersects furniture.",
    "BED — exactly one dark tufted-headboard bed on the left uses a low-profile 180 x 200 cm mattress on a grounded dark upholstered frame. Its long axis projects from the LEFT wall toward the room center. The bed never rotates diagonally, shrinks into a bench, becomes a daybed, changes scale, or migrates to another wall.",
    "HEADBOARD — one continuous dark-charcoal channel-tufted upholstered headboard, about 205 cm wide and 125 cm high, is physically attached to the bed and flush with the LEFT wall. It uses broad horizontal padded channels with restrained seams, not diamond button tufting, vertical slats, a wooden panel, or a detached floating board.",
    "BEDDING — mid-grey cotton bedding remains on this bed with two sleeping pillows, gravity-driven wrinkles, realistic mattress edge thickness, mild daily-use rumpling, and localized compression where the body contacts the mattress or pillows.",
    "NIGHTSTAND — exactly one compact dark-walnut nightstand sits beside the headboard toward the BACK side of the bed. It carries one small warm bedside lamp, one charging cable, one water bottle, and at most a few ordinary personal items; do not duplicate the nightstand or lamp.",
    "AIR CONDITIONER — exactly one white wall-mounted split-AC indoor unit is fixed high on the LEFT wall toward the FRONT half, clear of the headboard and door swing. No second AC, stacked unit, ceiling cassette, duplicated vent, or wall relocation.",
    englishCurtainState(state),
    "RIGHT-WALL STORAGE — one long dark-walnut built-in storage run occupies the rear-to-middle RIGHT wall at realistic 62 cm depth. It combines several distinct modules: clear reflective mirror panels, one open hanging bay with a short rail and a restrained set of shirts, lower drawers, and open shelves. Do not simplify the entire run into identical mirror doors, black glass, transparent glazing, or a fully open closet.",
    "WARDROBE MIRRORS — the mirror modules are genuine reflective mirrors with straight panel seams and physically correct reflection cones. They reflect only room elements that are actually inside the reflected field of view; no duplicated person, duplicated bed, impossible camera, extra room, or mirrored architecture.",
    "DRESSER — one separate dark-walnut chest of drawers stands on the FRONT-RIGHT wall zone, physically distinct from the built-in storage. Its top may hold a restrained cluster of grooming items and a small tray, but it never merges into the wardrobe, floats, changes wall, or becomes a desk.",
    "CHAIR — exactly one compact upholstered chair sits near the BACK curtains slightly right of center, with grounded legs and one casually draped garment. It is not a lounge chair, office chair, sofa, or second seating set.",
    `CIRCULATION — keep approximately ${aisle} m of real clear width between the bed foot and the face of the RIGHT-wall storage, with a continuous walking path from the entrance to the bed, chair, dresser, and wardrobe. No furniture may consume this aisle or block the door, drawers, mirror panels, or chair access.`,
    "FLOOR — large-format glossy light-beige porcelain tiles cover the whole room with straight continuous grout lines, restrained specular reflections, and no grey concrete, wood flooring, carpeted room, marble veining, or broken perspective grid.",
    "RUG — one broad beige-to-greige low-pile rectangular rug lies flat in the open central-front floor zone, surrounded by visible tile on all sides. It is an area rug, not a narrow runner, and it never slides under the bed, curls, floats, intersects the dresser, or blocks the wardrobe.",
    "CEILING — a stepped rectangular tray ceiling with layered crown molding spans the room. Twelve small circular recessed downlights occupy fixed positions across the ceiling; their on/off state follows the selected lighting mode. No chandelier, pendant, LED strip, hidden cove glow, extra fixture, or moving spotlight.",
    "LIVED-IN ANCHORS — preserve a believable but controlled daily-use layer: one dark soft bag near the rear-right storage zone, three naturally scattered footwear pairs around the rug and nearby tile, a casually draped garment on the chair, restrained personal items on the dresser, and mild bedding disorder. These anchors may be partly cropped but must not teleport, duplicate, or turn into showroom styling.",
    "MATERIAL LOCK — warm cream-to-taupe matte walls, dark walnut furniture with restrained grain, dark charcoal upholstered bed, mid-grey cotton bedding, black-to-charcoal blackout curtains, beige low-pile rug, glossy light-beige porcelain tile, brushed metal hardware, and ordinary micro-wear. Preserve material-specific roughness, reflections, contact shadows, and scale.",
    "ENGINEERING RULE — every furniture piece has a continuous 3D structure, grounded supports, coherent contact shadows, realistic clearances, and non-intersecting volumes. Camera framing may hide an object but must never redesign, mirror, resize, rotate, duplicate, substitute, or relocate the room geometry.",
  ].join(" ");
}

export function arabicFixedRoomDescription(state: SceneState): string {
  const { dimensions } = BEDROOM_DESIGN;
  const aisle = bedToWardrobeClearance().toFixed(2);

  return [
    `قفل هندسة الغرفة — في غرفة النوم الحديثة الواقعية الثابتة، استخدم غرفة نوم رئيسية واحدة ثابتة ومهندسة ومستخدمة يومياً، بعرض ${dimensions.width.toFixed(1)} م من اليسار إلى اليمين وعمق ${dimensions.depth.toFixed(1)} م من الأمام إلى الخلف وارتفاع سقف ${dimensions.height.toFixed(1)} م. اتساع الغرفة ناتج عن المساحة الحقيقية وتباعد الأثاث، لا عن عدسة fisheye أو تمديد الجدران أو تصغير الأثاث أو توسيع مجال الرؤية بشكل مصطنع.`,
    "الإطار الإحداثي — الأمام هو جهة المدخل والكاميرا، والخلف هو جدار الستائر، واليسار هو جدار السرير والمكيف، واليمين هو جدار التخزين وخزانة الأدراج. تبقى الزوايا وأطوال الجدران ومنظور فواصل البلاط ومسارات الحركة وبصمات الأثاث ثابتة في كل صورة.",
    "المدخل — باب خشبي داكن واحد فقط بعرض 90 سم قرب الركن الأمامي الأيسر مع منطقة فتح داخلية خالية. لا ينتقل خلف السرير ولا يغير الجدار ولا يتكرر ولا يتقاطع مع الأثاث.",
    "السرير — سرير واحد فقط على اليسار بلوح رأس منجد داكن، ومرتبة منخفضة 180 × 200 سم على قاعدة منجدة داكنة ملاصقة للأرض، ومحوره الطويل يمتد من الجدار الأيسر نحو مركز الغرفة. لا يدور السرير قطرياً ولا ينكمش إلى مقعد ولا يتحول إلى daybed ولا يغير حجمه أو جداره.",
    "لوح الرأس — لوح واحد متصل منجّد بلون فحمي داكن بعرض يقارب 205 سم وارتفاع 125 سم، متصل مادياً بالسرير وملاصق للجدار الأيسر. تصميمه channel-tufted بقنوات أفقية عريضة مبطنة وخياطة محدودة، وليس تنجيداً ماسياً بأزرار أو شرائح رأسية أو لوح خشب أو قطعة عائمة منفصلة.",
    "الفراش — مفارش قطنية رمادية متوسطة مع وسادتين للنوم، وثنيات تقودها الجاذبية، وسماكة مرتبة منطقية، وفوضى يومية خفيفة، وانضغاط موضعي عند ملامسة الجسم للمرتبة أو الوسائد.",
    "الكومود — كومود واحد فقط من خشب جوز داكن بجوار لوح الرأس من جهة الخلف، عليه مصباح سرير دافئ صغير واحد وكابل شحن وقارورة ماء وعدد محدود من الأغراض اليومية؛ لا كومود ثانٍ ولا مصباح مكرر.",
    "المكيف — وحدة split بيضاء واحدة فقط مثبتة عالياً على الجدار الأيسر في نصفه الأمامي وبعيدة عن لوح الرأس ومسار الباب. لا مكيف ثانٍ ولا وحدات متراكبة ولا cassette سقفي ولا فتحة مكررة ولا نقل إلى جدار آخر.",
    arabicCurtainState(state),
    "تخزين الجدار الأيمن — منظومة built-in واحدة طويلة من خشب الجوز الداكن تشغل الجزء الخلفي إلى الأوسط من الجدار الأيمن بعمق واقعي 62 سم. تتكون من وحدات مختلفة بوضوح: ألواح مرايا عاكسة حقيقية، وقسم تعليق مفتوح واحد بسكة قصيرة وعدد محدود من القمصان، وأدراج سفلية، ورفوف مفتوحة. لا تتحول المنظومة كلها إلى أبواب مرايا متطابقة أو زجاج أسود أو زجاج شفاف أو خزانة مفتوحة بالكامل.",
    "مرايا الخزانة — وحدات المرايا عاكسة فعلياً وبفواصل مستقيمة ومخروط انعكاس فيزيائي صحيح، ولا تعكس إلا ما يقع فعلياً داخل مجال الانعكاس. لا شخص مكرر ولا سرير مكرر ولا كاميرا مستحيلة ولا غرفة إضافية ولا معمار معكوس خاطئ.",
    "خزانة الأدراج — chest of drawers منفصلة من خشب الجوز الداكن في المنطقة الأمامية اليمنى، منفصلة مادياً عن منظومة التخزين. يمكن أن يحمل سطحها مجموعة محدودة من أغراض العناية وصينية صغيرة، لكنها لا تندمج مع الخزانة ولا تطفو ولا تنتقل إلى جدار آخر ولا تتحول إلى مكتب.",
    "الكرسي — كرسي منجد مدمج واحد فقط قرب الستائر الخلفية إلى يمين المنتصف قليلاً، بأرجل ملامسة للأرض وقطعة ملابس واحدة ملقاة عليه بشكل طبيعي. ليس كرسي استرخاء ولا كرسي مكتب ولا أريكة ولا مجموعة جلوس ثانية.",
    `الحركة — يبقى عرض فعلي واضح يقارب ${aisle} م بين نهاية السرير وواجهة التخزين اليمنى، مع مسار متصل من المدخل إلى السرير والكرسي وخزانة الأدراج والخزانة. لا يجوز لأي قطعة أثاث أن تستهلك هذا الممر أو تعيق الباب أو الأدراج أو ألواح المرايا أو الوصول للكرسي.`,
    "الأرضية — بلاط porcelain كبير ولامع بلون بيج فاتح يغطي الغرفة كلها بفواصل مستقيمة ومتصلة وانعكاسات محدودة واقعية، من دون أرضية رمادية خرسانية أو خشب أو موكيت كامل أو عروق رخام أو شبكة منظور مكسورة.",
    "السجادة — سجادة واحدة عريضة مستطيلة منخفضة الوبر بدرجات البيج إلى greige في المساحة الأمامية الوسطى المفتوحة، ويظهر البلاط حولها من جميع الجهات. هي area rug وليست ممراً ضيقاً، ولا تدخل تحت السرير ولا تلتف ولا تطفو ولا تتقاطع مع خزانة الأدراج ولا تعيق الخزانة.",
    "السقف — سقف tray مستطيل متدرج مع crown molding متعدد الطبقات. توجد اثنتا عشرة وحدة downlight دائرية غائرة صغيرة في مواضع ثابتة، وحالة تشغيلها تتبع نمط الإضاءة المختار. لا ثريا ولا pendant ولا شريط LED ولا توهج cove مخفي ولا وحدات إضافية ولا سبوتات تتحرك.",
    "علامات الاستخدام اليومي — تبقى طبقة يومية منضبطة وواقعية: حقيبة داكنة ناعمة قرب منطقة التخزين الخلفية اليمنى، وثلاثة أزواج أحذية موزعة طبيعياً حول السجادة والبلاط المجاور، وقطعة ملابس على الكرسي، وأغراض شخصية محدودة على خزانة الأدراج، وفوضى خفيفة في الفراش. قد يحجب الكادر بعضها لكن لا تنتقل ولا تتكرر ولا تتحول الغرفة إلى showroom.",
    "قفل الخامات — جدران matte كريمية إلى taupe، وخشب جوز داكن بحبيبات محدودة، وسرير منجد فحمي، وفراش قطني رمادي، وستائر blackout سوداء إلى فحمية، وسجادة بيج منخفضة الوبر، وبلاط porcelain بيج فاتح لامع، ومعدن brushed في المقابض، وآثار استخدام دقيقة. تبقى خشونة كل خامة وانعكاسها وظلال تماسها ومقياسها منطقية.",
    "قاعدة هندسية — كل قطعة أثاث بنية ثلاثية الأبعاد متصلة ودعاماتها ملامسة للأرض وظلال تماسها متسقة ولها خلوص واقعي من القطع الأخرى. يمكن للكادر أن يخفي قطعة لكنه لا يعيد تصميم الغرفة ولا يعكسها ولا يغير المقاسات ولا يدير الأثاث ولا يكرره ولا يستبدله ولا ينقله.",
  ].join(" ");
}

export function roomNegativeGuards(state: SceneState): string[] {
  const guards = [
    "no second bed; no diagonal bed; no bench-like bed; no daybed; no undersized mattress; no detached or duplicated headboard",
    "no second nightstand; no duplicated bedside lamp; no extra bedside furniture; no floating bedside objects",
    "no duplicated AC units; no stacked air conditioners; no ceiling AC; no AC on the back or right wall",
    "no featureless all-mirror wardrobe; no black-glass wardrobe; no transparent wardrobe; no fully open wardrobe; no dresser merged into wardrobe",
    "no duplicated chair; no sofa; no office chair; no second seating set; no desk; no television; no freestanding mirror",
    "no grey concrete floor; no wood floor; no marble floor; no broken grout perspective; no floating or curled rug; no narrow runner rug; no rug under the bed",
    "no showroom-clean bedroom; no random luxury decor; no extra plants; no spontaneous shelves; no invented large accessories",
    "no duplicated bag; no duplicated footwear; no teleporting clutter; no excessive mess that blocks circulation",
    "no furniture clipping; no furniture overlap; no wall or floor intersection; no unsupported furniture; no missing contact shadows",
    "no narrow corridor room; no stretched walls; no fisheye room expansion; no miniaturized furniture; no changed room dimensions; no warped architecture",
    "no chandelier; no pendant light; no LED strip; no hidden ceiling glow; no extra ceiling fixtures; no moved recessed lights",
    "no mirror reflection showing impossible room geometry; no duplicated person in wardrobe mirrors; no reflection-camera mismatch",
  ];

  if (curtainsAreOpen(state)) {
    guards.push(
      "no contradictory closed-curtain pattern; no second rear window; no balcony door; no extra exterior opening; no missing curtain fabric",
    );
  } else {
    guards.push(
      "no visible exterior through closed curtains; no center-seam daylight slit; no under-curtain light gap; no hard daylight beam through closed curtains",
    );
  }

  return guards;
}
