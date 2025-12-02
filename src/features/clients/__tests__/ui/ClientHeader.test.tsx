/**
 * Tests for ClientHeader Component
 * Tests rendering and user interactions
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientHeader } from "../../ui/components/ClientHeader";

describe("ClientHeader", () => {
  it("should render heading and description", () => {
    const mockOnAddClick = jest.fn();
    render(<ClientHeader onAddClick={mockOnAddClick} />);

    expect(screen.getByText("Client Management")).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your clients and track their projects/i)
    ).toBeInTheDocument();
  });

  it("should render add button", () => {
    const mockOnAddClick = jest.fn();
    render(<ClientHeader onAddClick={mockOnAddClick} />);

    expect(
      screen.getByRole("button", { name: /add new client/i })
    ).toBeInTheDocument();
  });

  it("should call onAddClick when button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnAddClick = jest.fn();
    render(<ClientHeader onAddClick={mockOnAddClick} />);

    const addButton = screen.getByRole("button", { name: /add new client/i });
    await user.click(addButton);

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});
