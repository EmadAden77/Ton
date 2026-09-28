export type RoomVec3 = readonly [number, number, number];

export const BEDROOM_DESIGN = {
  dimensions: {
    width: 6.4,
    depth: 7.2,
    height: 3,
  },
  bounds: {
    leftX: -3.2,
    rightX: 3.2,
    backZ: -3.6,
    frontZ: 3.6,
  },
  reference: {
    imagePath: "/references/fixed-bedroom-reference.webp",
    imageWidth: 752,
    imageHeight: 1337,
    viewpoint: "front entrance looking toward the BACK curtain wall",
    viewerCamera: {
      position: [0.42, 1.62, 3.22] as RoomVec3,
      target: [0.02, 1.08, -1.28] as RoomVec3,
      fov: 48,
      near: 0.1,
      far: 30,
    },
    frame: {
      front: "entrance and camera end",
      back: "full blackout-curtain wall",
      left: "bed, headboard, nightstand, and split AC",
      right: "built-in wardrobe mirrors and separate dresser",
    },
    matchPriorities: [
      "bed scale and left-wall projection",
      "broad central-front rug placement",
      "long rear-to-middle right-wall wardrobe run",
      "separate front-right dresser mass",
      "single compact chair centered near the back curtains",
    ],
    visualIdentity:
      "A spacious lived-in modern master bedroom viewed from the entrance, with the bed confined to the left zone, dark curtains across the back, a long dark-walnut wardrobe run on the right, a separate taller front-right dresser, one compact chair near the curtain wall, a broad central-front rug, glossy light-beige tile, restrained daily clutter, and warm cream-to-taupe walls.",
  },
  door: {
    width: 0.9,
    height: 2.1,
    position: [-2.25, 1.05, 3.54] as RoomVec3,
  },
  bed: {
    mattressLength: 2,
    mattressWidth: 1.8,
    mattressThickness: 0.26,
    mattressTopHeight: 0.54,
    frameLength: 2.12,
    frameWidth: 1.92,
    frameHeight: 0.28,
    visibleFrameLip: 0.06,
    center: [-2, 0.28, -1] as RoomVec3,
    headboardWidth: 1.98,
    headboardHeight: 1.12,
    headboardThickness: 0.1,
    headboardCenter: [-3.13, 0.76, -1] as RoomVec3,
    pillowWidth: 0.75,
    pillowDepth: 0.5,
  },
  nightstand: {
    width: 0.5,
    height: 0.52,
    depth: 0.48,
    center: [-2.75, 0.26, -2.35] as RoomVec3,
  },
  airConditioner: {
    widthAlongWall: 1.05,
    height: 0.36,
    depth: 0.18,
    center: [-3.13, 2.46, 1.7] as RoomVec3,
  },
  curtains: {
    width: 5.6,
    height: 2.78,
    center: [0, 1.44, -3.52] as RoomVec3,
  },
  window: {
    width: 4.8,
    height: 2.25,
    center: [0, 1.58, -3.57] as RoomVec3,
  },
  wardrobe: {
    depth: 0.62,
    height: 2.68,
    runLength: 4.45,
    center: [2.89, 1.34, -0.6] as RoomVec3,
  },
  dresser: {
    depth: 0.58,
    widthAlongWall: 1.45,
    height: 1.05,
    center: [2.9, 0.525, 2.45] as RoomVec3,
  },
  chair: {
    width: 0.68,
    depth: 0.68,
    seatHeight: 0.45,
    center: [0.25, 0, -2.78] as RoomVec3,
  },
  rug: {
    width: 2.4,
    depth: 3,
    center: [0.8, 0.02, 1] as RoomVec3,
  },
  ceilingSpots: [
    [-2.5, 2.94, -2.7],
    [0, 2.94, -2.7],
    [2.5, 2.94, -2.7],
    [-2.5, 2.94, -0.9],
    [0, 2.94, -0.9],
    [2.5, 2.94, -0.9],
    [-2.5, 2.94, 0.9],
    [0, 2.94, 0.9],
    [2.5, 2.94, 0.9],
    [-2.5, 2.94, 2.7],
    [0, 2.94, 2.7],
    [2.5, 2.94, 2.7],
  ] as readonly RoomVec3[],
  materials: {
    walls: "warm cream-to-taupe matte plaster",
    floor: "glossy light-beige large-format porcelain tile",
    wood: "dark walnut with restrained grain",
    bed: "dark charcoal low-profile upholstered platform bed with a thin shallow-channel headboard",
    bedding: "mid-grey cotton fitted sheet and restrained duvet",
    curtains: "black-to-charcoal heavyweight blackout fabric",
    rug: "beige-to-greige low-pile woven rug",
  },
} as const;

export function bedToWardrobeClearance(): number {
  const bedFoot =
    BEDROOM_DESIGN.bed.center[0] + BEDROOM_DESIGN.bed.frameLength / 2;
  const wardrobeFace =
    BEDROOM_DESIGN.bounds.rightX - BEDROOM_DESIGN.wardrobe.depth;
  return wardrobeFace - bedFoot;
}

export function bedToRugClearance(): number {
  const bedFoot =
    BEDROOM_DESIGN.bed.center[0] + BEDROOM_DESIGN.bed.frameLength / 2;
  const rugLeft = BEDROOM_DESIGN.rug.center[0] - BEDROOM_DESIGN.rug.width / 2;
  return rugLeft - bedFoot;
}

export function rugToRightStorageClearance(): number {
  const rugRight = BEDROOM_DESIGN.rug.center[0] + BEDROOM_DESIGN.rug.width / 2;
  const dresserFace =
    BEDROOM_DESIGN.bounds.rightX - BEDROOM_DESIGN.dresser.depth;
  return dresserFace - rugRight;
}
