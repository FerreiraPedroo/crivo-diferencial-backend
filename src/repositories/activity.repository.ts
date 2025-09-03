import { pool } from "../database/pg.database.js";
import { logger } from "../utils/logger.ts";

export interface IActivityRepository {
  getActivityList({ osID }: IGetActivityList): any;
}

interface IGetActivityList {
  osID: number;
}

export class ActivityRepository implements IActivityRepository {
  async getActivityList({ osID }: IGetActivityList) {
    const query = `SELECT * FROM os_activity WHERE os_id = ${osID}`;
    console.log(query)
    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      console.log(error)
      await logger(`[REP]: ${error.errors} | os:${osID}`);
      return [];
    }
  }
}
