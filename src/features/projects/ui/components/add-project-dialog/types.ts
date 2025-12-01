import {
  PaymentTerms,
  ProjectStatus,
  ProjectPriority,
} from "@/features/projects/domain/types";

export interface ProjectFormData {
  name: string;
  type: string;
  startDate: string;
  finishDate: string;
  budget: string;
  paymentTerms: (typeof PaymentTerms)[keyof typeof PaymentTerms];
  status: (typeof ProjectStatus)[keyof typeof ProjectStatus];
  priority: (typeof ProjectPriority)[keyof typeof ProjectPriority];
  description: string;
  clientId: string;
}

export const getInitialFormData = (): ProjectFormData => ({
  name: "",
  type: "",
  startDate: "",
  finishDate: "",
  budget: "",
  paymentTerms: PaymentTerms.NET_30D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.MEDIUM,
  description: "",
  clientId: "",
});
