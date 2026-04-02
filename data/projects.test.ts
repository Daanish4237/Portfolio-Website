import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { PROJECTS } from "./projects";

describe("Project data integrity", () => {
  // Feature: galaxy-portfolio, Property 2: Planet derives all properties from Project data
  it("Property 2: all required fields are present, positions are finite, links are non-empty", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: PROJECTS.length - 1 }),
        (index) => {
          const project = PROJECTS[index];

          // Required string fields
          expect(typeof project.id).toBe("string");
          expect(project.id.length).toBeGreaterThan(0);
          expect(typeof project.name).toBe("string");
          expect(project.name.length).toBeGreaterThan(0);
          expect(typeof project.description).toBe("string");
          expect(project.description.length).toBeGreaterThan(0);
          expect(typeof project.color).toBe("string");
          expect(project.color.length).toBeGreaterThan(0);

          // Tech stack is an array of strings
          expect(Array.isArray(project.techStack)).toBe(true);
          project.techStack.forEach((tech) => {
            expect(typeof tech).toBe("string");
          });

          // Position is a tuple of 3 finite numbers
          expect(Array.isArray(project.position)).toBe(true);
          expect(project.position).toHaveLength(3);
          project.position.forEach((coord) => {
            expect(typeof coord).toBe("number");
            expect(Number.isFinite(coord)).toBe(true);
          });

          // Links are non-empty strings
          expect(typeof project.links.github).toBe("string");
          expect(project.links.github.length).toBeGreaterThan(0);
          expect(typeof project.links.live).toBe("string");
          expect(project.links.live.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: galaxy-portfolio, Property 3: Project data round-trip integrity
  it("Property 3: JSON round-trip produces deeply equal objects", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: PROJECTS.length - 1 }),
        (index) => {
          const original = PROJECTS[index];
          const roundTripped = JSON.parse(JSON.stringify(original));
          expect(roundTripped).toEqual(original);
        }
      ),
      { numRuns: 100 }
    );
  });
});
