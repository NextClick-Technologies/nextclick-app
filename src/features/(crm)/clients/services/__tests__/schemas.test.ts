import {
  clientSchema,
  updateClientSchema,
} from "@/features/(crm)/clients/services/schemas";
import { Title, Gender, ClientStatus } from "@/features/(crm)/clients/services/types";

describe("Client Schema", () => {
  describe("clientSchema", () => {
    const validClientData = {
      title: Title.MR,
      gender: Gender.MALE,
      name: "John",
      familyName: "Doe",
      phoneNumber: "+1234567890",
      email: "john@example.com",
      totalContractValue: 50000,
      joinDate: "2024-01-15",
      companyId: "550e8400-e29b-41d4-a716-446655440001",
      status: ClientStatus.ACTIVE,
    };

    it("should validate correct client data", () => {
      const result = clientSchema.safeParse(validClientData);
      expect(result.success).toBe(true);
    });

    it("should apply default values for title, gender, status, and totalContractValue", () => {
      const minimalData = {
        name: "John",
        familyName: "Doe",
        phoneNumber: "+1234567890",
        companyId: "550e8400-e29b-41d4-a716-446655440001",
      };

      const result = clientSchema.parse(minimalData);

      expect(result.title).toBe(Title.MR);
      expect(result.gender).toBe(Gender.OTHER);
      expect(result.status).toBe(ClientStatus.ACTIVE);
      expect(result.totalContractValue).toBe(0);
    });

    describe("name field", () => {
      it("should reject name shorter than 2 characters", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          name: "J",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "First Name must be at least 2 characters"
          );
        }
      });

      it("should reject empty name", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          name: "",
        });

        expect(result.success).toBe(false);
      });

      it("should accept name with exactly 2 characters", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          name: "Jo",
        });

        expect(result.success).toBe(true);
      });

      it("should accept long names", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          name: "Christopher Alexander",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("familyName field", () => {
      it("should reject familyName shorter than 2 characters", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          familyName: "D",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Family Name must be at least 2 characters"
          );
        }
      });

      it("should reject empty familyName", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          familyName: "",
        });

        expect(result.success).toBe(false);
      });

      it("should accept familyName with exactly 2 characters", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          familyName: "Do",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("phoneNumber field", () => {
      it("should require phoneNumber", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          phoneNumber: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Phone number is required"
          );
        }
      });

      it("should accept various phone number formats", () => {
        const phoneNumbers = [
          "+1234567890",
          "123-456-7890",
          "(123) 456-7890",
          "1234567890",
        ];

        phoneNumbers.forEach((phone) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            phoneNumber: phone,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("email field", () => {
      it("should accept valid email addresses", () => {
        const emails = [
          "test@example.com",
          "user.name@example.co.uk",
          "user+tag@example.com",
        ];

        emails.forEach((email) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            email,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should reject invalid email addresses", () => {
        const invalidEmails = [
          "invalid",
          "invalid@",
          "@example.com",
          "invalid@.com",
        ];

        invalidEmails.forEach((email) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            email,
          });
          expect(result.success).toBe(false);
        });
      });

      it("should accept empty string for email", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          email: "",
        });

        expect(result.success).toBe(true);
      });

      it("should accept undefined email", () => {
        const { email, ...dataWithoutEmail } = validClientData;
        const result = clientSchema.safeParse(dataWithoutEmail);

        expect(result.success).toBe(true);
      });
    });

    describe("companyId field", () => {
      it("should require companyId", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          companyId: "",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Please select a company"
          );
        }
      });

      it("should reject invalid UUID", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          companyId: "invalid-uuid",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Please select a valid company"
          );
        }
      });

      it("should accept valid UUID", () => {
        const validUUIDs = [
          "550e8400-e29b-41d4-a716-446655440001",
          "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        ];

        validUUIDs.forEach((uuid) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            companyId: uuid,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("title field", () => {
      it("should accept valid title enums", () => {
        const titles = [
          Title.MR,
          Title.MRS,
          Title.MS,
          Title.DR,
          Title.PROF,
          Title.SR,
        ];

        titles.forEach((title) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            title,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should reject invalid title", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          title: "invalid" as any,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("gender field", () => {
      it("should accept valid gender enums", () => {
        const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];

        genders.forEach((gender) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            gender,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should reject invalid gender", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          gender: "invalid" as any,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("status field", () => {
      it("should accept valid status enums", () => {
        const statuses = [
          ClientStatus.ACTIVE,
          ClientStatus.INACTIVE,
          ClientStatus.PENDING,
        ];

        statuses.forEach((status) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            status,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should reject invalid status", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          status: "invalid" as any,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("totalContractValue field", () => {
      it("should accept positive numbers", () => {
        const values = [0, 1, 100, 50000, 999999.99];

        values.forEach((value) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            totalContractValue: value,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should accept negative numbers", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          totalContractValue: -100,
        });

        expect(result.success).toBe(true);
      });

      it("should reject non-numeric values", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          totalContractValue: "50000" as any,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("joinDate field", () => {
      it("should accept valid date strings", () => {
        const dates = ["2024-01-15", "2023-12-31", "2025-01-01"];

        dates.forEach((date) => {
          const result = clientSchema.safeParse({
            ...validClientData,
            joinDate: date,
          });
          expect(result.success).toBe(true);
        });
      });

      it("should accept null joinDate", () => {
        const result = clientSchema.safeParse({
          ...validClientData,
          joinDate: null,
        });

        expect(result.success).toBe(true);
      });

      it("should accept undefined joinDate", () => {
        const { joinDate, ...dataWithoutJoinDate } = validClientData;
        const result = clientSchema.safeParse(dataWithoutJoinDate);

        expect(result.success).toBe(true);
      });
    });
  });

  describe("updateClientSchema", () => {
    it("should make all fields optional", () => {
      const result = updateClientSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it("should validate partial updates", () => {
      const partialUpdates = [
        { name: "UpdatedName" },
        { status: ClientStatus.INACTIVE },
        { totalContractValue: 75000 },
        { email: "newemail@example.com" },
        { name: "John", familyName: "Smith" },
      ];

      partialUpdates.forEach((update) => {
        const result = updateClientSchema.safeParse(update);
        expect(result.success).toBe(true);
      });
    });

    it("should still validate field constraints when fields are provided", () => {
      const result = updateClientSchema.safeParse({
        name: "J", // Too short
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid email in partial update", () => {
      const result = updateClientSchema.safeParse({
        email: "invalid-email",
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid UUID in partial update", () => {
      const result = updateClientSchema.safeParse({
        companyId: "invalid-uuid",
      });

      expect(result.success).toBe(false);
    });

    it("should accept complete valid data", () => {
      const fullData = {
        title: Title.DR,
        gender: Gender.FEMALE,
        name: "Jane",
        familyName: "Smith",
        phoneNumber: "+9876543210",
        email: "jane@example.com",
        totalContractValue: 100000,
        joinDate: "2024-02-01",
        companyId: "550e8400-e29b-41d4-a716-446655440002",
        status: ClientStatus.ACTIVE,
      };

      const result = updateClientSchema.safeParse(fullData);
      expect(result.success).toBe(true);
    });
  });
});
