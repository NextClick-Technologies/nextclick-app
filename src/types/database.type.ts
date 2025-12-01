import type { Title } from "@/features/(crm)/clients/services/types";
import type { Gender } from "@/features/(crm)/clients/services/types";
import type { EmployeeStatus } from "@/features/(hr)/employees/services/types";
import type { PaymentTerms } from "@/features/(crm)/projects/services/types";
import type { ProjectStatus } from "@/features/(crm)/projects/services/types";
import type { ProjectPriority } from "@/features/(crm)/projects/services/types";
import type { MilestoneStatus } from "./milestone.type";
import type { PaymentStatus } from "./payment.type";
import type { PaymentMethod } from "./payment.type";
import type { CommunicationChannel } from "./communication-log.type";
import type { UserRole } from "./auth.types";

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
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          role: UserRole;
          is_active: boolean;
          email_verified: boolean;
          email_verification_token: string | null;
          email_verification_expires: string | null;
          password_reset_token: string | null;
          password_reset_expires: string | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          role?: UserRole;
          is_active?: boolean;
          email_verified?: boolean;
          email_verification_token?: string | null;
          email_verification_expires?: string | null;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          role?: UserRole;
          is_active?: boolean;
          email_verified?: boolean;
          email_verification_token?: string | null;
          email_verification_expires?: string | null;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          title: Title;
          family_name: string;
          gender: Gender;
          phone_number: string;
          email: string;
          total_contract_value: number | null;
          join_date: string | null;
          company_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title?: Title;
          family_name: string;
          gender: Gender;
          phone_number: string;
          email: string;
          total_contract_value?: number | null;
          join_date?: string | null;
          company_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: Title;
          family_name?: string;
          gender?: Gender;
          phone_number?: string;
          email?: string;
          total_contract_value?: number | null;
          join_date?: string | null;
          company_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          email: string;
          address: string;
          phone_number: string;
          contact_person: string | null;
          industry: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          address: string;
          phone_number: string;
          contact_person?: string | null;
          industry?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          address?: string;
          phone_number?: string;
          contact_person?: string | null;
          industry?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          type: string;
          start_date: string | null;
          finish_date: string | null;
          budget: string;
          payment_terms: PaymentTerms;
          status: ProjectStatus;
          priority: ProjectPriority;
          description: string;
          completion_date: string | null;
          client_id: string;
          project_manager: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          start_date?: string | null;
          finish_date?: string | null;
          budget: string;
          payment_terms: PaymentTerms;
          status: ProjectStatus;
          priority: ProjectPriority;
          description: string;
          completion_date?: string | null;
          client_id: string;
          project_manager?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          start_date?: string | null;
          finish_date?: string | null;
          budget?: string;
          payment_terms?: PaymentTerms;
          status?: ProjectStatus;
          priority?: ProjectPriority;
          description?: string;
          completion_date?: string | null;
          client_id?: string;
          project_manager?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          name: string;
          description: string;
          start_date: string;
          finish_date: string;
          completion_date: string | null;
          status: MilestoneStatus;
          remarks: string | null;
          project_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          start_date: string;
          finish_date: string;
          completion_date?: string | null;
          status: MilestoneStatus;
          remarks?: string | null;
          project_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          start_date?: string;
          finish_date?: string;
          completion_date?: string | null;
          status?: MilestoneStatus;
          remarks?: string | null;
          project_id?: string;
          created_at?: string;
          updated_at?: string;
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
          project_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          amount: string;
          status: PaymentStatus;
          date: string;
          method: PaymentMethod;
          project_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          amount?: string;
          status?: PaymentStatus;
          date?: string;
          method?: PaymentMethod;
          project_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          title: Title | null;
          name: string;
          family_name: string;
          preferred_name: string | null;
          gender: Gender;
          phone_number: string;
          email: string;
          photo: string | null;
          user_id: string | null;
          status: EmployeeStatus;
          department: string | null;
          position: string | null;
          join_date: string | null;
          salary: number | null;
          emergency_contact: string | null;
          emergency_phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: Title | null;
          name: string;
          family_name: string;
          preferred_name?: string | null;
          gender: Gender;
          phone_number: string;
          email: string;
          photo?: string | null;
          user_id?: string | null;
          status?: EmployeeStatus;
          department?: string | null;
          position?: string | null;
          join_date?: string | null;
          salary?: number | null;
          emergency_contact?: string | null;
          emergency_phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: Title | null;
          name?: string;
          family_name?: string;
          preferred_name?: string | null;
          gender?: Gender;
          phone_number?: string;
          email?: string;
          photo?: string | null;
          user_id?: string | null;
          status?: EmployeeStatus;
          department?: string | null;
          position?: string | null;
          join_date?: string | null;
          salary?: number | null;
          emergency_contact?: string | null;
          emergency_phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      communication_logs: {
        Row: {
          id: string;
          date: string;
          channel: CommunicationChannel;
          summary: string;
          follow_up_required: boolean;
          follow_up_date: string | null;
          client_id: string;
          employee_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          channel: CommunicationChannel;
          summary: string;
          follow_up_required: boolean;
          follow_up_date?: string | null;
          client_id: string;
          employee_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          channel?: CommunicationChannel;
          summary?: string;
          follow_up_required?: boolean;
          follow_up_date?: string | null;
          client_id?: string;
          employee_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: string | null;
          created_at?: string;
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

export type ProjectMember =
  Database["public"]["Tables"]["project_members"]["Row"];
export type ProjectMemberInsert =
  Database["public"]["Tables"]["project_members"]["Insert"];
export type ProjectMemberUpdate =
  Database["public"]["Tables"]["project_members"]["Update"];

export type UserDB = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AuditLogInsert =
  Database["public"]["Tables"]["audit_logs"]["Insert"];
export type AuditLogUpdate =
  Database["public"]["Tables"]["audit_logs"]["Update"];
