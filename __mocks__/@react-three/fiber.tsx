import React from "react";
import { vi } from "vitest";

export const Canvas = ({ children }: { children?: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "r3f-canvas" }, children);

export const useFrame = vi.fn();
export const useThree = vi.fn(() => ({
  camera: { position: { set: vi.fn(), lerp: vi.fn() }, lookAt: vi.fn() },
  gl: { setPixelRatio: vi.fn() },
  scene: {},
}));

export const useLoader = vi.fn();
export const extend = vi.fn();
