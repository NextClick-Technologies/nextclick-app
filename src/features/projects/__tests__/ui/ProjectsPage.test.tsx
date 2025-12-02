/**
 * Tests for ProjectsPage
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createWrapper } from "@/__tests__/utils/test-utils";
import ProjectsPage from "../../ui/pages/ProjectsPage";
import { mockProjects } from "@/__tests__/fixtures/project.fixtures";

jest.mock("../../ui/hooks/useProject", () => ({
  useProjects: jest.fn(),
  useCreateProject: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useUpdateProject: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
  useDeleteProject: jest.fn(() => ({ mutate: jest.fn(), isLoading: false })),
}));

jest.mock("@/shared/components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("../../ui/components/ProjectMetrics", () => ({
  ProjectMetrics: ({ totalProjects, isLoading }: any) => (
    <div data-testid="project-metrics">
      {isLoading ? "Loading..." : `Total: ${totalProjects}`}
    </div>
  ),
}));

jest.mock("../../ui/components/project-database", () => ({
  ProjectDatabase: ({ projects, onAddClick }: any) => (
    <div data-testid="project-database">
      <button onClick={onAddClick}>Add Project</button>
      <div>{projects.length} projects</div>
    </div>
  ),
}));

jest.mock("../../ui/components/add-project-dialog", () => ({
  AddProjectDialog: ({ open }: any) =>
    open ? <div data-testid="add-dialog">Add Project Dialog</div> : null,
}));

const { useProjects } = require("../../ui/hooks/useProject");

describe("ProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render page with metrics and database", () => {
    useProjects.mockReturnValue({
      data: {
        data: mockProjects,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("project-metrics")).toBeInTheDocument();
    expect(screen.getByTestId("project-database")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    useProjects.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should open add dialog when add button is clicked", async () => {
    const user = userEvent.setup();
    useProjects.mockReturnValue({
      data: {
        data: mockProjects,
        pagination: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      },
      isLoading: false,
      error: null,
    });

    render(<ProjectsPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => {
      expect(screen.getByTestId("add-dialog")).toBeInTheDocument();
    });
  });

  it("should handle empty projects list", () => {
    useProjects.mockReturnValue({
      data: {
        data: [],
        pagination: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
      },
      isLoading: false,
      error: null,
    });

    render(<ProjectsPage />, { wrapper: createWrapper() });

    expect(screen.getByText("0 projects")).toBeInTheDocument();
  });
});
