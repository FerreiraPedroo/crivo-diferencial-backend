// import type { IActivityPhoto } from "./IActivityPhoto";

export interface IActivity {
  id?: number;
  os_id: number;
  name: string;
  comment: string | null;
  status: string;
  // beforePhoto: (IActivityPhoto | null)[];
  // afterPhoto: (IActivityPhoto | null)[];
}
