import { describe, expect, it } from "vitest";

import { CURRENT_PHASE, PROJECT_NAME, getProjectStatus } from "./project-info";

describe("project foundation", () => {
  it("exposes the expected Phase 1A project metadata", () => {
    expect(PROJECT_NAME).toBe("Ton");
    expect(CURRENT_PHASE).toBe("Phase 1A");
    expect(getProjectStatus()).toBe("Phase 1A ready");
  });
});
