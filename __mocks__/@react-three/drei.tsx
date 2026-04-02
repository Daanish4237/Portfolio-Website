import React from "react";
import { vi } from "vitest";

export const Stars = () => React.createElement("div", { "data-testid": "drei-stars" });

export const OrbitControls = ({
  enabled,
  minDistance,
  maxDistance,
}: {
  enabled?: boolean;
  minDistance?: number;
  maxDistance?: number;
}) =>
  React.createElement("div", {
    "data-testid": "orbit-controls",
    "data-enabled": String(enabled),
    "data-min-distance": minDistance,
    "data-max-distance": maxDistance,
  });

export const Html = ({ children }: { children?: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "drei-html" }, children);

export const useGLTF = vi.fn();
export const useTexture = vi.fn();
export const PerspectiveCamera = () =>
  React.createElement("div", { "data-testid": "perspective-camera" });
