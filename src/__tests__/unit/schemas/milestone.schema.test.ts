import { describe, it, expect } from "@jest/globals";
import {
  milestoneSchema,
  updateMilestoneSchema,
  type MilestoneInput,
  type UpdateMilestoneInput,
} from "@/features/milestone/domain/schemas";
import { ZodError } from "zod";

describe("milestoneSchema", () => {
  describe("name field", () => {
    it("should accept valid milestone name", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.name).toBe("Phase 1 Complete");
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("description field", () => {
    it("should accept valid description", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete all initial setup tasks and documentation",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.description).toBe(
        "Complete all initial setup tasks and documentation"
      );
    });

    it("should reject empty description", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("date fields", () => {
    it("should accept valid startDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.startDate).toBe("2024-01-01");
    });

    it("should reject empty startDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept valid finishDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.finishDate).toBe("2024-01-31");
    });

    it("should reject empty finishDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept valid completionDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        completionDate: "2024-01-30",
        status: "completed" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.completionDate).toBe("2024-01-30");
    });

    it("should accept null completionDate", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        completionDate: null,
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.completionDate).toBeNull();
    });
  });

  describe("status field", () => {
    it("should accept 'pending' status", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.status).toBe("pending");
    });

    it("should accept 'in_progress' status", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "in_progress" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.status).toBe("in_progress");
    });

    it("should accept 'completed' status", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "completed" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.status).toBe("completed");
    });

    it("should accept 'cancelled' status", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "cancelled" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.status).toBe("cancelled");
    });

    it("should reject invalid status", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "on_hold" as any,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("remarks field", () => {
    it("should accept valid remarks", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "completed" as const,
        remarks: "Completed ahead of schedule",
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.remarks).toBe("Completed ahead of schedule");
    });

    it("should accept null remarks", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        remarks: null,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.remarks).toBeNull();
    });

    it("should accept undefined remarks", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.remarks).toBeUndefined();
    });
  });

  describe("order field", () => {
    it("should accept valid order number", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        order: 1,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.order).toBe(1);
    });

    it("should accept zero as order", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        order: 0,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.order).toBe(0);
    });

    it("should reject negative order", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        order: -1,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject decimal order", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        order: 1.5,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept undefined order", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.order).toBeUndefined();
    });
  });

  describe("projectId field", () => {
    it("should accept valid UUID", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result.projectId).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should reject invalid UUID", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
        projectId: "not-a-uuid",
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing projectId", () => {
      const data = {
        name: "Phase 1 Complete",
        description: "Complete initial setup",
        startDate: "2024-01-01",
        finishDate: "2024-01-31",
        status: "pending" as const,
      };
      expect(() => milestoneSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("full valid milestone object", () => {
    it("should parse complete milestone data", () => {
      const data: MilestoneInput = {
        name: "MVP Launch",
        description: "Launch minimum viable product to initial users",
        startDate: "2024-03-01",
        finishDate: "2024-03-31",
        completionDate: "2024-03-28",
        status: "completed",
        remarks: "Launched successfully with positive feedback",
        order: 2,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = milestoneSchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updateMilestoneSchema", () => {
  it("should allow partial updates with only name", () => {
    const data: UpdateMilestoneInput = {
      name: "Updated Milestone Name",
    };
    const result = updateMilestoneSchema.parse(data);
    expect(result.name).toBe("Updated Milestone Name");
  });

  it("should allow partial updates with only status", () => {
    const data: UpdateMilestoneInput = {
      status: "completed",
    };
    const result = updateMilestoneSchema.parse(data);
    expect(result.status).toBe("completed");
  });

  it("should allow empty update object", () => {
    const data: UpdateMilestoneInput = {};
    const result = updateMilestoneSchema.parse(data);
    expect(result).toEqual({});
  });

  it("should validate fields when provided", () => {
    const data = {
      projectId: "not-a-uuid",
    };
    expect(() => updateMilestoneSchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateMilestoneInput = {
      status: "completed",
      completionDate: "2024-03-28",
      remarks: "Completed on time",
    };
    const result = updateMilestoneSchema.parse(data);
    expect(result).toEqual(data);
  });

  it("should allow updating completion date to null", () => {
    const data: UpdateMilestoneInput = {
      completionDate: null,
    };
    const result = updateMilestoneSchema.parse(data);
    expect(result.completionDate).toBeNull();
  });
});
