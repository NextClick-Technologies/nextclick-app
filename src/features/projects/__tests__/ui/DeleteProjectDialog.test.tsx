/**
 * Tests for DeleteProjectDialog
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteProjectDialog } from "../../ui/components/[project-detail-page]/DeleteProjectDialog";

describe("DeleteProjectDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog when open", () => {
    render(
      <DeleteProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        projectName="Website Redesign"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(screen.getByText("Delete Project")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
    expect(screen.getByText(/"Website Redesign"/)).toBeInTheDocument();
  });

  it("should call onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        projectName="Website Redesign"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("should call onConfirm when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        projectName="Website Redesign"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("should disable buttons when deleting", () => {
    render(
      <DeleteProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        projectName="Website Redesign"
        onConfirm={mockOnConfirm}
        isDeleting={true}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
