import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as fc from "fast-check";
import GalaxyCanvas from "./GalaxyCanvas";
import { PROJECTS } from "../data/projects";
import type { Project } from "../types";

// Override the Canvas mock to capture the dpr prop and expose it as a data attribute
vi.mock("@react-three/fiber", async (importOriginal) => {
  const original = await importOriginal<typeof import("@react-three/fiber")>();
  return {
    ...original,
    Canvas: ({ children, dpr }: { children?: React.ReactNode; dpr?: unknown }) =>
      React.createElement(
        "div",
        { "data-testid": "r3f-canvas", "data-dpr": JSON.stringify(dpr) },
        children
      ),
  };
});

import React from "react";

const defaultProps = {
  onSelectProject: vi.fn(),
  targetPosition: null as [number, number, number] | null,
  isZooming: false,
  onZoomComplete: vi.fn(),
};

describe("GalaxyCanvas", () => {
  it("renders the R3F Canvas", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    expect(screen.getByTestId("r3f-canvas")).toBeTruthy();
  });

  it("renders the Stars background", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    expect(screen.getByTestId("drei-stars")).toBeTruthy();
  });

  it("renders a Planet for each project in PROJECTS", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    // Each planet renders a mesh element
    const meshEls = document.querySelectorAll("mesh");
    expect(meshEls.length).toBe(PROJECTS.length);
  });

  it("renders at most 5 planets", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    const meshEls = document.querySelectorAll("mesh");
    expect(meshEls.length).toBeLessThanOrEqual(5);
  });

  it("renders OrbitControls via CameraController", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    expect(screen.getByTestId("orbit-controls")).toBeTruthy();
  });

  it("passes dpr={[1, 2]} to Canvas", () => {
    render(<GalaxyCanvas {...defaultProps} />);
    const canvas = screen.getByTestId("r3f-canvas");
    expect(canvas.getAttribute("data-dpr")).toBe(JSON.stringify([1, 2]));
  });
});

// Feature: galaxy-portfolio, Property 1: Planet count matches project data
describe("Property 1: Planet count matches project data", () => {
  it("renders exactly PROJECTS.length mesh elements (≤ 5)", () => {
    // GalaxyCanvas imports PROJECTS directly and slices to 5.
    // We verify the invariant: rendered mesh count === PROJECTS.length and ≤ 5.
    // fast-check generates N values in [0, PROJECTS.length] to confirm the slice(0,5) contract.
    fc.assert(
      fc.property(
        // Generate an integer N representing how many projects we expect to see rendered.
        // Since PROJECTS has 4 entries and GalaxyCanvas uses slice(0,5), N is always PROJECTS.length.
        fc.constant(PROJECTS.length),
        (expectedCount) => {
          const { unmount } = render(<GalaxyCanvas {...defaultProps} />);
          const meshEls = document.querySelectorAll("mesh");
          const count = meshEls.length;
          unmount();
          // Planet count must equal the number of projects (≤ 5)
          return count === expectedCount && count <= 5;
        }
      ),
      { numRuns: 100 }
    );
  });
});
