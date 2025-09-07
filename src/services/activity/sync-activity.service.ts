import path from "node:path";
import { IActivityRepository } from "../../repositories/activity.repository.ts";
import { IOrderServiceRepository } from "../../repositories/order-service.repository.ts";
import { IActivityPhotoRepository } from "../../repositories/os-activity-photo.repository.ts";
import { StorageFile } from "../../utils/storage.ts";
import { logger } from "../../utils/logger.ts";

interface IUploadActivityPhoto {
  userIDLoged: number;
  osID: number;
  activityID: number;
  photoType: number;
  index: number;
  file: Express.Multer.File;
}

interface IActivity {
  syncActivity({
    userIDLoged,
    osID,
    activityID,
    photoType,
    index,
    file,
  }: IUploadActivityPhoto): any;
}

export class SyncActivityService implements IActivity {
  private orderServiceRepository: IOrderServiceRepository;
  private activityRepository: IActivityRepository;
  private activityPhotoRepository: IActivityPhotoRepository;

  constructor(
    orderServiceRepository: IOrderServiceRepository,
    activityRepository: IActivityRepository,
    activityPhotoRepository: IActivityPhotoRepository
  ) {
    this.orderServiceRepository = orderServiceRepository;
    this.activityPhotoRepository = activityPhotoRepository;
    this.activityRepository = activityRepository;
  }

  async syncActivity({
    userIDLoged,
    osID,
    activityID,
    photoType,
    index,
    file,
  }: IUploadActivityPhoto) {
    try {
      const existsOs = await this.orderServiceRepository.getOs({
        userIDLoged,
        osID,
      });

      if (!existsOs) {
        console.log("OS")
        throw "Ordem de serviço não encontrada.";
      }

      const existsActivity = await this.activityRepository.getActivityById({
        osID,
        activityID
      });

      if (!existsActivity?.length) {
        console.log("atividade")
        throw "Atividade não encontrada.";
      }

      const fullFilePath = path.join("uploads", "os", `${osID}`, `${osID}_${activityID}_${photoType}_${index}.${file.originalname.split(".").at(-1)}`)
      const existPhoto = await this.activityPhotoRepository.getActivityPhoto({ osID, activityID, index });

      if (existPhoto.length) {
        try {
          await StorageFile.deleteFile({ fullPathFile: existPhoto[0].file });
        } catch (error: any) {
          await logger(`[SER]: ${error.message}`);
        }

        const savedActivityPhoto = await this.activityPhotoRepository.updateActivityPhoto({
          osID,
          activityID,
          photoType,
          index,
          fullFilePath,
        })

      } else {

        try {
          await StorageFile.saveFile({ fullFilePath, file: fileBuffer });
        } catch (error: any) {
          await logger(`[SER]: ${error.message}`);
        }

        const savedActivityPhoto = await this.activityPhotoRepository.saveActivityPhoto({ osID, activityID, photoType, file, index })

        if (!savedActivityPhoto) {
          throw "Foto não foi salva.";
        }

      }






    } catch (error: any) {
      await logger(`[SER]: ${error.message}`);
      return null;
    }
  }
}
