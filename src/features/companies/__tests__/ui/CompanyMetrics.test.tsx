/**
 * Tests for CompanyMetrics Component
 */

import { render, screen } from "@testing-library/react";
import { CompanyMetrics } from "../../ui/components/CompanyMetrics";
import {
  mockCompany,
  mockCompany2,
} from "@/__tests__/fixtures/company.fixtures";

describe("CompanyMetrics", () => {
  const mockCompanies = [mockCompany, mockCompany2];

  it("should render all metric cards", () => {
    render(
      <CompanyMetrics
        companies={mockCompanies}
        totalCompanies={2}
        isLoading={false}
      />
    );

    expect(screen.getByText("Total Companies")).toBeInTheDocument();
    expect(screen.getByText("Active Companies")).toBeInTheDocument();
  });

  it("should display correct total companies count", () => {
    render(
      <CompanyMetrics
        companies={mockCompanies}
        totalCompanies={10}
        isLoading={false}
      />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should calculate active companies correctly", () => {
    const companies = [
      { ...mockCompany, status: "active" },
      { ...mockCompany2, status: "inactive" },
    ];

    render(
      <CompanyMetrics
        companies={companies}
        totalCompanies={2}
        isLoading={false}
      />
    );

    const activeCount = screen.getAllByText("1");
    expect(activeCount.length).toBeGreaterThan(0);
  });

  it("should show loading state", () => {
    const { container } = render(
      <CompanyMetrics companies={[]} totalCompanies={0} isLoading={true} />
    );

    const loadingElements = container.querySelectorAll(".animate-pulse");
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("should handle empty companies array", () => {
    render(
      <CompanyMetrics companies={[]} totalCompanies={0} isLoading={false} />
    );

    expect(screen.getByText("Total Companies")).toBeInTheDocument();
    expect(screen.getByText("Active Companies")).toBeInTheDocument();
  });
});
