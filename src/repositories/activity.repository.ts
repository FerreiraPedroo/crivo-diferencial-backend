import { pool } from "../database/pg.database.js";
import { logger } from "../utils/logger.ts";

export interface IActivityRepository {
  getActivityByOsId({ osID }: IGetActivityByOsId): any;
  getActivityById({ osID, activityID }: IGetActivity): any;
}

interface IUploadActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  position: number;
  file: Express.Multer.File;
}

interface IGetActivity {
  osID: number;
  activityID: number;
}

interface IGetActivityByOsId {
  osID: number;
}

export class ActivityRepository implements IActivityRepository {
  async getActivityByOsId({ osID }: IGetActivityByOsId) {
    const query = `SELECT * FROM os_activity WHERE os_activity.os_id = ${osID}`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.errors} | os:${osID}`);
      return [];
    }
  }

  async getActivityById({ osID, activityID }: IGetActivity) {
    const query = `SELECT * FROM os_activity WHERE os_activity.id = ${activityID} AND os_activity.os_id = ${osID}`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.errors} | os:${osID}`);
      return null;
    }
  }

}
