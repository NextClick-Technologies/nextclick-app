/**
 * Tests for DeleteEmployeeDialog
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteEmployeeDialog } from "../../ui/components/[employee-detail-page]/DeleteEmployeeDialog";

describe("DeleteEmployeeDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog when open", () => {
    render(
      <DeleteEmployeeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employeeName="John Doe"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(
      screen.getByRole("heading", { name: /delete employee/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
  });

  it("should call onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteEmployeeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employeeName="John Doe"
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
      <DeleteEmployeeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employeeName="John Doe"
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
      <DeleteEmployeeDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        employeeName="John Doe"
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
