import { IActivityPhotoRepository } from "../../repositories/os-activity-photo.repository.ts";
import { logger } from "../../utils/logger.ts";

interface ISyncClientActivity {
  userIDLoged: number;
  osID: number;
  activityPhotoID: number;
  activityID: number;
  photoType: string;
  index: number;
  size: number;
}

interface IActivity {
  syncClientActivity({
    userIDLoged,
    activityPhotoID,
    osID,
    activityID,
    photoType,
    index,
    size,
  }: ISyncClientActivity): any;
}

export class SyncClientActivityService implements IActivity {
  private activityPhotoRepository: IActivityPhotoRepository;

  constructor(activityPhotoRepository: IActivityPhotoRepository) {
    this.activityPhotoRepository = activityPhotoRepository;
  }

  async syncClientActivity({
    osID,
    activityPhotoID,
    activityID,
    photoType,
    index,
    size,
  }: ISyncClientActivity) {
    try {
      const saved = await this.activityPhotoRepository.getClientActivityPhoto({
        activityPhotoID,
      });

      if (!saved.length) {
        throw new Error("Atividade não encontrada");
      }

      if (
        !(
          saved[0].os_id == osID &&
          saved[0].activity_id == activityID &&
          saved[0].type == photoType &&
          saved[0].index == index &&
          saved[0].size == size
        )
      ) {
        throw new Error("Os dados enviados não são validos.");
      }

      const savedSync =
        await this.activityPhotoRepository.validClientActivityPhoto({
          activityPhotoID,
          status: "finalizado",
          clientChecked: "checado",
        });

      if (!savedSync.rowCount) {
        throw new Error("Não foi possivel validar os dados.");
      }

      return "checado";
    } catch (error: any) {
      await logger(`[CRTL]: ${error.message}`);
      throw new Error(error);
    }
  }
}
