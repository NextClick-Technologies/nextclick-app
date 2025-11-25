import type {
  Title,
  Gender,
  PaymentTerms,
  ProjectStatus,
  ProjectPriority,
  MilestoneStatus,
  PaymentStatus,
  PaymentMethod,
  CommunicationChannel,
} from "@/const";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          title: Title | null;
          familyName: string;
          gender: Gender;
          phoneNumber: string;
          email: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          title?: Title | null;
          familyName: string;
          gender: Gender;
          phoneNumber: string;
          email: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: Title | null;
          familyName?: string;
          gender?: Gender;
          phoneNumber?: string;
          email?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          email: string;
          address: string;
          phoneNumber: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          address: string;
          phoneNumber: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          address?: string;
          phoneNumber?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          type: string;
          startDate: string;
          finishDate: string;
          budget: string;
          paymentTerms: PaymentTerms;
          status: ProjectStatus;
          priority: ProjectPriority;
          description: string;
          completionDate: string | null;
          clientId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          startDate: string;
          finishDate: string;
          budget: string;
          paymentTerms: PaymentTerms;
          status: ProjectStatus;
          priority: ProjectPriority;
          description: string;
          completionDate?: string | null;
          clientId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          startDate?: string;
          finishDate?: string;
          budget?: string;
          paymentTerms?: PaymentTerms;
          status?: ProjectStatus;
          priority?: ProjectPriority;
          description?: string;
          completionDate?: string | null;
          clientId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          name: string;
          description: string;
          startDate: string;
          finishDate: string;
          completionDate: string | null;
          status: MilestoneStatus;
          remarks: string | null;
          projectId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          startDate: string;
          finishDate: string;
          completionDate?: string | null;
          status: MilestoneStatus;
          remarks?: string | null;
          projectId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          startDate?: string;
          finishDate?: string;
          completionDate?: string | null;
          status?: MilestoneStatus;
          remarks?: string | null;
          projectId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          description: string;
          amount: string;
          status: PaymentStatus;
          date: string;
          method: PaymentMethod;
          projectId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: string;
          status: PaymentStatus;
          date: string;
          method: PaymentMethod;
          projectId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: string;
          status?: PaymentStatus;
          date?: string;
          method?: PaymentMethod;
          projectId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          title: Title | null;
          name: string;
          familyName: string;
          preferredName: string | null;
          gender: Gender;
          phoneNumber: string;
          email: string;
          photo: string | null;
          userId: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          title?: Title | null;
          name: string;
          familyName: string;
          preferredName?: string | null;
          gender: Gender;
          phoneNumber: string;
          email: string;
          photo?: string | null;
          userId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          title?: Title | null;
          name?: string;
          familyName?: string;
          preferredName?: string | null;
          gender?: Gender;
          phoneNumber?: string;
          email?: string;
          photo?: string | null;
          userId?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      communication_logs: {
        Row: {
          id: string;
          date: string;
          channel: CommunicationChannel;
          summary: string;
          followUpRequired: boolean;
          followUpDate: string | null;
          clientId: string;
          employeeId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          date: string;
          channel: CommunicationChannel;
          summary: string;
          followUpRequired: boolean;
          followUpDate?: string | null;
          clientId: string;
          employeeId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          date?: string;
          channel?: CommunicationChannel;
          summary?: string;
          followUpRequired?: boolean;
          followUpDate?: string | null;
          clientId?: string;
          employeeId?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Export convenience types for each table
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type MilestoneInsert =
  Database["public"]["Tables"]["milestones"]["Insert"];
export type MilestoneUpdate =
  Database["public"]["Tables"]["milestones"]["Update"];

export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

export type Employee = Database["public"]["Tables"]["employees"]["Row"];
export type EmployeeInsert =
  Database["public"]["Tables"]["employees"]["Insert"];
export type EmployeeUpdate =
  Database["public"]["Tables"]["employees"]["Update"];

export type CommunicationLog =
  Database["public"]["Tables"]["communication_logs"]["Row"];
export type CommunicationLogInsert =
  Database["public"]["Tables"]["communication_logs"]["Insert"];
export type CommunicationLogUpdate =
  Database["public"]["Tables"]["communication_logs"]["Update"];
