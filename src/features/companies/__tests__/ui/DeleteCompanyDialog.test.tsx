/**
 * Tests for DeleteCompanyDialog
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteCompanyDialog } from "../../ui/components/[company-detail-page]/DeleteCompanyDialog";

describe("DeleteCompanyDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog when open", () => {
    render(
      <DeleteCompanyDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        companyName="Test Company"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(screen.getByText("Delete Company")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete/)
    ).toBeInTheDocument();
    expect(screen.getByText(/"Test Company"/)).toBeInTheDocument();
  });

  it("should not render dialog when closed", () => {
    render(
      <DeleteCompanyDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        companyName="Test Company"
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />
    );

    expect(screen.queryByText("Delete Company")).not.toBeInTheDocument();
  });

  it("should call onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <DeleteCompanyDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        companyName="Test Company"
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
      <DeleteCompanyDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        companyName="Test Company"
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
      <DeleteCompanyDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        companyName="Test Company"
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
