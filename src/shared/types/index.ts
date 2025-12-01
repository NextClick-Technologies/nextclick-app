// Frontend types (camelCase - post API transformation)
// Re-export from features
export * from "@/features/clients/domain/types";
export * from "@/features/companies/domain/types";
export * from "@/features/projects/domain/types";
export * from "@/features/milestone/domain/types";
export * from "@/features/payment/domain/types";
export * from "@/features/employees/domain/types";
export * from "@/features/communication-log/domain/types";
export * from "./user.type";

// Other types
export * from "./activity.type";
export * from "./ai-insight.type";
export * from "./dashboard-metrics.type";
export * from "./team-member.type";

// Export database types with 'Db' prefix to avoid conflicts
export type {
  Client as DbClient,
  Company as DbCompany,
  Project as DbProject,
  Milestone as DbMilestone,
  Payment as DbPayment,
  Employee as DbEmployee,
  CommunicationLog as DbCommunicationLog,
  UserDB as DbUser,
  ClientInsert as DbClientInsert,
  CompanyInsert as DbCompanyInsert,
  ProjectInsert as DbProjectInsert,
  MilestoneInsert as DbMilestoneInsert,
  PaymentInsert as DbPaymentInsert,
  EmployeeInsert as DbEmployeeInsert,
  CommunicationLogInsert as DbCommunicationLogInsert,
  UserInsert as DbUserInsert,
  ClientUpdate as DbClientUpdate,
  CompanyUpdate as DbCompanyUpdate,
  ProjectUpdate as DbProjectUpdate,
  MilestoneUpdate as DbMilestoneUpdate,
  PaymentUpdate as DbPaymentUpdate,
  EmployeeUpdate as DbEmployeeUpdate,
  CommunicationLogUpdate as DbCommunicationLogUpdate,
  UserUpdate as DbUserUpdate,
} from "./database.type";
