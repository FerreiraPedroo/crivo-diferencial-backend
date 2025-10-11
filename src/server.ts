import "dotenv/config";

import { app } from "./app.ts";
import { pool } from "./database/pg.database.ts";

app.listen(3000, () => {
  console.log("SERVIDOR ATIVO 🟢");
  // console.log(app)
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
