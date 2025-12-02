/**
 * Tests for DeleteClientDialog
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteClientDialog } from "../../ui/components/[client-detail-page]/DeleteClientDialog";

describe("DeleteClientDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog when open", () => {
    render(
      <DeleteClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        clientName="Test Client"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(
      screen.getByRole("heading", { name: /delete client/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
  });

  it("should call onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        clientName="Test Client"
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
      <DeleteClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        clientName="Test Client"
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
      <DeleteClientDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        clientName="Test Client"
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
