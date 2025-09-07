import { pool } from "../database/pg.database.ts";
import { logger } from "../utils/logger.ts";

export interface IActivityPhotoRepository {
  getActivityPhoto({ osID, activityID, index }: IGetActivityPhoto): any;
  saveActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    fileBuffer,
  }: IActivityPhoto): any;
  updateActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    fullFilePath,
  }: IUpdateActivityPhoto): any;
}

interface IActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  index: number;
  fileBuffer: Buffer;
}

interface IUpdateActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  index: number;
  fullFilePath: string;
}

interface IGetActivityPhoto {
  osID: number;
  activityID: number;
  index: number;
}

export class ActivityPhotoRepository implements IActivityPhotoRepository {
  async getActivityPhoto({ osID, activityID, index }: IGetActivityPhoto) {
    const query = `SELECT * FROM os_activity_photo AS osp WHERE osp.activity_id = ${activityID} AND osp.os_id = ${osID} AND osp.index = ${index}`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.errors} | os:${osID} | activity:${activityID} index:${index}`);
      throw new Error(`[REP]: ${error.errors} | os:${osID} | activity:${activityID} index:${index}`);
    }
  }

  async saveActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    fileBuffer,
  }: IActivityPhoto) {
    return "";
  }

  async updateActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    fullFilePath,
  }: IUpdateActivityPhoto) {

    const query = `
    UPDATE os_activity_photo 
    SET file = '${fullFilePath}' 
    WHERE os_activity_photo.os_id = ${osID} AND os_activity_photo.activity_id = ${activityID} AND os_activity_photo.type = '${photoType}' AND os_activity_photo.index = ${index}
    `;

    try {
      const result = await pool.query(query);

      return result;
    } catch (error: any) {
      console.log(error)
      await logger(`[REP]: ${JSON.stringify(error)} | os:${osID} | activity:${activityID} index:${index}`);
      throw new Error(`[REP]: ${JSON.stringify(error)} | os:${osID} | activity:${activityID} index:${index}`);
    }

  }
}
