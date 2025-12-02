/**
 * Tests for EmployeeHeader Component
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeHeader } from "../../ui/components/EmployeeHeader";

describe("EmployeeHeader", () => {
  it("should render heading and description", () => {
    const mockOnAddClick = jest.fn();
    render(<EmployeeHeader onAddClick={mockOnAddClick} />);

    expect(screen.getByText("Employee Management")).toBeInTheDocument();
    expect(
      screen.getByText(/Manage your team members and track their information/i)
    ).toBeInTheDocument();
  });

  it("should call onAddClick when add button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnAddClick = jest.fn();
    render(<EmployeeHeader onAddClick={mockOnAddClick} />);

    await user.click(screen.getByRole("button", { name: /add new employee/i }));

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});
