
import { IOrderServiceRepository } from "../../repositories/order-service.repository.js";
import { logger } from "../../../../utils/logger.js";

interface IHasNewOrderService {
  userIDLoged: number;
  osID: number;
  status: string;
}

interface IOrderService {
  finishOrderService({ userIDLoged, osID }: IHasNewOrderService): any;
}

export class FinishOrderServiceService implements IOrderService {
  private orderServiceRepository: IOrderServiceRepository;

  constructor(orderServiceRepository: IOrderServiceRepository) {
    this.orderServiceRepository = orderServiceRepository;
  }

  async finishOrderService({ userIDLoged, osID, status }: IHasNewOrderService) {
    try {
      const existsNewOs = await this.orderServiceRepository.getOs({
        userIDLoged,
        osID,
      });

      if (!existsNewOs) {
        throw "OS não encontrada.";
      }

      const finishedOrderService = await this.orderServiceRepository.finishOs({
        osID,
        status,
      });

      return "OS Finalizada.";
    } catch (error: any) {
      await logger(
        `[SER]: ${error.errors} | userIDLoged:${userIDLoged} | osIDs:${osID} `
      );
      throw error;
    }
  }
}
