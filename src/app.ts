import express from "express";
import cors from "cors";

import { ordersServiceRoutes } from "./routes/order-service.routes.js";
import { createTables, registers } from "./database/seeds.js";
import { pool } from "./database/pg.database.js";
import { config } from "./config/config.js";

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
  try {
    const { iniciar }: any = req.params;

    let texto: any = { params: iniciar };

    if (iniciar == "sim") {
      const r1 = await pool.query(createTables[0]);
      texto["r1"] = r1;
      const r2 = await pool.query(registers[0]);
      texto["r2"] = r2;
    } else if (iniciar == "os") {
      const c1 = await pool.query("SELECT * FROM os");
      texto["c1"] = c1;
    } else if (iniciar == "env") {
      texto["config"] = config;
    }

    res.status(201).send(texto);
  } catch (error) {
    return res.status(201).send(error);
  }
});

export { app };
