export type RoomVec3 = readonly [number, number, number];

export const BEDROOM_DESIGN = {
  dimensions: {
    width: 5.2,
    depth: 6.2,
    height: 2.9,
  },
  bounds: {
    leftX: -2.6,
    rightX: 2.6,
    backZ: -3.1,
    frontZ: 3.1,
  },
  door: {
    width: 0.9,
    height: 2.1,
    position: [-1.85, 1.05, 3.04] as RoomVec3,
  },
  bed: {
    mattressLength: 2,
    mattressWidth: 1.8,
    mattressThickness: 0.27,
    frameLength: 2.1,
    frameWidth: 1.9,
    frameHeight: 0.34,
    center: [-1.52, 0.34, -0.65] as RoomVec3,
    headboardWidth: 2.05,
    headboardHeight: 1.25,
    headboardThickness: 0.14,
    headboardCenter: [-2.51, 0.83, -0.65] as RoomVec3,
  },
  nightstand: {
    width: 0.5,
    height: 0.52,
    depth: 0.48,
    center: [-2.25, 0.26, -1.95] as RoomVec3,
  },
  airConditioner: {
    widthAlongWall: 1.05,
    height: 0.36,
    depth: 0.18,
    center: [-2.51, 2.35, 1.25] as RoomVec3,
  },
  curtains: {
    width: 4.4,
    height: 2.7,
    center: [0, 1.42, -3.02] as RoomVec3,
  },
  window: {
    width: 3.7,
    height: 2.2,
    center: [0, 1.55, -3.07] as RoomVec3,
  },
  wardrobe: {
    depth: 0.62,
    height: 2.55,
    runLength: 3.5,
    center: [2.29, 1.275, -0.55] as RoomVec3,
  },
  dresser: {
    depth: 0.68,
    widthAlongWall: 1.25,
    height: 0.94,
    center: [2.22, 0.47, 2.15] as RoomVec3,
  },
  chair: {
    width: 0.72,
    depth: 0.72,
    seatHeight: 0.46,
    center: [0.65, 0, -2.35] as RoomVec3,
  },
  rug: {
    width: 2,
    depth: 3.2,
    center: [0.78, 0.02, 0.55] as RoomVec3,
  },
  ceilingSpots: [
    [-2.05, 2.84, -2.4],
    [0, 2.84, -2.4],
    [2.05, 2.84, -2.4],
    [-2.05, 2.84, -0.8],
    [0, 2.84, -0.8],
    [2.05, 2.84, -0.8],
    [-2.05, 2.84, 0.8],
    [0, 2.84, 0.8],
    [2.05, 2.84, 0.8],
    [-2.05, 2.84, 2.4],
    [0, 2.84, 2.4],
    [2.05, 2.84, 2.4],
  ] as readonly RoomVec3[],
  materials: {
    walls: "warm cream-to-taupe matte plaster",
    floor: "glossy light-beige large-format porcelain tile",
    wood: "dark walnut with restrained grain",
    bed: "dark charcoal upholstered horizontal-channel headboard",
    bedding: "mid-grey cotton bedding",
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
