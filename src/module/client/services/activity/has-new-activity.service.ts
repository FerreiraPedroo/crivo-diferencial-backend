import { IActivityRepository } from "../../repositories/activity.repository.js";
import { logger } from "../../../../utils/logger.js";

interface IHasNewActivity {
  userIDLoged: number;
  osID: number;
}

interface IUploadActivityPhoto {
  osID: number;
  activityID: number;
  photoType: number;
  position: number;
  file: Express.Multer.File;
}

interface IActivity {
  hasNewActivity({ userIDLoged, osID }: IHasNewActivity): any;
}

export class ExistsActivityService implements IActivity {
  private activityRepository: IActivityRepository;

  constructor(activityRepository: IActivityRepository) {
    this.activityRepository = activityRepository;
  }

  async hasNewActivity({ userIDLoged, osID }: IHasNewActivity) {
    try {
      const existsNewOs = await this.activityRepository.getActivityByOsId({
        osID,
      });

      return existsNewOs;
    } catch (error: any) {
      await logger(`[SER]: ${error.errors}`);
    }
  }

}
