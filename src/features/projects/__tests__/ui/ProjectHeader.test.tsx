/**
 * Tests for ProjectHeader Component
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectHeader } from "../../ui/components/ProjectHeader";

describe("ProjectHeader", () => {
  it("should render heading and description", () => {
    const mockOnAddClick = jest.fn();
    render(<ProjectHeader onAddClick={mockOnAddClick} />);

    expect(screen.getByText("Project Management")).toBeInTheDocument();
    expect(
      screen.getByText(/Manage and track all your projects/i)
    ).toBeInTheDocument();
  });

  it("should call onAddClick when add button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnAddClick = jest.fn();
    render(<ProjectHeader onAddClick={mockOnAddClick} />);

    await user.click(screen.getByRole("button", { name: /add new project/i }));

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});
