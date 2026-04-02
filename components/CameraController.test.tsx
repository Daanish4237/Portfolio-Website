import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as fc from "fast-check";
import CameraController from "./CameraController";

const noop = vi.fn();

describe("CameraController", () => {
  it("disables OrbitControls when isZooming=true", () => {
    render(
      <CameraController
        targetPosition={[0, 0, 0]}
        isZooming={true}
        onZoomComplete={noop}
      />
    );
    const controls = screen.getByTestId("orbit-controls");
    expect(controls.getAttribute("data-enabled")).toBe("false");
  });

  it("enables OrbitControls when isZooming=false", () => {
    render(
      <CameraController
        targetPosition={null}
        isZooming={false}
        onZoomComplete={noop}
      />
    );
    const controls = screen.getByTestId("orbit-controls");
    expect(controls.getAttribute("data-enabled")).toBe("true");
  });

  it("passes minDistance=5 and maxDistance=40 to OrbitControls", () => {
    render(
      <CameraController
        targetPosition={null}
        isZooming={false}
        onZoomComplete={noop}
      />
    );
    const controls = screen.getByTestId("orbit-controls");
    expect(controls.getAttribute("data-min-distance")).toBe("5");
    expect(controls.getAttribute("data-max-distance")).toBe("40");
  });
});

// Feature: galaxy-portfolio, Property 6: OrbitControls disabled during zoom
describe("Property 6: OrbitControls disabled during zoom", () => {
  it("OrbitControls enabled prop equals !isZooming for any boolean isZooming", () => {
    fc.assert(
      fc.property(fc.boolean(), (isZooming) => {
        const { unmount } = render(
          <CameraController
            targetPosition={isZooming ? [1, 2, 3] : null}
            isZooming={isZooming}
            onZoomComplete={noop}
          />
        );
        const controls = screen.getByTestId("orbit-controls");
        const enabled = controls.getAttribute("data-enabled");
        expect(enabled).toBe(String(!isZooming));
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
