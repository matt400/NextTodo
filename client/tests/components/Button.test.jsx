import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/Button";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Button Component", () => {
  it("should display the correct text (inner)", () => {
    render(<Button inner="Click me" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("should call onClick function when clicked", () => {
    const handleClick = vi.fn();
    render(<Button inner="Test" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /test/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should navigate to the provided path (to) when clicked", () => {
    render(<Button inner="Go to" to="/home" />);

    const button = screen.getByRole("button", { name: /go to/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("should call both functions if both onClick and to are provided", () => {
    const handleClick = vi.fn();
    render(<Button inner="Both" onClick={handleClick} to="/profile" />);

    const button = screen.getByRole("button", { name: /both/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });
});
