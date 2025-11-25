// Title enum values
export const Title = {
  MR: "mr",
  MRS: "mrs",
  MS: "ms",
  DR: "dr",
  PROF: "prof",
  SR: "sr",
} as const;
export type Title = (typeof Title)[keyof typeof Title];
