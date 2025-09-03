import { pool } from "../database/pg.database.js";
import { logger } from "../utils/logger.ts";


export interface IOrderServiceRepository {
  hasNewOs({ userIDLoged, osIDsList }: IHasNewOs): any;
}

interface IHasNewOs {
  userIDLoged: number;
  osIDsList: string[];
}

export class OrderServiceRepository implements IOrderServiceRepository {
  async hasNewOs({ userIDLoged, osIDsList }: IHasNewOs) {
    const queryIN = osIDsList.reduce((acc, id, index) => {
      if (!index) {
        acc += `${id}`;
      } else {
        acc += `,${id}`;
      }
      return acc;
    }, "");

    const query = `SELECT * FROM os WHERE user_id = ${userIDLoged} AND id NOT IN (${queryIN})`;
    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.errors} | user:${userIDLoged} | param:${osIDsList}`);
      return [];
    }
  }
}
