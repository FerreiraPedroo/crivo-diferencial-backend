import "dotenv/config";

import { app } from "./app.js";
import { pool } from "./database/pg.database.js";

app.listen(3000, () => {
  console.log("SERVIDOR ATIVO 🟢");

});
// app.listen(3000, "0.0.0.0");

process.on("SIGINT", async () => {
  console.log("Encerrando pool de conexões...");
  await pool.end(); // fecha TODAS as conexões abertas
  process.exit(0);
});

process.on("exit", async () => {
  await pool.end();
  process.exit(0);
});
