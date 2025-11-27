import { describe, it, expect } from "@jest/globals";
import {
  employeeSchema,
  updateEmployeeSchema,
  type EmployeeInput,
  type UpdateEmployeeInput,
} from "@/schemas/employee.schema";
import { Title, Gender, EmployeeStatus } from "@/types";
import { ZodError } from "zod";

describe("employeeSchema", () => {
  describe("title field", () => {
    it("should accept valid title from enum", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        title: Title.MR,
      };
      const result = employeeSchema.parse(data);
      expect(result.title).toBe(Title.MR);
    });

    it("should accept null title", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        title: null,
      };
      const result = employeeSchema.parse(data);
      expect(result.title).toBeNull();
    });

    it("should accept undefined title", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.title).toBeUndefined();
    });

    it("should reject invalid title", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        title: "Sir" as any,
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("name field", () => {
    it("should accept valid name", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.name).toBe("John");
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("familyName field", () => {
    it("should accept valid family name", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.familyName).toBe("Doe");
    });

    it("should reject empty family name", () => {
      const data = {
        name: "John",
        familyName: "",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("preferredName field", () => {
    it("should accept valid preferred name", () => {
      const data = {
        name: "Jonathan",
        familyName: "Doe",
        preferredName: "Johnny",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.preferredName).toBe("Johnny");
    });

    it("should accept null preferred name", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        preferredName: null,
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.preferredName).toBeNull();
    });
  });

  describe("gender field", () => {
    it("should accept MALE", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.gender).toBe(Gender.MALE);
    });

    it("should accept FEMALE", () => {
      const data = {
        name: "Jane",
        familyName: "Smith",
        gender: Gender.FEMALE,
        phoneNumber: "1234567890",
        email: "jane@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.gender).toBe(Gender.FEMALE);
    });

    it("should accept OTHER", () => {
      const data = {
        name: "Alex",
        familyName: "Johnson",
        gender: Gender.OTHER,
        phoneNumber: "1234567890",
        email: "alex@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.gender).toBe(Gender.OTHER);
    });

    it("should reject invalid gender", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: "unknown" as any,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing gender", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("phoneNumber field", () => {
    it("should accept valid phone number", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.phoneNumber).toBe("1234567890");
    });

    it("should reject empty phone number", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "",
        email: "john@example.com",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("email field", () => {
    it("should accept valid email", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.email).toBe("john.doe@example.com");
    });

    it("should reject invalid email", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "not-an-email",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("photo field", () => {
    it("should accept valid URL", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        photo: "https://example.com/photo.jpg",
      };
      const result = employeeSchema.parse(data);
      expect(result.photo).toBe("https://example.com/photo.jpg");
    });

    it("should reject invalid URL", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        photo: "not-a-url",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept null photo", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        photo: null,
      };
      const result = employeeSchema.parse(data);
      expect(result.photo).toBeNull();
    });
  });

  describe("userId field", () => {
    it("should accept valid UUID", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        userId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = employeeSchema.parse(data);
      expect(result.userId).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should reject invalid UUID", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        userId: "not-a-uuid",
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept null userId", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        userId: null,
      };
      const result = employeeSchema.parse(data);
      expect(result.userId).toBeNull();
    });
  });

  describe("status field", () => {
    it("should default to ACTIVE when not provided", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
      };
      const result = employeeSchema.parse(data);
      expect(result.status).toBe(EmployeeStatus.ACTIVE);
    });

    it("should accept INACTIVE status", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        status: EmployeeStatus.INACTIVE,
      };
      const result = employeeSchema.parse(data);
      expect(result.status).toBe(EmployeeStatus.INACTIVE);
    });

    it("should accept ON_LEAVE status", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        status: EmployeeStatus.ON_LEAVE,
      };
      const result = employeeSchema.parse(data);
      expect(result.status).toBe(EmployeeStatus.ON_LEAVE);
    });

    it("should reject invalid status", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        status: "retired" as any,
      };
      expect(() => employeeSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("optional fields", () => {
    it("should accept department", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        department: "Engineering",
      };
      const result = employeeSchema.parse(data);
      expect(result.department).toBe("Engineering");
    });

    it("should accept position", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        position: "Senior Developer",
      };
      const result = employeeSchema.parse(data);
      expect(result.position).toBe("Senior Developer");
    });

    it("should accept salary", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        salary: 75000,
      };
      const result = employeeSchema.parse(data);
      expect(result.salary).toBe(75000);
    });

    it("should accept address fields", () => {
      const data = {
        name: "John",
        familyName: "Doe",
        gender: Gender.MALE,
        phoneNumber: "1234567890",
        email: "john@example.com",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      };
      const result = employeeSchema.parse(data);
      expect(result.address).toBe("123 Main St");
      expect(result.city).toBe("New York");
      expect(result.state).toBe("NY");
      expect(result.zipCode).toBe("10001");
      expect(result.country).toBe("USA");
    });
  });

  describe("full valid employee object", () => {
    it("should parse complete employee data", () => {
      const data: EmployeeInput = {
        title: Title.MR,
        name: "John",
        familyName: "Doe",
        preferredName: "Johnny",
        gender: Gender.MALE,
        phoneNumber: "+1-555-123-4567",
        email: "john.doe@company.com",
        photo: "https://example.com/photos/john.jpg",
        userId: "550e8400-e29b-41d4-a716-446655440000",
        status: EmployeeStatus.ACTIVE,
        department: "Engineering",
        position: "Senior Software Engineer",
        joinDate: "2024-01-15",
        salary: 95000,
        emergencyContact: "Jane Doe",
        emergencyPhone: "+1-555-987-6543",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "USA",
      };
      const result = employeeSchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updateEmployeeSchema", () => {
  it("should allow partial updates with only name", () => {
    const data: UpdateEmployeeInput = {
      name: "Jane",
    };
    const result = updateEmployeeSchema.parse(data);
    expect(result.name).toBe("Jane");
  });

  it("should allow partial updates with only status", () => {
    const data: UpdateEmployeeInput = {
      status: EmployeeStatus.ON_LEAVE,
    };
    const result = updateEmployeeSchema.parse(data);
    expect(result.status).toBe(EmployeeStatus.ON_LEAVE);
  });

  it("should allow empty update object", () => {
    const data: UpdateEmployeeInput = {};
    const result = updateEmployeeSchema.parse(data);
    expect(result).toHaveProperty("status", EmployeeStatus.ACTIVE);
  });

  it("should validate fields when provided", () => {
    const data = {
      email: "invalid-email",
    };
    expect(() => updateEmployeeSchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateEmployeeInput = {
      position: "Lead Developer",
      salary: 105000,
      department: "Product Engineering",
    };
    const result = updateEmployeeSchema.parse(data);
    expect(result.position).toBe("Lead Developer");
    expect(result.salary).toBe(105000);
    expect(result.department).toBe("Product Engineering");
  });

  it("should apply defaults even in partial schema", () => {
    const data: UpdateEmployeeInput = {};
    const result = updateEmployeeSchema.parse(data);
    expect(result.status).toBe(EmployeeStatus.ACTIVE);
  });
});
