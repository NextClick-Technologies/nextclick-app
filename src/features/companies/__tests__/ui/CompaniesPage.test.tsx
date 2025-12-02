/**
 * Tests for CompaniesPage
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createWrapper } from "@/__tests__/utils/test-utils";
import CompaniesPage from "../../ui/pages/CompaniesPage";
import { mockCompanies } from "@/__tests__/fixtures/company.fixtures";

jest.mock("../../ui/hooks/useCompany", () => ({
  useCompanies: jest.fn(),
  useCreateCompany: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useUpdateCompany: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useDeleteCompany: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
}));

jest.mock("@/shared/components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("../../ui/components/CompanyMetrics", () => ({
  CompanyMetrics: ({ totalCompanies, isLoading }: any) => (
    <div data-testid="company-metrics">
      {isLoading ? "Loading..." : `Total: ${totalCompanies}`}
    </div>
  ),
}));

jest.mock("../../ui/components/company-database", () => ({
  CompanyDatabase: ({ companies, onAddClick }: any) => (
    <div data-testid="company-database">
      <button onClick={onAddClick}>Add Company</button>
      <div>{companies.length} companies</div>
    </div>
  ),
}));

jest.mock("../../ui/components/add-company-dialog", () => ({
  AddCompanyDialog: ({ open }: any) =>
    open ? <div data-testid="add-dialog">Add Company Dialog</div> : null,
}));

const { useCompanies } = require("../../ui/hooks/useCompany");

describe("CompaniesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page with metrics and database", () => {
    useCompanies.mockReturnValue({
      data: {
        data: mockCompanies,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<CompaniesPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("company-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("company-database")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useCompanies.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<CompaniesPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should open add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    useCompanies.mockReturnValue({
      data: {
        data: mockCompanies,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<CompaniesPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /add company/i }));

    await waitFor(() => {
      expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    });
  });

  it("should handle empty companies list", () => {
    useCompanies.mockReturnValue({
      data: {
        data: [],
        pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
      },
      isLoading: false,
      error: null,
    });

    render(<CompaniesPage />, { wrapper: createWrapper() });

    expect(screen.getByText("0 companies")).toBeInTheDocument();
  });
});
