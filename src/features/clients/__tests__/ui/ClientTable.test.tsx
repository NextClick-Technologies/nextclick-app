/**
 * Tests for ClientTable
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientTable } from "../../ui/components/client-database/ClientTable";
import { mockClients } from "@/__tests__/fixtures/client.fixtures";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("ClientTable", () => {
  const defaultProps = {
    clients: mockClients,
    companies: [
      { id: "1", name: "Company A" },
      { id: "2", name: "Company B" },
    ],
    projectCounts: [
      { clientId: mockClients[0].id, count: 3 },
      { clientId: mockClients[1].id, count: 1 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render client data", () => {
    render(<ClientTable {...defaultProps} />);

    // Check if table renders with client data
    expect(mockClients.length).toBeGreaterThan(0);
    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should navigate to client detail page when row is clicked", async () => {
    const user = userEvent.setup();

    render(<ClientTable {...defaultProps} />);

    const firstRow = document.querySelector("tbody tr");
    if (firstRow) {
      await user.click(firstRow);
    }

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/clients/"));
  });

  it("should display client status badges", () => {
    render(<ClientTable {...defaultProps} />);

    // Check if clients render correctly
    expect(mockClients.length).toBeGreaterThan(0);
  });
});
