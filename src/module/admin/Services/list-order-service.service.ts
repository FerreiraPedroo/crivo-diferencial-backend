import { IAdminOsRepository } from "../repositories/order-service.repository.js";
import { logger } from "../../../utils/logger.js";
import { IOrderService } from "../../../shared/Interfaces/IOrderService.js";


interface IListOrderService {
  userIDLoged: number;
}

interface IListOrderServiceService {
  listOrderService({ userIDLoged }: IListOrderService): any;
}

export class ListOrderServiceService implements IListOrderServiceService {
  private orderServiceRepository: IAdminOsRepository;

  constructor(orderServiceRepository: IAdminOsRepository) {
    this.orderServiceRepository = orderServiceRepository;
  }

  async listOrderService({ userIDLoged }: IListOrderService) {
    try {
      let listOs = await this.orderServiceRepository.getListOs({
        userIDLoged,
      });

      if (listOs.length) {
        listOs = listOs.map((os: IOrderService) => {
          return {
            id: os.id,
            localization_name: os.localization_name,
            localization: os.localization,
            status: os.status,
            date_created: os.date_created,
          };
        });
      }

      return listOs;
    } catch (error: any) {
      await logger(
        `[ADMIN:SER]: ${error.message} | userIDLoged:${userIDLoged}`
      );
      throw error.message;
    }
  }
}
