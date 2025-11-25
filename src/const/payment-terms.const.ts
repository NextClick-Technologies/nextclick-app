// Payment Terms enum values
export const PaymentTerms = {
  NET_30D: "net_30d",
  NET_60D: "net_60d",
  NET_90D: "net_90d",
  IMMEDIATE: "immediate",
} as const;
export type PaymentTerms = (typeof PaymentTerms)[keyof typeof PaymentTerms];
