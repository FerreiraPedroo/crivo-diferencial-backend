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
      const fileName = `${osID}_${activityID}_${photoType}_${index}.${file.originalname
        .split(".")
        .at(-1)}`;

      const existPhoto = await this.activityPhotoRepository.getActivityPhoto({
        osID,
        activityID,
        index,
      });

      if (existPhoto.length) {
        try {
          await StorageFile.deleteFile({ fullPathFile: existPhoto[0].file });
        } catch (error: any) {
          await logger(
            `[SER]: Erro ao deletar o arquvo | error:${error.message}`
          );
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
      }
    } catch (error: any) {
      await logger(`[SER]: ${error.message}`);
      return null;
    }
  }
}
