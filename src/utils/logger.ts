import * as fs from "fs";
import * as path from "path";

const logDir = path.join("./", "log");
const logFilePath = path.join(logDir, "application.log");

export async function logger(message: string) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  const dataAtual = new Date();
  const opcoes = { timeZone: "America/Sao_Paulo" };
  const dataHoraBrasil = dataAtual.toLocaleString("pt-BR", opcoes);

  const fullMessage = `${dataHoraBrasil} => ${message} \n`;

  fs.appendFile(logFilePath, fullMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    } else {
      console.log(fullMessage);
      console.log("Log message written successfully.");
    }
  });
}
