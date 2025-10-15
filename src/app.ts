import express from "express";
import cors from "cors";

import { ordersServiceRoutes } from "./routes/order-service.routes.js";
import { createTables, registers } from "./database/seeds.js";
import { pool } from "./database/pg.database.js";

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
// app.get("/config/db", async (req, res) => {
//   try {
//     const r1 = await pool.query(createTables[0]);
//     const r2 = await pool.query(registers[0]);
//     console.log(r1,r2)
//   } catch (error) {
//     console.log(error);
//   }

// });

export { app };
