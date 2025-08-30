import express, { json, urlencoded } from "express";
import cors from "cors";

import { ordersServiceRoutes } from "./routes/order-service.routes.js";

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

export { app };
