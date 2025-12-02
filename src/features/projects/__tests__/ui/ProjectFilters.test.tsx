/**
 * Tests for ProjectFilters
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectFilters } from "../../ui/components/project-database/ProjectFilters";

describe("ProjectFilters", () => {
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
    render(<ProjectFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search projects...")
    ).toBeInTheDocument();
  });

  it("should call onSearchChange when typing in search input", async () => {
    const user = userEvent.setup();

    render(<ProjectFilters {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search projects...");
    await user.type(searchInput, "test project");

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it("should display current search query value", () => {
    render(<ProjectFilters {...defaultProps} searchQuery="existing query" />);

    const searchInput = screen.getByPlaceholderText(
      "Search projects..."
    ) as HTMLInputElement;
    expect(searchInput.value).toBe("existing query");
  });

  it("should render status filter select", () => {
    render(<ProjectFilters {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
