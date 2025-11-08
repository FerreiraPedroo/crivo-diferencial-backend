export interface IActivityPhoto {
  id?: number;
  activity_id: number;
  position: number;
  type: string;
  photo_filepath: string;
  photo_webviewpath: string
  thumb_filepath: string
  thumb_webviewpath: string
  status: string;
}
