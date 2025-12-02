/**
 * Tests for ClientsPage
 * Tests page component integration and user flows
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createWrapper } from "@/__tests__/utils/test-utils";
import ClientsPage from "../../ui/pages/ClientsPage";
import { mockClients } from "@/__tests__/fixtures/client.fixtures";

// Mock the useClients hook
jest.mock("../../ui/hooks/useClient", () => ({
  useClients: jest.fn(),
}));

// Mock AppLayout
jest.mock("@/shared/components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock child components
jest.mock("../../ui/components", () => ({
  ClientMetrics: ({ totalClients, isLoading }: any) => (
    <div data-testid="client-metrics">
      {isLoading ? "Loading..." : `Total: ${totalClients}`}
    </div>
  ),
  ClientDatabase: ({
    clients,
    onAddClick,
    searchQuery,
    onSearchChange,
  }: any) => (
    <div data-testid="client-database">
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={onAddClick}>Add Client</button>
      <div>{clients.length} clients</div>
    </div>
  ),
  AddClientDialog: ({ open }: any) =>
    open ? <div data-testid="add-dialog">Add Client Dialog</div> : null,
}));

const { useClients } = require("../../ui/hooks/useClient");

describe("ClientsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page with metrics and database", () => {
    useClients.mockReturnValue({
      data: {
        data: mockClients,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
        metadata: { companies: [], projectCounts: [] },
      },
      isLoading: false,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("client-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("client-database")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useClients.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display total clients count", () => {
    useClients.mockReturnValue({
      data: {
        data: mockClients,
        pagination: { total: 10, page: 1, pageSize: 20, totalPages: 1 },
        metadata: { companies: [], projectCounts: [] },
      },
      isLoading: false,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Total: 10")).toBeInTheDocument();
  });

  it("should open add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    useClients.mockReturnValue({
      data: {
        data: mockClients,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
        metadata: { companies: [], projectCounts: [] },
      },
      isLoading: false,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.queryByTestId("add-dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add client/i }));

    await waitFor(() => {
      expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    });
  });

  it("should filter clients based on search query", async () => {
    const user = userEvent.setup();
    useClients.mockReturnValue({
      data: {
        data: mockClients,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
        metadata: { companies: [], projectCounts: [] },
      },
      isLoading: false,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "test");

    expect(searchInput).toHaveValue("test");
  });

  it("should handle empty clients list", () => {
    useClients.mockReturnValue({
      data: {
        data: [],
        pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
        metadata: { companies: [], projectCounts: [] },
      },
      isLoading: false,
      error: null,
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.getByText("0 clients")).toBeInTheDocument();
  });

  it("should handle error state", () => {
    useClients.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch clients"),
    });

    render(<ClientsPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("client-database")).toBeInTheDocument();
  });
});
