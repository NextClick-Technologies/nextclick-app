/**
 * Tests for CompanyDatabase
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanyDatabase } from "../../ui/components/company-database/CompanyDatabase";
import { mockCompanies } from "@/__tests__/fixtures/company.fixtures";

// Mock child components
jest.mock("../../ui/components/company-database/CompanyTable", () => ({
  CompanyTable: ({ companies }: any) => (
    <div data-testid="company-table">{companies.length} companies</div>
  ),
}));

jest.mock("../../ui/components/company-database/CompanyFilters", () => ({
  CompanyFilters: ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
  }: any) => (
    <div data-testid="company-filters">
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
      </select>
    </div>
  ),
}));

describe("CompanyDatabase", () => {
  const mockOnAddClick = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    companies: mockCompanies,
    searchQuery: "",
    onSearchChange: mockOnSearchChange,
    statusFilter: "all",
    onStatusChange: mockOnStatusChange,
    isLoading: false,
    error: null,
    onAddClick: mockOnAddClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render database heading", () => {
    render(<CompanyDatabase {...defaultProps} />);

    expect(screen.getByText("Company Database")).toBeInTheDocument();
  });

  it("should render add button and call onAddClick when clicked", async () => {
    const user = userEvent.setup();

    render(<CompanyDatabase {...defaultProps} />);

    const addButtons = screen.getAllByRole("button", {
      name: /add new company/i,
    });
    await user.click(addButtons[0]);

    expect(mockOnAddClick).toHaveBeenCalled();
  });

  it("should render filters", () => {
    render(<CompanyDatabase {...defaultProps} />);

    expect(screen.getByTestId("company-filters")).toBeInTheDocument();
  });

  it("should render table when not loading and no error", () => {
    render(<CompanyDatabase {...defaultProps} />);

    expect(screen.getByTestId("company-table")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<CompanyDatabase {...defaultProps} isLoading={true} />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should show error message when error is present", () => {
    const error = new Error("Failed to load companies");

    render(<CompanyDatabase {...defaultProps} error={error} />);

    expect(screen.getByText(/Error loading companies/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load companies/)).toBeInTheDocument();
  });

  it("should show empty state when no companies", () => {
    render(<CompanyDatabase {...defaultProps} companies={[]} />);

    expect(screen.getByText("No companies found")).toBeInTheDocument();
  });

  it("should call onSearchChange when search input changes", async () => {
    const user = userEvent.setup();

    render(<CompanyDatabase {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search");
    await user.type(searchInput, "test");

    expect(mockOnSearchChange).toHaveBeenCalled();
  });
});
