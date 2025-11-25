import { Title, Gender } from "@/const";

export interface ClientFormData {
  title: (typeof Title)[keyof typeof Title];
  name: string;
  familyName: string;
  gender: (typeof Gender)[keyof typeof Gender];
  phoneNumber: string;
  email: string;
}

export const getInitialClientFormData = (): ClientFormData => ({
  title: Title.MR,
  name: "",
  familyName: "",
  gender: Gender.MALE,
  phoneNumber: "",
  email: "",
});
