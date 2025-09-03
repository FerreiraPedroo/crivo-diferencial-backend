import { IActivityRepository } from "../../repositories/activity.repository.ts";
import { IOrderServiceRepository } from "../../repositories/order-service.repository.ts";
import { logger } from "../../utils/logger.ts";

interface IHasNewOrderService {
  userIDLoged: number;
  osIDs: string;
}

interface IOrderService {
  hasNewOrderService({ userIDLoged, osIDs }: IHasNewOrderService): any;
}

export class OrderServiceService implements IOrderService {
  private orderServiceRepository: IOrderServiceRepository;
  private activityRepository: IActivityRepository;

  constructor(
    orderServiceRepository: IOrderServiceRepository,
    activityRepository: IActivityRepository
  ) {
    this.orderServiceRepository = orderServiceRepository;
    this.activityRepository = activityRepository;
  }

  async hasNewOrderService({ userIDLoged, osIDs }: IHasNewOrderService) {
    try {
      let osIDsList = [];

      if (osIDs) {
        osIDsList.push(...osIDs.split("|"));
      }

      const existsNewOs = await this.orderServiceRepository.hasNewOs({
        userIDLoged,
        osIDsList,
      });

      for (let i = 0; i < existsNewOs.length; i++) {

        const osActivity = await this.activityRepository.getActivityList({
          osID: existsNewOs[i].id,
        });
        existsNewOs[i].activity = osActivity;
      }

      return existsNewOs;
    } catch (error: any) {
      await logger(`[SER]: ${error.errors}`);
    }
  }
}
