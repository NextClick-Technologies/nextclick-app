/**
 * Tests for ClientDatabase
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientDatabase } from "../../ui/components/client-database/ClientDatabase";
import { mockClients } from "@/__tests__/fixtures/client.fixtures";

// Mock child components
jest.mock("../../ui/components/client-database/ClientTable", () => ({
  ClientTable: ({ clients }: any) => (
    <div data-testid="client-table">{clients.length} clients</div>
  ),
}));

jest.mock("../../ui/components/client-database/ClientFilters", () => ({
  ClientFilters: ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
  }: any) => (
    <div data-testid="client-filters">
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

describe("ClientDatabase", () => {
  const mockOnAddClick = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    clients: mockClients,
    companies: [],
    projectCounts: [],
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
    render(<ClientDatabase {...defaultProps} />);

    expect(screen.getByText("Client Database")).toBeInTheDocument();
  });

  it("should render add button and call onAddClick when clicked", async () => {
    const user = userEvent.setup();

    render(<ClientDatabase {...defaultProps} />);

    const addButtons = screen.getAllByRole("button", {
      name: /add new client/i,
    });
    await user.click(addButtons[0]);

    expect(mockOnAddClick).toHaveBeenCalled();
  });

  it("should render table when not loading and no error", () => {
    render(<ClientDatabase {...defaultProps} />);

    expect(screen.getByTestId("client-table")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<ClientDatabase {...defaultProps} isLoading={true} />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should show error message when error is present", () => {
    const error = new Error("Failed to load clients");

    render(<ClientDatabase {...defaultProps} error={error} />);

    expect(screen.getByText(/Error loading clients/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load clients/)).toBeInTheDocument();
  });

  it("should show empty state when no clients", () => {
    render(<ClientDatabase {...defaultProps} clients={[]} />);

    expect(screen.getByText("No clients found")).toBeInTheDocument();
  });
});
