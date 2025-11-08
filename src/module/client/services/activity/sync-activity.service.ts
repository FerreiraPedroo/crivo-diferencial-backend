import { IActivityRepository } from "../../repositories/activity.repository.js";
import { IOrderServiceRepository } from "../../repositories/order-service.repository.js";
import { IActivityPhotoRepository } from "../../repositories/os-activity-photo.repository.js";
import { StorageFile } from "../../../../utils/storage.js";
import { logger } from "../../../../utils/logger.js";

interface IUploadActivityPhoto {
  userIDLoged: number;
  osID: number;
  activityID: number;
  photoType: string;
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

      if (!existsOs?.length) {
        throw "Ordem de serviço não encontrada.";
      }

      const existsActivity = await this.activityRepository.getActivityById({
        osID,
        activityID,
      });

      if (!existsActivity?.length) {
        throw "Atividade não encontrada.";
      }

      const size = file.size;
      const filePath = `uploads/os/${osID}/`;
      const fileName = `${osID}_${activityID}_${index}_${photoType}.${file.originalname
        .split(".")
        .at(-1)}`;

      const existPhoto = await this.activityPhotoRepository.getActivityPhoto({
        osID,
        activityID,
        index,
        photoType,
      });

      if (existPhoto.length) {
        try {
          await StorageFile.saveFile({
            filePath,
            fileName,
            fileBuffer: file.buffer,
          });
        } catch (error: any) {
          await logger(
            `[SER]: Erro ao salvar o arquivo | error: ${error.message}`
          );
          throw error;
        }

        const updatedActivityPhoto =
          await this.activityPhotoRepository.updateActivityPhoto({
            osID,
            activityID,
            photoType,
            index,
            size,
            fullPathFile: `${filePath}${fileName}`,
          });

        return updatedActivityPhoto.rows[0];
      } else {
        try {
          await StorageFile.saveFile({
            filePath,
            fileName,
            fileBuffer: file.buffer,
          });
        } catch (error: any) {
          await logger(
            `[SER]: Erro ao salvar o arquivo | error: ${error.message}`
          );
          throw error;
        }
        const fullPathFile = `${filePath}${fileName}`;

        const savedActivityPhoto =
          await this.activityPhotoRepository.saveActivityPhoto({
            osID,
            activityID,
            photoType,
            index,
            size,
            fullPathFile,
          });

        if (!savedActivityPhoto) {
          throw "Foto não foi salva.";
        }

        return savedActivityPhoto.rows[0];
      }
    } catch (error: any) {
      await logger(`[SER]: ${error}`);
      return null;
    }
  }
}
