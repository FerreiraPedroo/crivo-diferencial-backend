import { Router } from "express";
import { OrderServiceController } from "../controllers/order-service.controller.js";

const router = Router();

router.get("/os", OrderServiceController.getOrderService);

export { router as ordersServiceRoutes };
