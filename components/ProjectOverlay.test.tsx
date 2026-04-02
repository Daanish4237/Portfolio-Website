import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import * as fc from "fast-check";
import ProjectOverlay from "./ProjectOverlay";
import type { Project } from "@/types";

// Shared arbitrary for non-blank strings
const nonBlankString = (min = 1, max = 60) =>
  fc
    .stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/)
    .filter((s) => s.trim().length >= min && s.length <= max);

// Arbitrary for a full Project object
const projectArb = fc.record({
  id: fc.uuid(),
  name: nonBlankString(1, 40),
  description: nonBlankString(1, 120),
  techStack: fc.array(nonBlankString(1, 20), { minLength: 0, maxLength: 8 }),
  links: fc.record({
    github: fc.oneof(
      fc.constant("https://github.com/user/repo"),
      fc.constant("")
    ),
    live: fc.oneof(fc.constant("https://example.com"), fc.constant("")),
  }),
  position: fc.tuple(
    fc.float({ min: -10, max: 10, noNaN: true }),
    fc.float({ min: -10, max: 10, noNaN: true }),
    fc.float({ min: -10, max: 10, noNaN: true })
  ) as fc.Arbitrary<[number, number, number]>,
  color: fc.constant("#4f46e5"),
});

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe("ProjectOverlay — unit tests", () => {
  const baseProject: Project = {
    id: "p1",
    name: "My Project",
    description: "A cool project",
    techStack: ["React", "TypeScript"],
    links: { github: "https://github.com/user/repo", live: "https://example.com" },
    position: [0, 0, 0],
    color: "#4f46e5",
  };

  it('calls onBack when "Back" button is clicked', () => {
    const onBack = vi.fn();
    render(<ProjectOverlay project={baseProject} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('"View Live" is disabled when links.live is empty', () => {
    const project = { ...baseProject, links: { ...baseProject.links, live: "" } };
    render(<ProjectOverlay project={project} onBack={vi.fn()} />);
    const btn = screen.getByRole("button", { name: /view live/i });
    expect(btn).toBeDisabled();
  });

  it('"View Code" is disabled when links.github is empty', () => {
    const project = { ...baseProject, links: { ...baseProject.links, github: "" } };
    render(<ProjectOverlay project={project} onBack={vi.fn()} />);
    const btn = screen.getByRole("button", { name: /view code/i });
    expect(btn).toBeDisabled();
  });
});

// ─── Property 5 ───────────────────────────────────────────────────────────────

// Feature: galaxy-portfolio, Property 5: Overlay content matches selected project
describe("Property 5: Overlay content matches selected project", () => {
  it("renders name, description, and links matching the project", () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        const { unmount, container } = render(
          <ProjectOverlay project={project} onBack={vi.fn()} />
        );
        const q = within(container);

        // Name rendered as h2 (use DOM query to avoid RTL whitespace normalization)
        const h2 = container.querySelector("h2");
        expect(h2?.textContent?.trim()).toBe(project.name.trim());

        // Description rendered in a <p> (RTL normalizes whitespace)
        const descEl = container.querySelector("p");
        expect(descEl?.textContent?.trim()).toBe(project.description.trim());

        // View Live: link when non-empty, disabled button when empty
        if (project.links.live !== "") {
          const link = q.getByRole("link", { name: /view live/i });
          expect(link).toHaveAttribute("href", project.links.live);
        } else {
          expect(q.getByRole("button", { name: /view live/i })).toBeDisabled();
        }

        // View Code: link when non-empty, disabled button when empty
        if (project.links.github !== "") {
          const link = q.getByRole("link", { name: /view code/i });
          expect(link).toHaveAttribute("href", project.links.github);
        } else {
          expect(q.getByRole("button", { name: /view code/i })).toBeDisabled();
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 8 ───────────────────────────────────────────────────────────────

// Feature: galaxy-portfolio, Property 8: Tech stack tags render one tag per entry
describe("Property 8: Tech stack tags render one tag per entry", () => {
  it("renders exactly N role=listitem elements for a techStack of length N", () => {
    const techStackArb = fc.record({
      id: fc.constant("p-tech"),
      name: fc.constant("Tech Project"),
      description: fc.constant("desc"),
      techStack: fc.array(nonBlankString(1, 20), { minLength: 0, maxLength: 10 }),
      links: fc.record({
        github: fc.constant("https://github.com/x"),
        live: fc.constant("https://x.com"),
      }),
      position: fc.constant([0, 0, 0] as [number, number, number]),
      color: fc.constant("#000000"),
    });

    fc.assert(
      fc.property(techStackArb, (project) => {
        const { unmount, container } = render(
          <ProjectOverlay project={project} onBack={vi.fn()} />
        );

        const tags = within(container).queryAllByRole("listitem");
        expect(tags).toHaveLength(project.techStack.length);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("renders zero tags when techStack is empty", () => {
    const project: Project = {
      id: "empty",
      name: "Empty Stack",
      description: "No tech",
      techStack: [],
      links: { github: "", live: "" },
      position: [0, 0, 0],
      color: "#000",
    };
    render(<ProjectOverlay project={project} onBack={vi.fn()} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
