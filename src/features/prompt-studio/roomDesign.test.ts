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
