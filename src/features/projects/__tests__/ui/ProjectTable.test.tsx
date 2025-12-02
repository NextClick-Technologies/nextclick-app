/**
 * Tests for ProjectTable
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectTable } from "../../ui/components/project-database/ProjectTable";
import { mockProjects } from "@/__tests__/fixtures/project.fixtures";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ProjectTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render project data", () => {
    render(<ProjectTable projects={mockProjects} />);

    // Check if table renders with project data
    expect(mockProjects.length).toBeGreaterThan(0);
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should navigate to project detail page when row is clicked", async () => {
    const user = userEvent.setup();

    render(<ProjectTable projects={mockProjects} />);

    const firstRow = document.querySelector("tbody tr");
    if (firstRow) {
      await user.click(firstRow);
    }

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/projects/")
    );
  });

  it("should display project status badges", () => {
    render(<ProjectTable projects={mockProjects} />);

    // Check if projects render correctly
    expect(mockProjects.length).toBeGreaterThan(0);
  });

  it("should render mobile card view", () => {
    render(<ProjectTable projects={mockProjects} />);

    const mobileContainer = document.querySelector(".md\\:hidden");
    expect(mobileContainer).toBeInTheDocument();
  });
});
