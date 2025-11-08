import { NextFunction, Request, Response } from "express";

import { OrderServiceRepository } from "../repositories/order-service.repository.js";
import { ActivityRepository } from "../repositories/activity.repository.js";

import { SyncActivityService } from "../../../services/activity/sync-activity.service.js";
import { HasNewOrderServiceService } from "../../../services/order-service/has-new-order-service.service.js";

import { logger } from "../../../../../utils/logger.js";
import { ActivityPhotoRepository } from "../repositories/os-activity-photo.repository.js";
import { FinishOrderServiceService } from "../../../services/order-service/finish-order-service.service.js";
import { UserRepository } from "../../admin/repositories/user.repository.js";

interface IParams {
  activityPhotoID?: number;
  osID?: number;
  activityID?: number;
  photoType?: string;
  index?: number;
  size?: number;
}
export class OrderServiceController {
  static async syncOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;
    try {
      const userRepository = new UserRepository();

      const userService = new UserService(userRepository);
      const savedPhoto = await userService.getNewUserData({ userIDLoged });

      if (!savedPhoto) {
        throw "Foto não salva.";
      }

      setTimeout(() => {
        res.status(201).send({ code: 201, message: "OK", data: savedPhoto });
      }, 5000);
    } catch (error: any) {
      await logger(`[CRTL]: ${error}`);
      res.status(500).send(null);
    }
  }
  static async finishOrderService(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userIDLoged = 1;
    try {
      const { osID, status } = req.body;

      if (!(osID && status)) {
        throw "Está faltando alguma informação da OS.";
      }

      const orderServiceRepository = new OrderServiceRepository();

      const finishOrderService = new FinishOrderServiceService(
        orderServiceRepository
      );

      const finishedOrderService = await finishOrderService.finishOrderService({
        userIDLoged,
        osID,
        status,
      });

      setTimeout(() => {
        res
          .status(201)
          .send({ code: 201, message: "OK", data: finishedOrderService });
      }, 1000);
    } catch (error: any) {
      await logger(`[CRTL]: ${error}`);
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

    try {
      const orderServiceRepository = new OrderServiceRepository();
      const activityRepository = new ActivityRepository();

      const osService = new HasNewOrderServiceService(
        orderServiceRepository,
        activityRepository
      );

      const osList = await osService.hasNewOrderService({ userIDLoged, osIDs });

      res.status(201).send(osList);
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      res.status(500).send([]);
    }
  }
}
