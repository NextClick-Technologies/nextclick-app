/**
 * Tests for ClientFilters
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientFilters } from "../../ui/components/client-database/ClientFilters";

describe("ClientFilters", () => {
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
    render(<ClientFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search clients...")
    ).toBeInTheDocument();
  });

  it("should call onSearchChange when typing in search input", async () => {
    const user = userEvent.setup();

    render(<ClientFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search clients...");
    await user.type(searchInput, "test client");

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it("should display current search query value", () => {
    render(<ClientFilters {...defaultProps} searchQuery="existing query" />);

    const searchInput = screen.getByPlaceholderText(
      "Search clients..."
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("existing query");
  });

  it("should render status filter select", () => {
    render(<ClientFilters {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
