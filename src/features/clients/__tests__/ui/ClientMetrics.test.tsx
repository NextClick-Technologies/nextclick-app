/**
 * Tests for ClientMetrics Component
 * Tests metric calculations and display
 */

import { render, screen } from "@testing-library/react";
import { ClientMetrics } from "../../ui/components/ClientMetrics";
import { mockClient, mockClient2 } from "@/__tests__/fixtures/client.fixtures";
import { ClientStatus } from "../../domain/types";

describe("ClientMetrics", () => {
  const mockClients = [
    { ...mockClient, status: ClientStatus.ACTIVE, totalContractValue: 50000 },
    { ...mockClient2, status: ClientStatus.ACTIVE, totalContractValue: 75000 },
  ];

  it("should render all metric cards", () => {
    render(
      <ClientMetrics clients={mockClients} totalClients={2} isLoading={false} />
    );

    expect(screen.getByText("Total Clients")).toBeInTheDocument();
    expect(screen.getByText("Active Clients")).toBeInTheDocument();
    expect(screen.getByText("Total Value")).toBeInTheDocument();
  });

  it("should display correct total clients count", () => {
    render(
      <ClientMetrics clients={mockClients} totalClients={5} isLoading={false} />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should calculate active clients correctly", () => {
    const clients = [
      { ...mockClient, status: ClientStatus.ACTIVE },
      { ...mockClient2, status: ClientStatus.INACTIVE },
    ];

    render(
      <ClientMetrics clients={clients} totalClients={2} isLoading={false} />
    );

    // Should show 1 active client in the badge
    const badges = screen.getAllByText("1");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("should calculate total contract value correctly", () => {
    render(
      <ClientMetrics clients={mockClients} totalClients={2} isLoading={false} />
    );

    expect(screen.getByText("$125,000")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    const { container } = render(
      <ClientMetrics clients={[]} totalClients={0} isLoading={true} />
    );

    const loadingElements = container.querySelectorAll(".animate-pulse");
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("should handle empty clients array", () => {
    render(<ClientMetrics clients={[]} totalClients={0} isLoading={false} />);

    expect(screen.getByText("Total Clients")).toBeInTheDocument();
    expect(screen.getByText("Active Clients")).toBeInTheDocument();
    expect(screen.getByText("Total Value")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("should handle clients without totalContractValue", () => {
    const clientsWithoutValue = [
      { ...mockClient, totalContractValue: null },
      { ...mockClient2, totalContractValue: null },
    ];

    render(
      <ClientMetrics
        clients={clientsWithoutValue}
        totalClients={2}
        isLoading={false}
      />
    );

    expect(screen.getByText("$0")).toBeInTheDocument();
  });
});
