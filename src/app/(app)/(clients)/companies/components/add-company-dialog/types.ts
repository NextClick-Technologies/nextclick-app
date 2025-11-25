export interface CompanyFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const getInitialCompanyFormData = (): CompanyFormData => ({
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
});
