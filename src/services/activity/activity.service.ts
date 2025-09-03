import { IActivityRepository } from "../../repositories/activity.repository.ts";
import { logger } from "../../utils/logger.ts";

interface IHasNewActivity {
  userIDLoged: number;
  osID: number;
}

interface IActivity {
  hasNewActivity({ userIDLoged, osID }: IHasNewActivity): any;
}

export class ActivityService implements IActivity {
  private activityRepository: IActivityRepository;

  constructor(activityRepository: IActivityRepository) {
    this.activityRepository = activityRepository;
  }

  async hasNewActivity({ userIDLoged, osID }: IHasNewActivity) {
    try {

      const existsNewOs = await this.activityRepository.getActivityList({
        osID,
      });

      return existsNewOs;
    } catch (error: any) {
      await logger(`[SER]: ${error.errors}`);
    }
  }
}
