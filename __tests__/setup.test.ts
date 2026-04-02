// Smoke test to verify vitest + jsdom setup is working
import { describe, it, expect } from "vitest";

describe("Test setup", () => {
  it("runs in jsdom environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("has jest-dom matchers available", () => {
    const el = document.createElement("div");
    el.textContent = "hello";
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
    document.body.removeChild(el);
  });
});
