export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  value: number;
  projects: number;
  avatar?: string;
}
