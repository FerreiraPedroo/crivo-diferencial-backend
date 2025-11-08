import { IActivityRepository } from "../../repositories/activity.repository.js";
import { IOrderServiceRepository } from "../../repositories/order-service.repository.js";
import { logger } from "../../../../utils/logger.js";

interface IHasNewOrderService {
  userIDLoged: number;
  osIDs: string;
}

interface IOrderService {
  hasNewOrderService({ userIDLoged, osIDs }: IHasNewOrderService): any;
}

export class HasNewOrderServiceService implements IOrderService {
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
      let osIDsList: string[] = [];

      if (osIDs) {
        osIDsList.push(...osIDs.split("|").filter((v) => v));
      }

      const existsNewOs = await this.orderServiceRepository.hasNewOs({
        userIDLoged,
        osIDsList,
      });

      for (let i = 0; i < existsNewOs.length; i++) {
        let osActivity = await this.activityRepository.getActivityByOsId({
          osID: existsNewOs[i].id,
        });

        if (osActivity.length) {
          osActivity = osActivity.map((a: any) => {
            a.beforePhoto = [null, null, null];
            a.afterPhoto = [null, null, null];
            return a;
          });
        }

        existsNewOs[i].activity = osActivity;
      }

      return existsNewOs;
    } catch (error: any) {
      await logger(
        `[SER]: ${error.message} | userIDLoged:${userIDLoged} | osIDs:${osIDs} `
      );
      return [];
    }
  }
}
