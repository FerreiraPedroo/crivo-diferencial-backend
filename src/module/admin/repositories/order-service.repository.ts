import { pool } from "../../../database/pg.database.js";
import { logger } from "../../../utils/logger.js";

export interface IAdminOsRepository {
  getListOs({ userIDLoged }: IGetListOs): any;
  readOs({ osID, userIDLoged }: IReadOs): any;
}

interface IGetListOs {
  userIDLoged: number;
}

interface IReadOs {
  userIDLoged: number;
  osID: string;
}

export class AdminOrderServiceRepository implements IAdminOsRepository {
  async getListOs({ userIDLoged }: IGetListOs) {
    const query = `SELECT * FROM os WHERE user_id = ${userIDLoged}`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error: any) {
      await logger(`[ADMIN:REP]: ${error.message} | user:${userIDLoged}`);
      throw error.message;
    }
  }
  async readOs({ userIDLoged, osID }: IReadOs) {
    const query = `SELECT * FROM os WHERE id = ${osID} AND user_id = ${userIDLoged}`;
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error: any) {
      await logger(
        `[ADMIN:REP]: ${error.message} | user_id:${userIDLoged} | osID:${osID}`
      );
      throw error.message;
    }
  }
}
