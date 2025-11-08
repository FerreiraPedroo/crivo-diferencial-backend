import { pool } from "../../../database/pg.database.js";
import { logger } from "../../../utils/logger.js";

export interface IAdminActivityRepository {
  getActivityByOs({ osID }: IGetActivityOs): any;
}

interface IGetActivityOs {
  osID: string;
}

export class AdminActivityRepository implements IAdminActivityRepository {
  async getActivityByOs({ osID }: IGetActivityOs) {
    const query = `
    SELECT (
      SELECT json_agg(
        json_build_object(
          'id',osactivity.id, 'name',act.name, 'category',act.category, 'sub_category',act.sub_category, 'description',act.description, 'status', osactivity.status,
          'photos', (
            SELECT json_agg(row_to_json(actphoto))
            FROM os_activity_photo actphoto
            WHERE os_id = ${osID} AND activity_id = act.id
          )
        )
      ) AS activities
      FROM activity act
      WHERE osactivity.activity_id = act.id
    )
    FROM os_activity osactivity
    WHERE os_id = ${osID}    
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error: any) {
      await logger(`[ADMIN:REP]: ${error.message} | osID:${osID}`);
      throw error.message;
    }
  }
}
