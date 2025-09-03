// import { pool } from "../database/pg.database.ts";
import { NextFunction } from "express";
import { OrderServiceRepository } from "../repositories/order-service.repository.ts";
import { OrderServiceService } from "../services/order-service/order-service.service.ts";
import { logger } from "../utils/logger.ts";
import { ActivityRepository } from "../repositories/activity.repository.ts";

export class OrderServiceController {
  static async getOrderService(req, res, next) {
    const userIDLoged = 1;
    const { osIDs } = req.query;

    try {
      const orderServiceRepository = new OrderServiceRepository();
      const activityRepository = new ActivityRepository();

      const osService = new OrderServiceService(
        orderServiceRepository,
        activityRepository
      );


      const osList = await osService.hasNewOrderService({ userIDLoged, osIDs });

      res.send(osList);
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
    }
  }
}
