import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as fc from "fast-check";
import Planet from "./Planet";
import type { Project } from "../types";

const mockProject: Project = {
  id: "test-1",
  name: "Test Planet",
  description: "A test project",
  techStack: ["React", "TypeScript"],
  links: { github: "https://github.com/test", live: "https://test.com" },
  position: [0, 0, 0],
  color: "#ff0000",
};

describe("Planet", () => {
  it("renders a mesh at the project position", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Planet project={mockProject} onSelect={onSelect} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("does not show label when not hovered", () => {
    const onSelect = vi.fn();
    render(<Planet project={mockProject} onSelect={onSelect} />);
    expect(screen.queryByTestId("drei-html")).toBeNull();
  });

  it("shows project name label when hovered", () => {
    const onSelect = vi.fn();
    render(<Planet project={mockProject} onSelect={onSelect} />);

    const meshEl = document.querySelector("mesh");
    expect(meshEl).toBeTruthy();
    fireEvent.pointerOver(meshEl!);
    expect(screen.queryByText("Test Planet")).toBeTruthy();
  });

  it("calls onSelect with the project when clicked", () => {
    const onSelect = vi.fn();
    render(<Planet project={mockProject} onSelect={onSelect} />);

    const meshEl = document.querySelector("mesh");
    if (meshEl) {
      fireEvent.click(meshEl);
    }
    expect(onSelect).toHaveBeenCalledWith(mockProject);
  });

  it("hides label after pointerOut", () => {
    const onSelect = vi.fn();
    render(<Planet project={mockProject} onSelect={onSelect} />);

    const meshEl = document.querySelector("mesh");
    if (meshEl) {
      fireEvent.pointerOver(meshEl);
      expect(screen.queryByText("Test Planet")).toBeTruthy();
      fireEvent.pointerOut(meshEl);
      expect(screen.queryByText("Test Planet")).toBeNull();
    }
  });
});

// Feature: galaxy-portfolio, Property 4: Hover state is exclusive
describe("Property 4: Hover state is exclusive", () => {
  it("hovering one planet does not show labels for other planets", () => {
    const makeProject = (i: number): Project => ({
      id: `proj-${i}`,
      name: `Planet ${i}`,
      description: "desc",
      techStack: ["React"],
      links: { github: "https://github.com/x", live: "https://x.com" },
      position: [i * 5, 0, 0],
      color: "#ffffff",
    });

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4 }),
        fc.integer({ min: 2, max: 5 }),
        (hoveredIndex, totalPlanets) => {
          const clampedIndex = hoveredIndex % totalPlanets;
          const projects = Array.from({ length: totalPlanets }, (_, i) =>
            makeProject(i)
          );

          const { unmount } = render(
            <>
              {projects.map((p) => (
                <Planet key={p.id} project={p} onSelect={vi.fn()} />
              ))}
            </>
          );

          const meshEls = document.querySelectorAll("mesh");
          // Hover only the target planet
          fireEvent.pointerOver(meshEls[clampedIndex]);

          // Only the hovered planet's label should be visible
          projects.forEach((p, i) => {
            if (i === clampedIndex) {
              expect(screen.queryByText(p.name)).toBeTruthy();
            } else {
              expect(screen.queryByText(p.name)).toBeNull();
            }
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: galaxy-portfolio, Property 3.4: Hover off restores state
describe("Property 3.4: Hover off restores state", () => {
  it("label disappears after hover then un-hover for any project", () => {
    // Use alphanumeric strings to avoid whitespace-only names that RTL can't query
    const nonBlankString = (min = 1, max = 40) =>
      fc
        .stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/)
        .filter((s) => s.trim().length >= min && s.length <= max);

    const projectArb = fc.record({
      id: fc.uuid(),
      name: nonBlankString(1, 40),
      description: nonBlankString(1, 100),
      techStack: fc.array(nonBlankString(1, 20), {
        minLength: 1,
        maxLength: 5,
      }),
      links: fc.record({
        github: fc.constant("https://github.com/test"),
        live: fc.constant("https://example.com"),
      }),
      position: fc.tuple(
        fc.float({ min: -10, max: 10, noNaN: true }),
        fc.float({ min: -10, max: 10, noNaN: true }),
        fc.float({ min: -10, max: 10, noNaN: true })
      ) as fc.Arbitrary<[number, number, number]>,
      color: fc.constant("#ff0000"),
    });

    fc.assert(
      fc.property(projectArb, (project) => {
        const { unmount, container } = render(
          <Planet project={project} onSelect={vi.fn()} />
        );

        const meshEl = container.querySelector("mesh");
        expect(meshEl).toBeTruthy();

        // Hover — label should appear
        fireEvent.pointerOver(meshEl!);
        expect(container.querySelector("[data-testid='drei-html']")).toBeTruthy();

        // Un-hover — label should disappear (scale/emissive restored)
        fireEvent.pointerOut(meshEl!);
        expect(container.querySelector("[data-testid='drei-html']")).toBeNull();

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
