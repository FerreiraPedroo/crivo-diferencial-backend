import "dotenv/config";

import { app } from "./app.ts";


app.listen(3000, () => {
  console.log("SERVIDOR ATIVO 🟢");
});

process.on("exit", () => {
  // pool.end();
});
