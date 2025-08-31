import { Router } from "express";
import { OrderServiceController } from "../controllers/order-service.controller.ts";

const router = Router();

router.get("/os", OrderServiceController.getOrderService);

export { router as ordersServiceRoutes };
