import express, { json, urlencoded } from "express";
import cors from "cors";

import { ordersServiceRoutes } from "./routes/order-service.routes.ts";
import { registers } from "./database/seeds.ts";
import { pool } from "./database/pg.database.ts";

const app = express();

app.disable("x-powered-by");
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    exposedHeaders: ["x-crivo-diferencial"],
  })
);

// ROTAS
app.use(ordersServiceRoutes);


// ROTAS CONFIG
// app.get("/config/db", async (req, res) => {
//   try {
//    // const r = await pool.query(registers[0]);
//     // const r = await pool.query(createTables[0]);
//     console.log(r)
//   } catch (error) {
//     console.log(error);
//   }

// });

export { app };


