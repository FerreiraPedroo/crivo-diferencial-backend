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

      readOs["activities"] = await this.activityRepository.getActivityByOs({
        osID,
      });

      return readOs;
    } catch (error: any) {
      await logger(
        `[ADMIN:SER]: ${error.message} | userIDLoged:${userIDLoged} |  osID:${osID}`
      );
      throw error.message;
    }
  }
}
