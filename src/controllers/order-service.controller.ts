import { NextFunction, Request, Response } from "express";

import { OrderServiceRepository } from "../repositories/order-service.repository.ts";
import { ActivityRepository } from "../repositories/activity.repository.ts";

import { SyncActivityService } from "../services/activity/sync-activity.service.ts";
import { HasNewOrderServiceService } from "../services/order-service/has-new-order-service.service.ts";

import { logger } from "../utils/logger.ts";
import { ActivityPhotoRepository } from "../repositories/os-activity-photo.repository.ts";
import { SyncClientActivityService } from "../services/activity/sync-client-activity.service.ts";

interface IParams {
  activityPhotoID?: number;
  osID?: number;
  activityID?: number;
  photoType?: string;
  index?: number;
  size?: number;
}
export class OrderServiceController {
  static async syncClientOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;

    try {
      const {
        activityPhotoID,
        osID,
        activityID,
        photoType,
        index,
        size,
      }: IParams = req.query;

      if (
        !(
          activityPhotoID &&
          osID &&
          activityID &&
          photoType &&
          index != undefined &&
          size
        )
      ) {
        throw new Error("Está faltando alguma informação da foto.");
      }

      const activityPhotoRepository = new ActivityPhotoRepository();

      const syncActivity = new SyncClientActivityService(
        activityPhotoRepository
      );
      const syncClientPhoto = await syncActivity.syncClientActivity({
        userIDLoged,
        activityPhotoID: Number(activityPhotoID),
        osID: Number(osID),
        activityID: Number(activityID),
        photoType,
        index: Number(index),
        size: Number(size),
      });

      res.status(201).send({ code: 201, message: "OK", data: syncClientPhoto });
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send(null);
    }
  }
  static async syncOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;
    try {
      const { osID, activityID, photoType, index } = req.body;
      const file = req.file;

      if (!(osID && activityID && photoType && index != undefined && file)) {
        throw "Está faltando alguma informação da foto.";
      }
      
      const activityPhotoRepository = new ActivityPhotoRepository();
      const orderServiceRepository = new OrderServiceRepository();
      const activityRepository = new ActivityRepository();
      
      const syncActivity = new SyncActivityService(
        orderServiceRepository,
        activityRepository,
        activityPhotoRepository
      );
      const savedPhoto = await syncActivity.syncActivity({
        userIDLoged,
        osID,
        activityID,
        photoType,
        index,
        file,
      });
      console.log(savedPhoto,"OK-----------------------------------------")

      if (!savedPhoto) {
        throw "Foto não salva.";
      }

      res.status(201).send({ code: 201, message: "OK", data: savedPhoto });
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
    const osIDs = req.query.ids as string;
console.log(osIDs);
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
