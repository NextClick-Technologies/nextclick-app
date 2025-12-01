import { describe, it, expect } from "@jest/globals";
import {
  companySchema,
  updateCompanySchema,
  type CompanyInput,
  type UpdateCompanyInput,
} from "@/features/companies/domain/schemas/company.schema";
import { ZodError } from "zod";

describe("companySchema", () => {
  describe("name field", () => {
    it("should accept valid company name", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.name).toBe("Tech Corp");
    });

    it("should reject name shorter than 3 characters", () => {
      const data = {
        name: "AB",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });

    it("should reject empty name", () => {
      const data = {
        name: "",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("email field", () => {
    it("should accept valid email", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.email).toBe("contact@techcorp.com");
    });

    it("should reject invalid email format", () => {
      const data = {
        name: "Tech Corp",
        email: "invalid-email",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });

    it("should reject email without domain", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("address field", () => {
    it("should accept valid address", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street, Building A",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.address).toBe("123 Tech Street, Building A");
    });

    it("should reject address shorter than 3 characters", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "AB",
        phoneNumber: "1234567890",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("phoneNumber field", () => {
    it("should accept valid phone number", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.phoneNumber).toBe("1234567890");
    });

    it("should reject phone number shorter than 9 characters", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "12345678",
      };
      expect(() => companySchema.parse(data)).toThrow(ZodError);
    });

    it("should accept international phone numbers", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "+1-555-123-4567",
      };
      const result = companySchema.parse(data);
      expect(result.phoneNumber).toBe("+1-555-123-4567");
    });
  });

  describe("contactPerson field", () => {
    it("should accept valid contact person", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
        contactPerson: "John Doe",
      };
      const result = companySchema.parse(data);
      expect(result.contactPerson).toBe("John Doe");
    });

    it("should accept null contact person", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
        contactPerson: null,
      };
      const result = companySchema.parse(data);
      expect(result.contactPerson).toBeNull();
    });

    it("should accept undefined contact person", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.contactPerson).toBeUndefined();
    });
  });

  describe("industry field", () => {
    it("should accept valid industry", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
        industry: "Technology",
      };
      const result = companySchema.parse(data);
      expect(result.industry).toBe("Technology");
    });

    it("should accept null industry", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
        industry: null,
      };
      const result = companySchema.parse(data);
      expect(result.industry).toBeNull();
    });
  });

  describe("status field", () => {
    it("should default to 'active' when not provided", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
      };
      const result = companySchema.parse(data);
      expect(result.status).toBe("active");
    });

    it("should accept custom status value", () => {
      const data = {
        name: "Tech Corp",
        email: "contact@techcorp.com",
        address: "123 Tech Street",
        phoneNumber: "1234567890",
        status: "inactive",
      };
      const result = companySchema.parse(data);
      expect(result.status).toBe("inactive");
    });
  });

  describe("full valid company object", () => {
    it("should parse complete company data", () => {
      const data: CompanyInput = {
        name: "Tech Innovators Inc",
        email: "hello@techinnovators.com",
        address: "456 Innovation Ave, Silicon Valley",
        phoneNumber: "+1-650-555-0100",
        contactPerson: "Jane Smith",
        industry: "Software Development",
        status: "active",
      };
      const result = companySchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updateCompanySchema", () => {
  it("should allow partial updates with only name", () => {
    const data: UpdateCompanyInput = {
      name: "New Company Name",
    };
    const result = updateCompanySchema.parse(data);
    expect(result.name).toBe("New Company Name");
  });

  it("should allow partial updates with only email", () => {
    const data: UpdateCompanyInput = {
      email: "newemail@company.com",
    };
    const result = updateCompanySchema.parse(data);
    expect(result.email).toBe("newemail@company.com");
  });

  it("should allow empty update object", () => {
    const data: UpdateCompanyInput = {};
    const result = updateCompanySchema.parse(data);
    expect(result).toHaveProperty("status", "active");
  });

  it("should validate fields when provided", () => {
    const data = {
      email: "invalid-email",
    };
    expect(() => updateCompanySchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateCompanyInput = {
      name: "Updated Corp",
      phoneNumber: "9876543210",
      industry: "Consulting",
    };
    const result = updateCompanySchema.parse(data);
    expect(result.name).toBe("Updated Corp");
    expect(result.phoneNumber).toBe("9876543210");
    expect(result.industry).toBe("Consulting");
  });
});
