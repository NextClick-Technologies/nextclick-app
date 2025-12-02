/**
 * Tests for EmployeeFilters
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeFilters } from "../../ui/components/employee-database/EmployeeFilters";

describe("EmployeeFilters", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    searchQuery: "",
    onSearchChange: mockOnSearchChange,
    statusFilter: "all",
    onStatusChange: mockOnStatusChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input with placeholder", () => {
    render(<EmployeeFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search employees...")
    ).toBeInTheDocument();
  });

  it("should call onSearchChange when typing in search input", async () => {
    const user = userEvent.setup();

    render(<EmployeeFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search employees...");
    await user.type(searchInput, "test employee");

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it("should display current search query value", () => {
    render(<EmployeeFilters {...defaultProps} searchQuery="existing query" />);

    const searchInput = screen.getByPlaceholderText(
      "Search employees..."
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("existing query");
  });

  it("should render status filter select", () => {
    render(<EmployeeFilters {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
