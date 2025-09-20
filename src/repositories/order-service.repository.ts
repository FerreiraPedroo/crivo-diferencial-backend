import { pool } from "../database/pg.database.js";
import { logger } from "../utils/logger.ts";

export interface IOrderServiceRepository {
  hasNewOs({ userIDLoged, osIDsList }: IHasNewOs): any;
  getOs({ userIDLoged, osID }: IGetOs): any;
}

interface IGetOs {
  userIDLoged: number;
  osID: number;
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

    const query = `SELECT * FROM os WHERE user_id = ${userIDLoged} ${
      queryIN && `AND id NOT IN (${queryIN})`
    }`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(
        `[REP]: ${error.errors} | user:${userIDLoged} | param:${osIDsList}`
      );
      return [];
    }
  }
  async getOs({ userIDLoged, osID }: { userIDLoged: number; osID: number }) {
    const query = `SELECT * FROM os WHERE user_id = ${userIDLoged} AND id = ${osID}`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(
        `[REP]: ${error.errors} | user:${userIDLoged} | param:${osID}`
      );
      return null;
    }
  }
}
