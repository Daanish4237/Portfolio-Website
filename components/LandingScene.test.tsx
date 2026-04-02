import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingScene from "./LandingScene";

describe("LandingScene", () => {
  it("renders the developer title text", () => {
    render(<LandingScene onEnter={vi.fn()} />);
    expect(screen.getByText("John Developer")).toBeInTheDocument();
  });

  it('renders the "Enter Universe" button', () => {
    render(<LandingScene onEnter={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /enter universe/i })
    ).toBeInTheDocument();
  });

  it("calls onEnter when the button is clicked", () => {
    const onEnter = vi.fn();
    render(<LandingScene onEnter={onEnter} />);
    fireEvent.click(screen.getByRole("button", { name: /enter universe/i }));
    expect(onEnter).toHaveBeenCalledTimes(1);
  });
});
