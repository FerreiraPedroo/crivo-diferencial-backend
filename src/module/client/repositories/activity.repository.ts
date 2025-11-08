import { pool } from "../../../database/pg.database.js";
import { logger } from "../../../utils/logger.js";

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
    const query = `
    SELECT os_activity.*, activity.name FROM os_activity 
    LEFT JOIN activity ON os_activity.activity_id = activity.id
    WHERE os_activity.os_id = ${osID}
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.message} | os:${osID}`);
      return [];
    }
  }

  async getActivityById({ osID, activityID }: IGetActivity) {
    const query = `SELECT * FROM os_activity WHERE os_activity.activity_id = ${activityID} AND os_activity.os_id = ${osID}`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.message} | os:${osID}`);
      return null;
    }
  }

  async getActivityList() {
    const queryActivity = `SELECT * FROM activities WHERE status = 'active'`;

    try {
      const activityList = await pool.query(queryActivity);
      return activityList.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.message}`);
      return [];
    }
  }
}
