import express, { json, urlencoded } from "express";
import cors from "cors";

import { ordersServiceRoutes } from "./routes/order-service.routes.ts";
// import { pool } from "./database/pg.database.ts";

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
app.get("/config/db", async (req, res) => {
  try {

    
    
  } catch (error) {
    console.log(error)
  }


  return res.send("ok");
})

export { app };
