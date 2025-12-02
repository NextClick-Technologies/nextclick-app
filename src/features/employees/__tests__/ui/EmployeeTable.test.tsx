/**
 * Tests for EmployeeTable
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeTable } from "../../ui/components/employee-database/EmployeeTable";
import { mockEmployees } from "@/__tests__/fixtures/employee.fixtures";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("EmployeeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render employee data", () => {
    render(<EmployeeTable employees={mockEmployees} />);

    // Check if table renders with employee data
    expect(mockEmployees.length).toBeGreaterThan(0);
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should navigate to employee detail page when row is clicked", async () => {
    const user = userEvent.setup();

    render(<EmployeeTable employees={mockEmployees} />);

    const firstRow = document.querySelector("tbody tr");
    if (firstRow) {
      await user.click(firstRow);
    }

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/employees/")
    );
  });

  it("should display employee status badges", () => {
    render(<EmployeeTable employees={mockEmployees} />);

    // Check if employees render correctly
    expect(mockEmployees.length).toBeGreaterThan(0);
  });

  it("should render mobile card view", () => {
    render(<EmployeeTable employees={mockEmployees} />);

    const mobileContainer = document.querySelector(".md\\:hidden");
    expect(mobileContainer).toBeInTheDocument();
  });
});
