import { Router } from "express";
import multer from "multer";

import { AdminOrderServiceController } from "../controllers/order-service.controller.js";

const uploadFile = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/admin/os", AdminOrderServiceController.listOrderService);
router.get("/admin/os/:osID", AdminOrderServiceController.readOrderService);



// router.post(
//   "/sync",
//   uploadFile.single("photo"),
//   OrderServiceController.syncOrderService
// );
// router.post("/finish", OrderServiceController.finishOrderService);

export { router as adminRoutes };
