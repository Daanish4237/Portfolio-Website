// Verify that @react-three/fiber and @react-three/drei mocks load correctly
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";

describe("R3F mocks", () => {
  it("Canvas renders without WebGL", () => {
    const { getByTestId } = render(<Canvas />);
    expect(getByTestId("r3f-canvas")).toBeInTheDocument();
  });

  it("Stars renders as stub", () => {
    const { getByTestId } = render(<Stars />);
    expect(getByTestId("drei-stars")).toBeInTheDocument();
  });

  it("OrbitControls renders with props", () => {
    const { getByTestId } = render(
      <OrbitControls enabled={false} minDistance={5} maxDistance={40} />
    );
    const el = getByTestId("orbit-controls");
    expect(el).toHaveAttribute("data-enabled", "false");
    expect(el).toHaveAttribute("data-min-distance", "5");
    expect(el).toHaveAttribute("data-max-distance", "40");
  });

  it("Html renders children", () => {
    const { getByText } = render(<Html><span>label</span></Html>);
    expect(getByText("label")).toBeInTheDocument();
  });

  it("useFrame is a mock function", () => {
    expect(typeof useFrame).toBe("function");
  });
});
