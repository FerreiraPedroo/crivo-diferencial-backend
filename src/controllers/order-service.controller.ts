import { NextFunction, Request, Response } from "express";

import { OrderServiceRepository } from "../repositories/order-service.repository.ts";
import { ActivityRepository } from "../repositories/activity.repository.ts";

import { SyncActivityService } from "../services/activity/sync-activity.service.ts";
import { HasNewOrderServiceService } from "../services/order-service/has-new-order-service.service.ts";

import { logger } from "../utils/logger.ts";
import { ActivityPhotoRepository } from "../repositories/os-activity-photo.repository.ts";

export class OrderServiceController {
  static async syncOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;

    try {
      const { osID, activityID, photoType, index } = req.body;
      const file = req.file;

      if (!(osID && activityID && photoType && index && file)) {
        throw "Está faltando alguma informação da foto.";
      }

      const activityPhotoRepository = new ActivityPhotoRepository();
      const orderServiceRepository = new OrderServiceRepository();
      const activityRepository = new ActivityRepository();

      const syncActivity = new SyncActivityService(
        orderServiceRepository,
        activityRepository,
        activityPhotoRepository,
      );

      const photoID = await syncActivity.syncActivity({
        userIDLoged,
        osID,
        activityID,
        photoType,
        index,
        file,
      });

      if (photoID) {
        throw "Foto não salva.";
      }

      res.status(201).send({ code: 201, message: "OK", data: { photoID } });
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send(null);
    }
  }

  static async getOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;
    const osIDs = req.query.osIDs as string;

    try {
      const orderServiceRepository = new OrderServiceRepository();
      const activityRepository = new ActivityRepository();

      const osService = new HasNewOrderServiceService(
        orderServiceRepository,
        activityRepository
      );

      const osList = await osService.hasNewOrderService({ userIDLoged, osIDs });

      res.send(osList);
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send([]);
    }
  }
}
