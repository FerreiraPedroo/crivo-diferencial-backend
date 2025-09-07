import { Router } from "express";
import multer from "multer";
import { OrderServiceController } from "../controllers/order-service.controller.ts";
const uploadFile = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/os", OrderServiceController.getOrderService);
router.post(
  "/sync",
  uploadFile.single("photo"),
  OrderServiceController.syncOrderService
);

export { router as ordersServiceRoutes };
