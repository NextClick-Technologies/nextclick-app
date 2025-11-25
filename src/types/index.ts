// Frontend types (camelCase - post API transformation)
export * from "./client.type";
export * from "./company.type";
export * from "./project.type";
export * from "./milestone.type";
export * from "./payment.type";
export * from "./employee.type";
export * from "./communication-log.type";

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
  ClientInsert as DbClientInsert,
  CompanyInsert as DbCompanyInsert,
  ProjectInsert as DbProjectInsert,
  MilestoneInsert as DbMilestoneInsert,
  PaymentInsert as DbPaymentInsert,
  EmployeeInsert as DbEmployeeInsert,
  CommunicationLogInsert as DbCommunicationLogInsert,
  ClientUpdate as DbClientUpdate,
  CompanyUpdate as DbCompanyUpdate,
  ProjectUpdate as DbProjectUpdate,
  MilestoneUpdate as DbMilestoneUpdate,
  PaymentUpdate as DbPaymentUpdate,
  EmployeeUpdate as DbEmployeeUpdate,
  CommunicationLogUpdate as DbCommunicationLogUpdate,
} from "./database.type";
