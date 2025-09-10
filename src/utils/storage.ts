import * as fs from "node:fs/promises";

interface ISaveFile {
  filePath: string;
  fileName: string;
  fileBuffer: Buffer;
}

interface IDeleteFile {
  fullPathFile: string;
}

export class StorageFile {
  /**
   *
   * @param [fullPathFile] Pasta e nome do arquivo. Ex: photo/minha_photo.jpg.
   * @param [file] Dados do arquivo.
   */
  static async saveFile({ filePath, fileName, fileBuffer }: ISaveFile) {
    try {
      await fs.access(filePath);
    } catch (error) {
      await fs.mkdir(filePath, { recursive: true });
    }

    try {
      await fs.writeFile(`${filePath}${fileName}`, fileBuffer);
    } catch (error) {
      throw new Error(
        `[STORAGE]: Erro ao salvar o arquivo | erro: ${JSON.stringify(error)}`
      );
    }
  }

  /**
   *
   * @param [fullPathFile] Pasta e nome do arquivo. Ex: photo/minha_photo.jpg.
   */
  static async deleteFile({ fullPathFile }: IDeleteFile) {
    try {
      await fs.unlink(fullPathFile);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error(
          `[STORAGE]: erro: ENOENT | fullPathFile: ${fullPathFile} | descricão: Arquivo não encontrado`
        );
      } else {
        throw new Error(
          `[STORAGE]: erro: ${error.code} | fullPathFile: ${fullPathFile} | descricão: Erro ao remover o arquivo.`
        );
      }
    }
  }
}
