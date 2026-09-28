import { BEDROOM_DESIGN, bedToWardrobeClearance } from "./roomDesign";
import type { SceneState } from "./types";

const openCurtainModes: SceneState["lightingMode"][] = [
  "daylight-open",
  "overcast-open",
];

const bedContactPoses: readonly SceneState["poseType"][] = [
  "sitting-bed",
  "sitting-bed-edge",
  "sitting-bed-cross-legged",
  "reclining-headboard",
  "lying-bed",
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

function englishBedSelfieComposition(state: SceneState): string {
  if (
    state.shotType !== "front-selfie" ||
    !bedContactPoses.includes(state.poseType)
  ) {
    return "";
  }

  const crossLegged =
    state.poseType === "sitting-bed-cross-legged"
      ? "For the cross-legged pose, place the pelvis near the true center of the mattress rather than on the foot edge; both knees remain within the mattress footprint. "
      : "";

  return `BED-SELFIE COMPOSITION — ${crossLegged}Do not let the mattress become a giant foreground plane. Preserve a readable straight foot edge and at least one readable side edge whenever they are inside the field of view. The bed must remain visibly separate from the central rug and the wide circulation aisle. Room context must stay legible behind the subject, with substantial exposed floor and real depth between the bed foot and the right-wall storage.`;
}

function arabicBedSelfieComposition(state: SceneState): string {
  if (
    state.shotType !== "front-selfie" ||
    !bedContactPoses.includes(state.poseType)
  ) {
    return "";
  }

  const crossLegged =
    state.poseType === "sitting-bed-cross-legged"
      ? "في وضعية التربع يوضع الحوض قرب المركز الحقيقي للمرتبة وليس عند حافة القدم، وتبقى الركبتان داخل حدود المرتبة. "
      : "";

  return `تكوين سيلفي السرير — ${crossLegged}لا تتحول المرتبة إلى سطح أمامي عملاق يبتلع أسفل الصورة. تبقى حافة القدم المستقيمة واضحة، ومعها إحدى الحافتين الجانبيتين متى كانت داخل مجال الرؤية. يبقى السرير منفصلاً بصرياً ومكانياً عن السجادة المركزية وعن ممر الحركة الواسع، وتظل مساحة الأرض والعمق الحقيقي بين نهاية السرير وتخزين الجدار الأيمن مقروءة خلف الشخص.`;
}

export function englishFixedRoomDescription(state: SceneState): string {
  const { dimensions, bed } = BEDROOM_DESIGN;
  const aisle = bedToWardrobeClearance().toFixed(2);

  return [
    `ROOM GEOMETRY LOCK — use one fixed engineered lived-in master bedroom measuring ${dimensions.width.toFixed(1)} m LEFT-to-RIGHT by ${dimensions.depth.toFixed(1)} m FRONT-to-BACK with a ${dimensions.height.toFixed(1)} m ceiling. This is a genuinely spacious room. Its width must read through real wall separation, long floor runs, furniture spacing, and the broad central aisle, never through fisheye distortion, stretched walls, miniaturized furniture, or an artificial ultra-wide field of view.`,
    "SPATIAL READABILITY — the BACK wall must read as a wide wall, not a narrow corridor terminus. The bed occupies only the left zone; the right-wall storage occupies only the right zone; a broad open floor field remains between them. Preserve long straight tile grout lines converging naturally in perspective and enough exposed floor to make the room scale obvious.",
    "COORDINATE FRAME — FRONT is the entrance/camera end; BACK is the curtain wall; LEFT is the bed and split-AC wall; RIGHT is the built-in storage and dresser wall. Preserve corner order, wall lengths, circulation paths, and furniture footprints across every image.",
    "ENTRANCE — exactly one 90 cm hinged dark-wood door is fixed near the FRONT-LEFT zone with a clear inward swing area. It never moves behind the bed, changes wall, duplicates, or intersects furniture.",
    `BED GEOMETRY — exactly one normal rectangular bed occupies the LEFT zone. The mattress is exactly 180 x 200 cm and ${Math.round(bed.mattressThickness * 100)} cm thick. It sits inside a low dark upholstered platform frame about 192 x 212 cm and ${Math.round(bed.frameHeight * 100)} cm high, leaving a narrow visible frame lip around the mattress. The mattress top is about ${Math.round(bed.mattressTopHeight * 100)} cm above the floor. The head end touches the LEFT wall and the bed's long axis is exactly perpendicular to that wall, projecting LEFT-to-RIGHT. The foot edge is a straight readable edge ending well before the room center. The bed never rotates, widens into a wall-to-wall platform, stretches toward the camera, becomes a bench/daybed, or changes scale.`,
    `HEADBOARD — one thin dark-charcoal upholstered headboard is fixed flush to the LEFT wall and physically aligned with the mattress, about ${Math.round(bed.headboardWidth * 100)} cm wide, ${Math.round(bed.headboardHeight * 100)} cm high, and only ${Math.round(bed.headboardThickness * 100)} cm thick. Use a clean modern surface with only three or four shallow horizontal stitched channels. It must not become thick stacked cushions, giant padded blocks, a hotel wall panel, diamond button tufting, vertical slats, wood cladding, or a detached floating board.`,
    "BEDDING — use a fitted mid-grey cotton sheet plus one restrained mid-grey duvet and exactly two normal sleeping pillows near the headboard. The duvet follows gravity and mattress edges without hiding the bed's rectangular outline, cascading to the floor, swallowing the frame, or becoming an oversized soft platform. Mattress corners, side thickness, and foot boundary remain physically readable where visible.",
    "NIGHTSTAND — exactly one compact dark-walnut nightstand sits beside the head end toward the BACK side. It carries one small warm bedside lamp, one charging cable, one water bottle, and only a few ordinary personal items; do not duplicate the nightstand or lamp.",
    "AIR CONDITIONER — exactly one white wall-mounted split-AC indoor unit is fixed high on the LEFT wall toward the FRONT half, clear of the headboard and door zone. No second AC, stacked unit, ceiling cassette, duplicated vent, or wall relocation.",
    englishCurtainState(state),
    "RIGHT-WALL STORAGE — one long dark-walnut built-in storage run occupies the rear-to-middle RIGHT wall at realistic 62 cm depth. It combines distinct modules: genuine reflective mirror panels, one open hanging bay with a short rail and a restrained set of shirts, lower drawers, and open shelves. Do not simplify the run into identical mirror doors, black glass, transparent glazing, or a fully open closet.",
    "WARDROBE MIRRORS — mirror modules are physically reflective with straight seams and correct reflection cones. They reflect only geometry actually inside the reflected field of view; no duplicated person, duplicated bed, impossible camera, extra room, or mirrored architecture.",
    "DRESSER — one separate dark-walnut chest of drawers stands in the FRONT-RIGHT zone, physically distinct from the built-in storage. Its top may hold a restrained cluster of grooming items and a small tray, but it never merges into the wardrobe, floats, changes wall, or becomes a desk.",
    "CHAIR — exactly one compact upholstered chair sits near the BACK curtains slightly right of center, with grounded legs and one casually draped garment. It is not a lounge chair, office chair, sofa, or second seating set.",
    `CIRCULATION — preserve approximately ${aisle} m of true clear width from the bed foot to the face of the RIGHT-wall storage. This wide aisle is a primary scale anchor and must remain visibly open. No furniture, rug, limbs, bedding, or perspective exaggeration may visually collapse it into a narrow passage.`,
    "FLOOR — large-format glossy light-beige porcelain tiles cover the whole room with straight continuous grout lines and restrained specular reflections. No grey concrete, wood flooring, carpeted room, marble veining, or broken perspective grid.",
    "RUG — one broad beige-to-greige low-pile rectangular area rug lies flat in the open central-front floor zone with visible tile around all four sides. It is not a runner and never slides under the bed, curls, floats, intersects the dresser, or blocks the wardrobe.",
    "CEILING — a stepped rectangular tray ceiling with layered crown molding spans the room. Twelve small circular recessed downlights occupy fixed positions across the ceiling; their on/off state follows the selected lighting mode. No chandelier, pendant, LED strip, hidden cove glow, extra fixture, or moving spotlight.",
    "LIVED-IN ANCHORS — preserve restrained daily use: one dark soft bag near the rear-right storage, three naturally scattered footwear pairs around the rug and nearby tile, one garment on the chair, a few dresser items, and mild bedding disorder. Keep circulation clear and avoid showroom styling or excessive clutter.",
    "MATERIAL LOCK — warm cream-to-taupe matte walls, dark walnut furniture with restrained grain, dark charcoal low-profile upholstered bed, mid-grey cotton bedding, black-to-charcoal blackout curtains, beige low-pile rug, glossy light-beige porcelain tile, brushed metal hardware, and ordinary micro-wear.",
    englishBedSelfieComposition(state),
    "ENGINEERING RULE — every furniture piece has continuous 3D structure, grounded supports, coherent contact shadows, realistic clearances, and non-intersecting volumes. Camera framing may crop an object but must never redesign, mirror, resize, rotate, duplicate, substitute, or relocate the room geometry.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function arabicFixedRoomDescription(state: SceneState): string {
  const { dimensions, bed } = BEDROOM_DESIGN;
  const aisle = bedToWardrobeClearance().toFixed(2);

  return [
    `قفل هندسة الغرفة — استخدم غرفة نوم رئيسية واحدة ثابتة ومهندسة ومستخدمة يومياً، بعرض ${dimensions.width.toFixed(1)} م من اليسار إلى اليمين وعمق ${dimensions.depth.toFixed(1)} م من الأمام إلى الخلف وارتفاع سقف ${dimensions.height.toFixed(1)} م. هذه غرفة واسعة فعلياً، ويجب أن يظهر اتساعها من تباعد الجدران وطول الأرضية والمسافات بين الأثاث والممر المركزي العريض، لا من fisheye أو تمديد الجدران أو تصغير الأثاث أو مجال رؤية ultra-wide مصطنع.`,
    "وضوح المقياس المكاني — يجب أن يظهر الجدار الخلفي كجدار عريض لا كنهاية ممر ضيق. يشغل السرير المنطقة اليسرى فقط، ويشغل التخزين المنطقة اليمنى فقط، وتبقى بينهما مساحة أرض مفتوحة وعريضة مع خطوط بلاط مستقيمة ومنظور طبيعي.",
    "الإطار الإحداثي — الأمام جهة المدخل والكاميرا، والخلف جدار الستائر، واليسار جدار السرير والمكيف، واليمين جدار التخزين وخزانة الأدراج. تبقى الزوايا وأطوال الجدران ومسارات الحركة وبصمات الأثاث ثابتة في كل صورة.",
    "المدخل — باب خشبي داكن واحد فقط بعرض 90 سم قرب المنطقة الأمامية اليسرى مع منطقة فتح داخلية خالية. لا ينتقل خلف السرير ولا يغير الجدار ولا يتكرر ولا يتقاطع مع الأثاث.",
    `هندسة السرير — سرير مستطيل طبيعي واحد فقط في المنطقة اليسرى. المرتبة بالضبط 180 × 200 سم وسماكتها ${Math.round(bed.mattressThickness * 100)} سم، داخل قاعدة منجدة داكنة منخفضة تقارب 192 × 212 سم وارتفاعها ${Math.round(bed.frameHeight * 100)} سم، مع حافة ضيقة ظاهرة حول المرتبة. يصل سطح المرتبة إلى نحو ${Math.round(bed.mattressTopHeight * 100)} سم فوق الأرض. جهة الرأس ملاصقة للجدار الأيسر ومحور السرير الطويل عمودي تماماً على ذلك الجدار ويمتد من اليسار إلى اليمين. تبقى حافة القدم مستقيمة ومقروءة وتنتهي قبل مركز الغرفة بوضوح. لا يدور السرير ولا يتسع إلى منصة بعرض الغرفة ولا يتمدد نحو الكاميرا ولا يتحول إلى bench أو daybed ولا يغير مقياسه.`,
    `لوح الرأس — لوح منجد فحمي داكن ونحيف واحد فقط ملاصق للجدار الأيسر ومصطف مادياً مع المرتبة، بعرض يقارب ${Math.round(bed.headboardWidth * 100)} سم وارتفاع ${Math.round(bed.headboardHeight * 100)} سم وسماكة ${Math.round(bed.headboardThickness * 100)} سم فقط. تصميمه حديث ونظيف بثلاث أو أربع خياطات أفقية ضحلة فقط، ولا يتحول إلى وسائد سميكة متراكبة أو كتل مبطنة ضخمة أو hotel wall panel أو تنجيد ماسي أو شرائح رأسية أو لوح خشبي أو قطعة عائمة.`,
    "الفراش — ملاءة قطنية رمادية fitted مع لحاف رمادي معتدل ووسادتين عاديتين فقط قرب لوح الرأس. يتبع اللحاف الجاذبية وحدود المرتبة من دون إخفاء شكل السرير المستطيل أو النزول إلى الأرض أو ابتلاع القاعدة أو التحول إلى منصة طرية ضخمة. تبقى زوايا المرتبة وسماكتها وحافة القدم مقروءة متى ظهرت في الكادر.",
    "الكومود — كومود واحد فقط من خشب جوز داكن بجانب جهة الرأس من ناحية الخلف، عليه مصباح سرير دافئ صغير واحد وكابل شحن وقارورة ماء وعدد محدود من الأغراض اليومية، من دون تكرار.",
    "المكيف — وحدة split بيضاء واحدة فقط مثبتة عالياً على الجدار الأيسر في نصفه الأمامي وبعيدة عن لوح الرأس ومنطقة الباب. لا مكيف ثانٍ ولا وحدات متراكبة ولا cassette سقفي ولا فتحة مكررة ولا نقل إلى جدار آخر.",
    arabicCurtainState(state),
    "تخزين الجدار الأيمن — منظومة built-in واحدة طويلة من خشب الجوز الداكن بعمق 62 سم في الجزء الخلفي إلى الأوسط من الجدار الأيمن، وتضم ألواح مرايا عاكسة حقيقية وقسم تعليق مفتوح واحد وأدراجاً سفلية ورفوفاً مفتوحة. لا تتحول كلها إلى مرايا متطابقة أو زجاج أسود أو شفاف أو خزانة مفتوحة بالكامل.",
    "مرايا الخزانة — المرايا عاكسة فعلياً بفواصل مستقيمة ومخروط انعكاس صحيح، ولا تعكس إلا العناصر الموجودة فعلياً داخل مجال الانعكاس. لا شخص مكرر ولا سرير مكرر ولا كاميرا مستحيلة ولا غرفة إضافية.",
    "خزانة الأدراج — chest of drawers منفصلة من خشب الجوز الداكن في المنطقة الأمامية اليمنى ومنفصلة مادياً عن التخزين المدمج، مع عدد محدود من أغراض العناية على سطحها. لا تندمج بالخزانة ولا تتحول إلى مكتب.",
    "الكرسي — كرسي منجد مدمج واحد فقط قرب الستائر الخلفية إلى يمين المنتصف قليلاً، بأرجل ملامسة للأرض وقطعة ملابس واحدة عليه. لا يتحول إلى كرسي مكتب أو أريكة أو مجموعة جلوس ثانية.",
    `الحركة — يبقى عرض حقيقي واضح يقارب ${aisle} م بين نهاية السرير وواجهة التخزين اليمنى. هذا الممر العريض مرجع أساسي لمقياس الغرفة ويجب أن يبقى مفتوحاً بصرياً. لا أثاث ولا سجادة ولا أطراف ولا فراش ولا تشويه منظور يجوز أن يحوله إلى ممر ضيق.`,
    "الأرضية — بلاط porcelain كبير ولامع بلون بيج فاتح يغطي الغرفة بفواصل مستقيمة ومتصلة وانعكاسات محدودة واقعية، من دون أرضية خرسانية رمادية أو خشب أو موكيت كامل أو عروق رخام أو شبكة منظور مكسورة.",
    "السجادة — سجادة area rug واحدة عريضة مستطيلة منخفضة الوبر بدرجات البيج إلى greige في المساحة الأمامية الوسطى، ويظهر البلاط حولها من الجهات الأربع. ليست runner ولا تدخل تحت السرير ولا تلتف ولا تطفو ولا تعيق الخزانة.",
    "السقف — سقف tray مستطيل متدرج مع crown molding متعدد الطبقات واثنتي عشرة وحدة downlight دائرية غائرة صغيرة في مواضع ثابتة. لا ثريا ولا pendant ولا شريط LED ولا توهج مخفي ولا وحدات إضافية.",
    "علامات الاستخدام اليومي — حقيبة داكنة ناعمة قرب التخزين الخلفي الأيمن، وثلاثة أزواج أحذية موزعة طبيعياً حول السجادة والبلاط المجاور، وقطعة ملابس على الكرسي، وأغراض محدودة على خزانة الأدراج، وفوضى خفيفة في الفراش مع بقاء الممرات مفتوحة.",
    "قفل الخامات — جدران matte كريمية إلى taupe، وخشب جوز داكن، وسرير منخفض منجد فحمي، وفراش قطني رمادي، وستائر blackout داكنة، وسجادة بيج منخفضة الوبر، وبلاط porcelain بيج فاتح لامع، ومعدن brushed وآثار استخدام دقيقة.",
    arabicBedSelfieComposition(state),
    "قاعدة هندسية — كل قطعة أثاث بنية ثلاثية الأبعاد متصلة ودعاماتها ملامسة للأرض وظلال تماسها متسقة ولها خلوص واقعي من القطع الأخرى. يمكن للكادر أن يقص قطعة لكنه لا يعيد تصميم الغرفة ولا يعكسها ولا يغير المقاسات ولا يدير الأثاث ولا يكرره ولا ينقله.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function roomNegativeGuards(state: SceneState): string[] {
  const guards = [
    "no second bed; no diagonal bed; no bench-like bed; no daybed; no wall-to-wall bed; no oversized mattress; no perspective-stretched mattress; no giant foreground mattress plane",
    "no missing bed foot edge; no curved foot edge; no mattress fused into floor; no bedding hiding the entire frame; no duvet cascading to the floor",
    "no thick stacked-cushion headboard; no giant padded headboard blocks; no hotel-wall headboard; no detached or duplicated headboard",
    "no second nightstand; no duplicated bedside lamp; no extra bedside furniture; no floating bedside objects",
    "no duplicated AC units; no stacked air conditioners; no ceiling AC; no AC on the back or right wall",
    "no featureless all-mirror wardrobe; no black-glass wardrobe; no transparent wardrobe; no fully open wardrobe; no dresser merged into wardrobe",
    "no duplicated chair; no sofa; no office chair; no second seating set; no desk; no television; no freestanding mirror",
    "no grey concrete floor; no wood floor; no marble floor; no broken grout perspective; no floating or curled rug; no narrow runner rug; no rug under the bed",
    "no showroom-clean bedroom; no random luxury decor; no extra plants; no spontaneous shelves; no invented large accessories",
    "no duplicated bag; no duplicated footwear; no teleporting clutter; no excessive mess that blocks circulation",
    "no furniture clipping; no furniture overlap; no wall or floor intersection; no unsupported furniture; no missing contact shadows",
    "no narrow corridor room; no compressed wall spacing; no collapsed central aisle; no stretched walls; no fisheye room expansion; no miniaturized furniture; no changed room dimensions; no warped architecture",
    "no chandelier; no pendant light; no LED strip; no hidden ceiling glow; no extra ceiling fixtures; no moved recessed lights",
    "no mirror reflection showing impossible room geometry; no duplicated person in wardrobe mirrors; no reflection-camera mismatch",
  ];

  if (bedContactPoses.includes(state.poseType)) {
    guards.push(
      "no bed filling most of the lower frame solely from perspective; no subject seated beyond the mattress footprint; no knees floating outside the mattress without support",
    );
  }

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
