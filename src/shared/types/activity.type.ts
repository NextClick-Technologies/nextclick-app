export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "comment" | "update" | "call" | "share";
}
