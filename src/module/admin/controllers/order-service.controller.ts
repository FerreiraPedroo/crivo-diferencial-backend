import { NextFunction, Request, Response } from "express";

import { logger } from "../../../utils/logger.js";
import { AdminOrderServiceRepository } from "../repositories/order-service.repository.js";
import { ListOrderServiceService } from "../Services/list-order-service.service.js";
import { ReadOrderServiceService } from "../Services/read-order-service.service.js";
import { AdminActivityRepository } from "../repositories/activity.repository.js";

export class AdminOrderServiceController {
  static async listOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;
    try {
      const orderServiceRepository = new AdminOrderServiceRepository();

      const osService = new ListOrderServiceService(orderServiceRepository);

      const osList = await osService.listOrderService({ userIDLoged });

      res.status(201).send(osList);
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send(error.message);
    }
  }
  static async readOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { osID } = req.params;

    const userIDLoged = 1;
    try {
      const orderServiceRepository = new AdminOrderServiceRepository();
      const activityRepository = new AdminActivityRepository();

      const osService = new ReadOrderServiceService(
        orderServiceRepository,
        activityRepository
      );

      const osList = await osService.readOrderService({ userIDLoged, osID });

      res.status(201).send(osList);
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send(error.message);
    }
  }
}
