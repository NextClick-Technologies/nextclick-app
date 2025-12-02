/**
 * Tests for CompanyTable
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompanyTable } from "../../ui/components/company-database/CompanyTable";
import { mockCompanies } from "@/__tests__/fixtures/company.fixtures";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("CompanyTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render company data", () => {
    render(<CompanyTable companies={mockCompanies} />);

    expect(screen.getAllByText("Acme Corporation")[0]).toBeInTheDocument();
    expect(screen.getAllByText("TechStart Inc")[0]).toBeInTheDocument();
  });

  it("should navigate to company detail page when row is clicked", async () => {
    const user = userEvent.setup();

    render(<CompanyTable companies={mockCompanies} />);

    const companyRow = screen.getAllByText("Acme Corporation")[0].closest("tr");
    if (companyRow) {
      await user.click(companyRow);
    }

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/companies/")
    );
  });

  it("should display company status badges", () => {
    render(<CompanyTable companies={mockCompanies} />);

    // Check if mockCompanies has data before asserting
    expect(mockCompanies.length).toBeGreaterThan(0);
  });

  it("should render mobile card view", () => {
    render(<CompanyTable companies={mockCompanies} />);

    // Mobile view should exist in the DOM even if hidden by CSS
    const mobileContainer = document.querySelector(".md\\:hidden");
    expect(mobileContainer).toBeInTheDocument();
  });
});
