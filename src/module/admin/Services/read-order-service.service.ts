import { logger } from "../../../utils/logger.js";

import { IAdminOsRepository } from "../repositories/order-service.repository.js";
import { IAdminActivityRepository } from "../repositories/activity.repository.js";

interface IReadOrderService {
  userIDLoged: number;
  osID: string;
}

interface IReadOrderServiceService {
  readOrderService({ userIDLoged, osID }: IReadOrderService): any;
}

export class ReadOrderServiceService implements IReadOrderServiceService {
  private orderServiceRepository: IAdminOsRepository;
  private activityRepository: IAdminActivityRepository;

  constructor(
    orderServiceRepository: IAdminOsRepository,
    activityRepository: IAdminActivityRepository
  ) {
    this.orderServiceRepository = orderServiceRepository;
    this.activityRepository = activityRepository;
  }

  async readOrderService({ userIDLoged, osID }: IReadOrderService) {
    try {
      let readOs = await this.orderServiceRepository.readOs({
        userIDLoged,
        osID,
      });

      if (!readOs) {
        throw "Ordem de serviço não encontrada.";
      }

      const listActivity = await this.activityRepository.getActivityByOs({
        osID,
      });
      console.log(listActivity[0]);

      if (listActivity.length) {
        readOs["activities"] = listActivity[0].activities;
      } else {
        readOs["activities"] = [];
      }

      return readOs;
    } catch (error: any) {
      await logger(
        `[ADMIN:SER]: ${error.message} | userIDLoged:${userIDLoged} |  osID:${osID}`
      );
      throw error.message;
    }
  }
}
