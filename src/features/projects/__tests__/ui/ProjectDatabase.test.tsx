/**
 * Tests for ProjectDatabase
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectDatabase } from "../../ui/components/project-database/ProjectDatabase";
import { mockProjects } from "@/__tests__/fixtures/project.fixtures";

// Mock child components
jest.mock("../../ui/components/project-database/ProjectTable", () => ({
  ProjectTable: ({ projects }: any) => (
    <div data-testid="project-table">{projects.length} projects</div>
  ),
}));

jest.mock("../../ui/components/project-database/ProjectFilters", () => ({
  ProjectFilters: ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusChange,
  }: any) => (
    <div data-testid="project-filters">
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

describe("ProjectDatabase", () => {
  const mockOnAddClick = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnStatusChange = jest.fn();

  const defaultProps = {
    projects: mockProjects,
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
    render(<ProjectDatabase {...defaultProps} />);

    expect(screen.getByText("Project Database")).toBeInTheDocument();
  });

  it("should render add button and call onAddClick when clicked", async () => {
    const user = userEvent.setup();

    render(<ProjectDatabase {...defaultProps} />);

    const addButtons = screen.getAllByRole("button", {
      name: /add new project/i,
    });
    await user.click(addButtons[0]);

    expect(mockOnAddClick).toHaveBeenCalled();
  });

  it("should render table when not loading and no error", () => {
    render(<ProjectDatabase {...defaultProps} />);

    expect(screen.getByTestId("project-table")).toBeInTheDocument();
  });

  it("should show loading spinner when isLoading is true", () => {
    render(<ProjectDatabase {...defaultProps} isLoading={true} />);

    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should show error message when error is present", () => {
    const error = new Error("Failed to load projects");

    render(<ProjectDatabase {...defaultProps} error={error} />);

    expect(screen.getByText(/Error loading projects/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load projects/)).toBeInTheDocument();
  });

  it("should show empty state when no projects", () => {
    render(<ProjectDatabase {...defaultProps} projects={[]} />);

    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });
});
