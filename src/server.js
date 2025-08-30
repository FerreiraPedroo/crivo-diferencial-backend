import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(3000, () => {
  console.log("SERVIDOR ATIVO 🟢");
});

process.on("exit", () => {
  // pool.end();
});
