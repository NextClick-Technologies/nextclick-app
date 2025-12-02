/**
 * Tests for ProjectMetrics Component
 */

import { render, screen } from "@testing-library/react";
import { ProjectMetrics } from "../../ui/components/ProjectMetrics";
import {
  mockProject,
  mockProject2,
} from "@/__tests__/fixtures/project.fixtures";
import { ProjectStatus } from "../../domain/types";

describe("ProjectMetrics", () => {
  const mockProjects = [mockProject, mockProject2];

  it("should render all metric cards", () => {
    render(
      <ProjectMetrics
        projects={mockProjects}
        totalProjects={2}
        isLoading={false}
      />
    );

    expect(screen.getByText("Total Projects")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Total Budget")).toBeInTheDocument();
  });

  it("should display correct total projects count", () => {
    render(
      <ProjectMetrics
        projects={mockProjects}
        totalProjects={20}
        isLoading={false}
      />
    );

    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should calculate active projects correctly", () => {
    const projects = [
      { ...mockProject, status: ProjectStatus.ACTIVE },
      { ...mockProject2, status: ProjectStatus.COMPLETED },
    ];

    render(
      <ProjectMetrics projects={projects} totalProjects={2} isLoading={false} />
    );

    const activeCount = screen.getAllByText("1");
    expect(activeCount.length).toBeGreaterThan(0);
  });

  it("should show loading state", () => {
    const { container } = render(
      <ProjectMetrics projects={[]} totalProjects={0} isLoading={true} />
    );

    const loadingElements = container.querySelectorAll(".animate-pulse");
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("should handle empty projects array", () => {
    render(
      <ProjectMetrics projects={[]} totalProjects={0} isLoading={false} />
    );

    expect(screen.getByText("Total Projects")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
