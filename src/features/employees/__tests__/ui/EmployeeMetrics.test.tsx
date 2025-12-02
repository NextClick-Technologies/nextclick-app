/**
 * Tests for EmployeeMetrics Component
 */

import { render, screen } from "@testing-library/react";
import { EmployeeMetrics } from "../../ui/components/EmployeeMetrics";
import {
  mockEmployee,
  mockEmployee2,
} from "@/__tests__/fixtures/employee.fixtures";
import { EmployeeStatus } from "../../domain/types";

describe("EmployeeMetrics", () => {
  const mockEmployees = [mockEmployee, mockEmployee2];

  it("should render all metric cards", () => {
    render(
      <EmployeeMetrics
        employees={mockEmployees}
        totalEmployees={2}
        isLoading={false}
      />
    );

    expect(screen.getByText("Total Employees")).toBeInTheDocument();
    expect(screen.getByText("Active Employees")).toBeInTheDocument();
  });

  it("should display correct total employees count", () => {
    render(
      <EmployeeMetrics
        employees={mockEmployees}
        totalEmployees={15}
        isLoading={false}
      />
    );

    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("should calculate active employees correctly", () => {
    const employees = [
      { ...mockEmployee, status: EmployeeStatus.ACTIVE },
      { ...mockEmployee2, status: EmployeeStatus.INACTIVE },
    ];

    render(
      <EmployeeMetrics
        employees={employees}
        totalEmployees={2}
        isLoading={false}
      />
    );

    const activeCount = screen.getAllByText("1");
    expect(activeCount.length).toBeGreaterThan(0);
  });

  it("should show loading state", () => {
    const { container } = render(
      <EmployeeMetrics employees={[]} totalEmployees={0} isLoading={true} />
    );

    const loadingElements = container.querySelectorAll(".animate-pulse");
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("should handle empty employees array", () => {
    render(
      <EmployeeMetrics employees={[]} totalEmployees={0} isLoading={false} />
    );

    expect(screen.getByText("Total Employees")).toBeInTheDocument();
    expect(screen.getByText("Active Employees")).toBeInTheDocument();
  });
});
