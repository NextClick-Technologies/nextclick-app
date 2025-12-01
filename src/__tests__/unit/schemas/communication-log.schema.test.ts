import { describe, it, expect } from "@jest/globals";
import {
  communicationLogSchema,
  updateCommunicationLogSchema,
  type CommunicationLogInput,
  type UpdateCommunicationLogInput,
} from "@/features/communication-log/services/schemas";
import { ZodError } from "zod";

describe("communicationLogSchema", () => {
  describe("date field", () => {
    it("should accept valid datetime string", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.date).toBe("2024-01-15T10:30:00Z");
    });

    it("should reject invalid datetime format", () => {
      const data = {
        date: "2024-01-15",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject non-datetime string", () => {
      const data = {
        date: "January 15, 2024",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("channel field", () => {
    it("should accept 'email' channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.channel).toBe("email");
    });

    it("should accept 'phone' channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "phone" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.channel).toBe("phone");
    });

    it("should accept 'chat' channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "chat" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.channel).toBe("chat");
    });

    it("should accept 'meeting' channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "meeting" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.channel).toBe("meeting");
    });

    it("should accept 'video_call' channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "video_call" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.channel).toBe("video_call");
    });

    it("should reject invalid channel", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "sms" as any,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("summary field", () => {
    it("should accept valid summary", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed Q1 project deliverables and timeline",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.summary).toBe(
        "Discussed Q1 project deliverables and timeline"
      );
    });

    it("should reject empty summary", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("followUpRequired field", () => {
    it("should accept true for followUpRequired", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: true,
        followUpDate: "2024-01-20T10:00:00Z",
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.followUpRequired).toBe(true);
    });

    it("should accept false for followUpRequired", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.followUpRequired).toBe(false);
    });

    it("should reject non-boolean followUpRequired", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: "yes" as any,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("followUpDate field", () => {
    it("should accept valid followUpDate", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: true,
        followUpDate: "2024-01-20T10:00:00Z",
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.followUpDate).toBe("2024-01-20T10:00:00Z");
    });

    it("should accept null followUpDate", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        followUpDate: null,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.followUpDate).toBeNull();
    });

    it("should accept undefined followUpDate", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.followUpDate).toBeUndefined();
    });

    it("should reject invalid datetime for followUpDate", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: true,
        followUpDate: "2024-01-20",
        clientId: "client-123",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("clientId field", () => {
    it("should accept valid clientId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.clientId).toBe("client-123");
    });

    it("should reject empty clientId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "",
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing clientId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        employeeId: "employee-456",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("employeeId field", () => {
    it("should accept valid employeeId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "employee-456",
      };
      const result = communicationLogSchema.parse(data);
      expect(result.employeeId).toBe("employee-456");
    });

    it("should reject empty employeeId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
        employeeId: "",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing employeeId", () => {
      const data = {
        date: "2024-01-15T10:30:00Z",
        channel: "email" as const,
        summary: "Discussed project requirements",
        followUpRequired: false,
        clientId: "client-123",
      };
      expect(() => communicationLogSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("full valid communication log object", () => {
    it("should parse complete communication log data", () => {
      const data: CommunicationLogInput = {
        date: "2024-01-15T14:30:00Z",
        channel: "video_call",
        summary:
          "Discussed Q1 roadmap, budget allocation, and team expansion plans",
        followUpRequired: true,
        followUpDate: "2024-01-22T10:00:00Z",
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        employeeId: "660e8400-e29b-41d4-a716-446655440001",
      };
      const result = communicationLogSchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updateCommunicationLogSchema", () => {
  it("should allow partial updates with only summary", () => {
    const data: UpdateCommunicationLogInput = {
      summary: "Updated summary of the discussion",
    };
    const result = updateCommunicationLogSchema.parse(data);
    expect(result.summary).toBe("Updated summary of the discussion");
  });

  it("should allow partial updates with only followUpRequired", () => {
    const data: UpdateCommunicationLogInput = {
      followUpRequired: true,
    };
    const result = updateCommunicationLogSchema.parse(data);
    expect(result.followUpRequired).toBe(true);
  });

  it("should allow empty update object", () => {
    const data: UpdateCommunicationLogInput = {};
    const result = updateCommunicationLogSchema.parse(data);
    expect(result).toEqual({});
  });

  it("should validate fields when provided", () => {
    const data = {
      channel: "sms" as any,
    };
    expect(() => updateCommunicationLogSchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateCommunicationLogInput = {
      followUpRequired: false,
      followUpDate: null,
      summary: "Resolved - no follow-up needed",
    };
    const result = updateCommunicationLogSchema.parse(data);
    expect(result).toEqual(data);
  });

  it("should validate date format in updates", () => {
    const data = {
      date: "2024-01-15",
    };
    expect(() => updateCommunicationLogSchema.parse(data)).toThrow(ZodError);
  });
});
