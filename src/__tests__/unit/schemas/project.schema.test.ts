import { describe, it, expect } from "@jest/globals";
import {
  projectSchema,
  updateProjectSchema,
  type ProjectInput,
  type UpdateProjectInput,
} from "@/schemas/project.schema";
import { ZodError } from "zod";

describe("projectSchema", () => {
  describe("name field", () => {
    it("should accept valid project name", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.name).toBe("Website Redesign");
    });

    it("should reject name shorter than 2 characters", () => {
      const data = {
        name: "A",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept 2-character name", () => {
      const data = {
        name: "AB",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.name).toBe("AB");
    });
  });

  describe("type field", () => {
    it("should accept valid project type", () => {
      const data = {
        name: "Website Redesign",
        type: "Web Development",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.type).toBe("Web Development");
    });

    it("should accept undefined type", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.type).toBeUndefined();
    });
  });

  describe("date fields", () => {
    it("should accept valid startDate", () => {
      const data = {
        name: "Website Redesign",
        startDate: "2024-01-01",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.startDate).toBe("2024-01-01");
    });

    it("should accept valid finishDate", () => {
      const data = {
        name: "Website Redesign",
        finishDate: "2024-12-31",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.finishDate).toBe("2024-12-31");
    });

    it("should accept null dates", () => {
      const data = {
        name: "Website Redesign",
        startDate: null,
        finishDate: null,
        completionDate: null,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.startDate).toBeNull();
      expect(result.finishDate).toBeNull();
      expect(result.completionDate).toBeNull();
    });
  });

  describe("budget field", () => {
    it("should accept valid budget number", () => {
      const data = {
        name: "Website Redesign",
        budget: 50000,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.budget).toBe(50000);
    });

    it("should coerce budget from string to number", () => {
      const data = {
        name: "Website Redesign",
        budget: "75000" as any,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.budget).toBe(75000);
    });

    it("should accept undefined budget", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.budget).toBeUndefined();
    });
  });

  describe("paymentTerms field", () => {
    it("should default to 'net_30d' when not provided", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.paymentTerms).toBe("net_30d");
    });

    it("should accept 'net_60d'", () => {
      const data = {
        name: "Website Redesign",
        paymentTerms: "net_60d" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.paymentTerms).toBe("net_60d");
    });

    it("should accept 'net_90d'", () => {
      const data = {
        name: "Website Redesign",
        paymentTerms: "net_90d" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.paymentTerms).toBe("net_90d");
    });

    it("should accept 'immediate'", () => {
      const data = {
        name: "Website Redesign",
        paymentTerms: "immediate" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.paymentTerms).toBe("immediate");
    });

    it("should reject invalid payment terms", () => {
      const data = {
        name: "Website Redesign",
        paymentTerms: "net_120d" as any,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("status field", () => {
    it("should default to 'active' when not provided", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.status).toBe("active");
    });

    it("should accept 'completed'", () => {
      const data = {
        name: "Website Redesign",
        status: "completed" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.status).toBe("completed");
    });

    it("should accept 'on_hold'", () => {
      const data = {
        name: "Website Redesign",
        status: "on_hold" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.status).toBe("on_hold");
    });

    it("should accept 'cancelled'", () => {
      const data = {
        name: "Website Redesign",
        status: "cancelled" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.status).toBe("cancelled");
    });

    it("should reject invalid status", () => {
      const data = {
        name: "Website Redesign",
        status: "pending" as any,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("priority field", () => {
    it("should default to 'medium' when not provided", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.priority).toBe("medium");
    });

    it("should accept 'low'", () => {
      const data = {
        name: "Website Redesign",
        priority: "low" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.priority).toBe("low");
    });

    it("should accept 'high'", () => {
      const data = {
        name: "Website Redesign",
        priority: "high" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.priority).toBe("high");
    });

    it("should accept 'urgent'", () => {
      const data = {
        name: "Website Redesign",
        priority: "urgent" as const,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.priority).toBe("urgent");
    });

    it("should reject invalid priority", () => {
      const data = {
        name: "Website Redesign",
        priority: "critical" as any,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("description field", () => {
    it("should accept valid description", () => {
      const data = {
        name: "Website Redesign",
        description: "Complete redesign of company website",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.description).toBe("Complete redesign of company website");
    });

    it("should accept undefined description", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.description).toBeUndefined();
    });
  });

  describe("clientId field", () => {
    it("should accept valid UUID", () => {
      const data = {
        name: "Website Redesign",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.clientId).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should reject invalid UUID", () => {
      const data = {
        name: "Website Redesign",
        clientId: "not-a-uuid",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing clientId", () => {
      const data = {
        name: "Website Redesign",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("projectManager field", () => {
    it("should accept valid UUID", () => {
      const data = {
        name: "Website Redesign",
        projectManager: "660e8400-e29b-41d4-a716-446655440001",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.projectManager).toBe(
        "660e8400-e29b-41d4-a716-446655440001"
      );
    });

    it("should accept null projectManager", () => {
      const data = {
        name: "Website Redesign",
        projectManager: null,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = projectSchema.parse(data);
      expect(result.projectManager).toBeNull();
    });

    it("should reject invalid UUID for projectManager", () => {
      const data = {
        name: "Website Redesign",
        projectManager: "not-a-uuid",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => projectSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("full valid project object", () => {
    it("should parse complete project data", () => {
      const data: ProjectInput = {
        name: "E-commerce Platform",
        type: "Web Application",
        startDate: "2024-01-15",
        finishDate: "2024-06-30",
        budget: 150000,
        paymentTerms: "net_60d",
        status: "active",
        priority: "high",
        description: "Build a fully-featured e-commerce platform",
        completionDate: null,
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        projectManager: "660e8400-e29b-41d4-a716-446655440001",
      };
      const result = projectSchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updateProjectSchema", () => {
  it("should allow partial updates with only name", () => {
    const data: UpdateProjectInput = {
      name: "Updated Project Name",
    };
    const result = updateProjectSchema.parse(data);
    expect(result.name).toBe("Updated Project Name");
  });

  it("should allow partial updates with only status", () => {
    const data: UpdateProjectInput = {
      status: "completed",
    };
    const result = updateProjectSchema.parse(data);
    expect(result.status).toBe("completed");
  });

  it("should allow empty update object", () => {
    const data: UpdateProjectInput = {};
    const result = updateProjectSchema.parse(data);
    expect(result).toHaveProperty("status", "active");
    expect(result).toHaveProperty("priority", "medium");
    expect(result).toHaveProperty("paymentTerms", "net_30d");
  });

  it("should validate fields when provided", () => {
    const data = {
      clientId: "not-a-uuid",
    };
    expect(() => updateProjectSchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateProjectInput = {
      status: "on_hold",
      priority: "low",
      description: "Project on hold pending client approval",
    };
    const result = updateProjectSchema.parse(data);
    expect(result.status).toBe("on_hold");
    expect(result.priority).toBe("low");
    expect(result.description).toBe("Project on hold pending client approval");
  });

  it("should apply defaults even in partial schema", () => {
    const data: UpdateProjectInput = {};
    const result = updateProjectSchema.parse(data);
    expect(result.status).toBe("active");
    expect(result.priority).toBe("medium");
    expect(result.paymentTerms).toBe("net_30d");
  });
});
