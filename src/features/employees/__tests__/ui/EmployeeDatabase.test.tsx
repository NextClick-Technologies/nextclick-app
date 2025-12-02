/**
 * Tests for EmployeeDatabase
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeDatabase } from "../../ui/components/employee-database/EmployeeDatabase";
import { mockEmployees } from "@/__tests__/fixtures/employee.fixtures";

// Mock child components
jest.mock("../../ui/components/employee-database/EmployeeTable", () => ({
  EmployeeTable: ({ employees }: any) => (
    <div data-testid="employee-table">{employees.length} employees</div>
  ),
}));

jest.mock("../../ui/components/employee-database/EmployeeFilters", () => ({
  EmployeeFilters: ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
  }: any) => (
    <div data-testid="employee-filters">
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

describe("EmployeeDatabase", () => {
  const mockOnAddClick = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    employees: mockEmployees,
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
    render(<EmployeeDatabase {...defaultProps} />);

    expect(screen.getByText("Employee Database")).toBeInTheDocument();
  });

  it("should render add button and call onAddClick when clicked", async () => {
    const user = userEvent.setup();

    render(<EmployeeDatabase {...defaultProps} />);

    const addButtons = screen.getAllByRole("button", {
      name: /add new employee/i,
    });
    await user.click(addButtons[0]);

    expect(mockOnAddClick).toHaveBeenCalled();
  });

  it("should render table when not loading and no error", () => {
    render(<EmployeeDatabase {...defaultProps} />);

    expect(screen.getByTestId("employee-table")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<EmployeeDatabase {...defaultProps} isLoading={true} />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should show error message when error is present", () => {
    const error = new Error("Failed to load employees");

    render(<EmployeeDatabase {...defaultProps} error={error} />);

    expect(screen.getByText(/Error loading employees/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load employees/)).toBeInTheDocument();
  });

  it("should show empty state when no employees", () => {
    render(<EmployeeDatabase {...defaultProps} employees={[]} />);

    expect(screen.getByText("No employees found")).toBeInTheDocument();
  });
});
