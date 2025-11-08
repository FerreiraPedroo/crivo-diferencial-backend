import { pool } from "../../../database/pg.database.js";
import { logger } from "../../../../../utils/logger.js";

export interface IUserRepository {
  getNewUserData({ userLogedID }: IGetNewUserData): any;
  // getActivityById({ osID, activityID }: IGetActivity): any;
}

interface IGetNewUserData {
  userLogedID: number;
}

interface IGetActivity {
  osID: number;
  activityID: number;
}

export class UserRepository implements IUserRepository {
  async getNewUserData({ userLogedID }: IGetNewUserData) {
    const queryUser = `SELECT * FROM users WHERE status = 'active'`;

    try {
      const usersList = await pool.query(queryUser);
      return usersList.rows;
    } catch (error: any) {
      await logger(`[REP]: ${error.message} | os:${userLogedID}`);
      return [];
    }
  }

  // async getActivityById({ osID, activityID }: IGetActivity) {
  //   const query = `SELECT * FROM os_activity WHERE os_activity.id = ${activityID} AND os_activity.os_id = ${osID}`;

  //   try {
  //     const result = await pool.query(query);

  //     return result.rows;
  //   } catch (error: any) {
  //     await logger(`[REP]: ${error.message} | os:${osID}`);
  //     return null;
  //   }
  // }
}
