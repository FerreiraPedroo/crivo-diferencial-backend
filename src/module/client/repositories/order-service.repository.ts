import { pool } from "../../../database/pg.database.js";
import { logger } from "../../../utils/logger.js";

export interface IOrderServiceRepository {
  hasNewOs({ userIDLoged, osIDsList }: IHasNewOs): any;
  getOs({ userIDLoged, osID }: IGetOs): any;
  finishOs({ osID, status }: IFinishOs): any;
}

interface IFinishOs {
  osID: number;
  status: string;
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
        `[REP]: ${error.message} | user:${userIDLoged} | param:${osIDsList}`
      );
      return [];
    }
  }
  async getOs({ userIDLoged, osID }: { userIDLoged: number; osID: number }) {
    const query = `SELECT * FROM os WHERE user_id = ${userIDLoged} AND id = ${osID}`;
    console.log(query);
    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      await logger(
        `[REP]: ${error.message} | user:${userIDLoged} | param:${osID}`
      );
      return null;
    }
  }
  async finishOs({ osID, status }: IFinishOs) {
    const query = `
    UPDATE os 
    SET status = '${status}'
    WHERE id = ${osID}`;

    try {
      const result = await pool.query(query);
      return result;
    } catch (error: any) {
      const logError = `[REP]: ${error.message} | OSid:${osID} | status:${status}`;

      await logger(logError);
      throw new Error(logError);
    }
  }
}
