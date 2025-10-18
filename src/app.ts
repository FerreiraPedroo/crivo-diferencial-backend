import express from "express";
import cors from "cors";

import { Pool } from "pg";
import { ordersServiceRoutes } from "./routes/order-service.routes.js";
import { createTables, registers } from "./database/seeds.js";
import { pool } from "./database/pg.database.js";
import { config } from "./config/config.js";
import { StorageFile } from "./utils/storage.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    // credentials: true,
    // exposedHeaders: ["x-crivo-diferencial"],
  })
);

// ROTAS
app.get("/teste", (req, res, next) => {
  res.send(app.settings);
});
app.use(ordersServiceRoutes);

// ROTAS CONFIG
app.get("/config/db/:iniciar", async (req, res, next) => {
  const iniciar: string = req.params.iniciar;
  let texto: any = { params: iniciar };

  try {
    if (iniciar == "sim") {
      const r1 = await pool.query(createTables[0]);
      texto["r1"] = r1;
      const r2 = await pool.query(registers[0]);
      texto["r2"] = r2;
    } else if (iniciar == "query") {
      const c0 = await pool.query(iniciar.split("#")[1]);
      texto["c0"] = c0;
    } else if (iniciar == "os") {
      const c1 = await pool.query("SELECT * FROM os");
      texto["c1"] = c1;
    } else if (iniciar == "env") {
      texto["config"] = config;
    } else if (iniciar == "log") {
      const file = await StorageFile.loadFile({
        fullPathFile: "./log/application.log",
      });
      texto["file"] = file.split("\n");
    } else if (iniciar.split("#")[0] == "db") {
      const connectionString = "postgresql://postgres@localhost:5432/crivo";
      const configParams = JSON.parse(iniciar.split("#")[1]);

      const pool2 = new Pool(configParams.config);
      const c2 = await pool2.query("SELECT * FROM os");

      texto["c2"] = c2;
    }
  } catch (error:any) {
    texto["error_tudo"] = error.message;
  }

  return res.status(201).send(texto);
});

export { app };
