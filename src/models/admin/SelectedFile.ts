export type UploadingStatus = "pending" | "uploading" | "failed" | "success";
export interface SelectedFile {
  id:string;
  file: File;
  path:string;
  percentage: number;
  status: UploadingStatus;
}
export interface profile_image {
  id: string;
  url: string;
}




