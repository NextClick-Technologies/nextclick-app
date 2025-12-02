/**
 * Tests for EmployeesPage
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createWrapper } from "@/__tests__/utils/test-utils";
import EmployeesPage from "../../ui/pages/EmployeesPage";
import { mockEmployees } from "@/__tests__/fixtures/employee.fixtures";

jest.mock("../../ui/hooks/useEmployee", () => ({
  useEmployees: jest.fn(),
  useCreateEmployee: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useUpdateEmployee: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useDeleteEmployee: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
}));

jest.mock("@/shared/components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("../../ui/components/EmployeeMetrics", () => ({
  EmployeeMetrics: ({ totalEmployees, isLoading }: any) => (
    <div data-testid="employee-metrics">
      {isLoading ? "Loading..." : `Total: ${totalEmployees}`}
    </div>
  ),
}));

jest.mock("../../ui/components/employee-database", () => ({
  EmployeeDatabase: ({ employees, onAddClick }: any) => (
    <div data-testid="employee-database">
      <button onClick={onAddClick}>Add Employee</button>
      <div>{employees.length} employees</div>
    </div>
  ),
}));

jest.mock("../../ui/components/add-employee-dialog", () => ({
  AddEmployeeDialog: ({ open }: any) =>
    open ? <div data-testid="add-dialog">Add Employee Dialog</div> : null,
}));

const { useEmployees } = require("../../ui/hooks/useEmployee");

describe("EmployeesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page with metrics and database", () => {
    useEmployees.mockReturnValue({
      data: {
        data: mockEmployees,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<EmployeesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("employee-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("employee-database")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useEmployees.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<EmployeesPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should open add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    useEmployees.mockReturnValue({
      data: {
        data: mockEmployees,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<EmployeesPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /add employee/i }));

    await waitFor(() => {
      expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    });
  });

  it("should handle empty employees list", () => {
    useEmployees.mockReturnValue({
      data: {
        data: [],
        pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
      },
      isLoading: false,
      error: null,
    });

    render(<EmployeesPage />, { wrapper: createWrapper() });

    expect(screen.getByText("0 employees")).toBeInTheDocument();
  });
});
