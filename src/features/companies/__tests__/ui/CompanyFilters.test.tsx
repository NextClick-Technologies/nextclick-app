/**
 * Tests for CompanyFilters
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanyFilters } from "../../ui/components/company-database/CompanyFilters";

describe("CompanyFilters", () => {
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
    render(<CompanyFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search companies...")
    ).toBeInTheDocument();
  });

  it("should render search icon", () => {
    render(<CompanyFilters {...defaultProps} />);

    const searchIcon = document.querySelector("svg");
    expect(searchIcon).toBeInTheDocument();
  });

  it("should call onSearchChange when typing in search input", async () => {
    const user = userEvent.setup();

    render(<CompanyFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search companies...");
    await user.type(searchInput, "test company");

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it("should display current search query value", () => {
    render(<CompanyFilters {...defaultProps} searchQuery="existing query" />);

    const searchInput = screen.getByPlaceholderText(
      "Search companies..."
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("existing query");
  });

  it("should render status filter select", () => {
    render(<CompanyFilters {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
