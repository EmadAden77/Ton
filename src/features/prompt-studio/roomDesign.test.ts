import { describe, expect, it } from "vitest";

import {
  BEDROOM_DESIGN,
  bedToRugClearance,
  bedToWardrobeClearance,
  rugToRightStorageClearance,
} from "./roomDesign";

describe("engineered bedroom design", () => {
  it("locks one deliberate spacious master-bedroom envelope", () => {
    expect(BEDROOM_DESIGN.dimensions).toEqual({
      width: 6.4,
      depth: 7.2,
      height: 3,
    });
    expect(BEDROOM_DESIGN.door.width).toBe(0.9);
    expect(BEDROOM_DESIGN.bed.mattressWidth).toBe(1.8);
    expect(BEDROOM_DESIGN.bed.mattressLength).toBe(2);
    expect(BEDROOM_DESIGN.bed.mattressThickness).toBe(0.26);
    expect(BEDROOM_DESIGN.bed.mattressTopHeight).toBe(0.54);
    expect(BEDROOM_DESIGN.bed.headboardThickness).toBe(0.1);
  });

  it("locks the user-provided bedroom photo as the canonical visual reference", () => {
    expect(BEDROOM_DESIGN.reference.imagePath).toBe(
      "/references/fixed-bedroom-reference.webp",
    );
    expect(BEDROOM_DESIGN.reference.imageWidth).toBe(752);
    expect(BEDROOM_DESIGN.reference.imageHeight).toBe(1337);
    expect(BEDROOM_DESIGN.reference.frame).toEqual({
      front: "entrance and camera end",
      back: "full blackout-curtain wall",
      left: "bed, headboard, nightstand, and split AC",
      right: "built-in wardrobe mirrors and separate dresser",
    });
    expect(BEDROOM_DESIGN.reference.matchPriorities).toEqual([
      "bed scale and left-wall projection",
      "broad central-front rug placement",
      "long rear-to-middle right-wall wardrobe run",
      "separate front-right dresser mass",
      "single compact chair centered near the back curtains",
    ]);
  });

  it("locks a portrait entrance-view camera that frames the curtain wall tightly", () => {
    const { reference, curtains, bounds, dimensions } = BEDROOM_DESIGN;
    const camera = reference.viewerCamera;
    const aspect = reference.imageWidth / reference.imageHeight;
    const curtainDistance = camera.position[2] - curtains.center[2];
    const verticalHalfAngle = (camera.fov * Math.PI) / 360;
    const framedWidthAtCurtains =
      2 * curtainDistance * Math.tan(verticalHalfAngle) * aspect;

    expect(camera).toEqual({
      position: [0.38, 1.58, 3.34],
      target: [0.02, 1.2, -1.3],
      fov: 73,
      near: 0.08,
      far: 30,
    });
    expect(aspect).toBeCloseTo(9 / 16, 2);
    expect(camera.position[2]).toBeLessThan(bounds.frontZ);
    expect(camera.position[2]).toBeGreaterThan(camera.target[2]);
    expect(camera.position[1]).toBeGreaterThan(camera.target[1]);
    expect(framedWidthAtCurtains).toBeGreaterThan(curtains.width);
    expect(framedWidthAtCurtains).toBeLessThan(dimensions.width + 0.2);
  });

  it("matches the main furniture masses to the canonical entrance-view reference", () => {
    expect(BEDROOM_DESIGN.bed.center).toEqual([-2, 0.28, -1]);
    expect(BEDROOM_DESIGN.wardrobe.runLength).toBe(4.45);
    expect(BEDROOM_DESIGN.wardrobe.height).toBe(2.68);
    expect(BEDROOM_DESIGN.dresser).toMatchObject({
      depth: 0.58,
      widthAlongWall: 1.45,
      height: 1.05,
      center: [2.9, 0.525, 2.45],
    });
    expect(BEDROOM_DESIGN.chair).toMatchObject({
      width: 0.68,
      depth: 0.68,
      center: [0.25, 0, -2.78],
    });
    expect(BEDROOM_DESIGN.rug).toMatchObject({
      width: 2.4,
      depth: 3,
      center: [0.8, 0.02, 1],
    });
  });

  it("keeps a genuinely broad real aisle between the bed and right-wall storage", () => {
    expect(bedToWardrobeClearance()).toBeGreaterThan(3.4);
  });

  it("keeps the area rug physically separate from both bed and right-side furniture", () => {
    expect(bedToRugClearance()).toBeGreaterThan(0.5);
    expect(rugToRightStorageClearance()).toBeGreaterThan(0.6);
  });

  it("keeps every recessed spotlight inside the enlarged room envelope", () => {
    expect(BEDROOM_DESIGN.ceilingSpots).toHaveLength(12);

    for (const [x, y, z] of BEDROOM_DESIGN.ceilingSpots) {
      expect(x).toBeGreaterThan(BEDROOM_DESIGN.bounds.leftX);
      expect(x).toBeLessThan(BEDROOM_DESIGN.bounds.rightX);
      expect(z).toBeGreaterThan(BEDROOM_DESIGN.bounds.backZ);
      expect(z).toBeLessThan(BEDROOM_DESIGN.bounds.frontZ);
      expect(y).toBeLessThan(BEDROOM_DESIGN.dimensions.height);
    }
  });

  it("keeps the wardrobe and dresser as separate right-wall volumes", () => {
    const wardrobeFront =
      BEDROOM_DESIGN.bounds.rightX - BEDROOM_DESIGN.wardrobe.depth;
    const dresserFront =
      BEDROOM_DESIGN.bounds.rightX - BEDROOM_DESIGN.dresser.depth;

    expect(wardrobeFront).toBeGreaterThan(2.5);
    expect(dresserFront).toBeGreaterThan(2.5);
    expect(BEDROOM_DESIGN.wardrobe.center[2]).toBeLessThan(
      BEDROOM_DESIGN.dresser.center[2],
    );
  });
});
