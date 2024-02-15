export type UploadingStatus = "pending" | "uploading" | "failed" | "success";
export interface SelectedFile {
  id:string;
  referent_id:string;
  file: File;
  path:string;
  percentage: number;
  size: number;
  status: UploadingStatus;
}
export interface image {
  id: string;
  url: string;
}




