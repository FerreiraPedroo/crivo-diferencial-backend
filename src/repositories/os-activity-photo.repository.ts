import { pool } from "../database/pg.database.ts";
import { logger } from "../utils/logger.ts";

export interface IActivityPhotoRepository {
  getActivityPhoto({ osID, activityID, index }: IGetActivityPhoto): any;
  saveActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    size,
    fullPathFile,
  }: IActivityPhoto): any;
  updateActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    fullPathFile,
  }: IUpdateActivityPhoto): any;
}

interface IActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  index: number;
  size: number;
  fullPathFile: string;
}

interface IUpdateActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  index: number;
  size: number;
  fullPathFile: string;
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
      await logger(
        `[REP]: ${error.errors} | os:${osID} | activity:${activityID} index:${index}`
      );
      throw new Error(
        `[REP]: ${error.errors} | os:${osID} | activity:${activityID} index:${index}`
      );
    }
  }

  async saveActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    size,
    fullPathFile,
  }: IActivityPhoto) {
    const query = `
    INSERT INTO os_activity_photo (os_id, activity_id, index, type, file, size, status) 
    VALUES (${osID}, ${activityID}, ${index}, '${photoType}', '${fullPathFile}', ${size}, 'enviado')
    RETURNING os_id, activity_id, index, type, file, size, status`;

    try {
      const result = await pool.query(query);

      return result;
    } catch (error: any) {
      await logger(
        `[REP]: ${JSON.stringify(
          error
        )} | os:${osID} | activity:${activityID} index:${index}`
      );
      throw new Error(
        `[REP]: ${JSON.stringify(
          error
        )} | os:${osID} | activity:${activityID} index:${index}`
      );
    }
  }

  async updateActivityPhoto({
    osID,
    activityID,
    photoType,
    index,
    size,
    fullPathFile,
  }: IUpdateActivityPhoto) {
    const query = `
    UPDATE os_activity_photo 
    SET file = '${fullPathFile}',
        size = ${size},
        status = 'enviado',
        client_check = null
    WHERE os_activity_photo.os_id = ${osID} AND os_activity_photo.activity_id = ${activityID} AND os_activity_photo.type = '${photoType}' AND os_activity_photo.index = ${index} AND os_activity_photo.type = ${photoType}
    `;

    try {
      const result = await pool.query(query);

      return result;
    } catch (error: any) {
      await logger(
        `[REP]: ${JSON.stringify(
          error
        )} | os:${osID} | activity:${activityID} index:${index}`
      );
      throw new Error(
        `[REP]: ${JSON.stringify(
          error
        )} | os:${osID} | activity:${activityID} index:${index}`
      );
    }
  }
}
