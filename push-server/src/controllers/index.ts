import { Router } from "express";
import { globalController } from "./global";
import { huaweiController } from "./huawei";
import { oppoController } from "./oppo";
import { xiaomiController } from "./xiaomi";
import { vivoController } from "./vivo";
export async function initControllers() {
  const router = Router();
  router.use("/api/global", await globalController());
  router.use("/api/huawei", await huaweiController());
  router.use("/api/oppo", await oppoController());
  router.use("/api/xiaomi", await xiaomiController());
  router.use("/api/vivo", await vivoController());
  return router;
}
