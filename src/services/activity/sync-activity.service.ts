import { IActivityRepository } from "../../repositories/activity.repository.ts";
import { IOrderServiceRepository } from "../../repositories/order-service.repository.ts";
import { logger } from "../../utils/logger.ts";

interface IUploadActivityPhoto {
  userIDLoged: number;
  osID: number;
  activityID: number;
  photoType: number;
  position: number;
  file: Express.Multer.File;
}

interface IActivity {
  syncActivity({
    userIDLoged,
    osID,
    activityID,
    photoType,
    position,
    file,
  }: IUploadActivityPhoto): any;
}

export class SyncActivityService implements IActivity {
  private orderServiceRepository: IOrderServiceRepository;
  private activityRepository: IActivityRepository;

  constructor(
    orderServiceRepository: IOrderServiceRepository,
    activityRepository: IActivityRepository
  ) {
    this.orderServiceRepository = orderServiceRepository;
    this.activityRepository = activityRepository;
  }

  async syncActivity({
    userIDLoged,
    osID,
    activityID,
    photoType,
    position,
    file,
  }: IUploadActivityPhoto) {
    try {
      const existsOs = await this.orderServiceRepository.getOs({
        userIDLoged,
        osID,
      });

      if (!existsOs) {
        throw "Os não existe.";
      }

      const existsActivity = await this.activityRepository.getActivity({
        osID,
      });

      if(existsActivity){
        
      }
    } catch (error: any) {
      await logger(`[SER]: ${error.message}`);
      return null;
    }
  }
}
