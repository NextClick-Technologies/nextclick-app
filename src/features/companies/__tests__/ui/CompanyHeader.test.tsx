/**
 * Tests for CompanyHeader Component
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanyHeader } from "../../ui/components/CompanyHeader";

describe("CompanyHeader", () => {
  it("should render heading and description", () => {
    const mockOnAddClick = jest.fn();
    render(<CompanyHeader onAddClick={mockOnAddClick} />);

    expect(screen.getByText("Company Management")).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your company database and information/i)
    ).toBeInTheDocument();
  });

  it("should call onAddClick when add button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnAddClick = jest.fn();
    render(<CompanyHeader onAddClick={mockOnAddClick} />);

    await user.click(screen.getByRole("button", { name: /add new company/i }));

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});
