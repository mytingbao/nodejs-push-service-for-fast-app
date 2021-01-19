import { Router } from "express";
import { HuaweiService } from "../services/huawei/index";

class HuaweiController {
  constructor() {}
  async init() {
    const router = Router();
    router.post("/", this.send);
    return router;
  }
  async send(req, res) {
    const {
      title,
      description,
      page,
      params,
      vibration,
      breathLight
    } = req.body;
    const token = req.body.token.split(",");
    const push = new HuaweiService();
    push
      .send({
        data: JSON.stringify({
          pushtype: 0,
          pushbody: {
            title,
            description,
            page,
            params,
            ringtone: {
              vibration,
              breathLight
            }
          }
        }),
        android: {
          fast_app_target: 1
        },
        token
      })

      .then(result => {
        res.send(result);
      })
      .catch(err => {
        try {
          const { status, text } = JSON.parse(err.message);
          res.send({ code: status, data: null, message: text });
        } catch (error) {
          res.send({ code: 400, data: null, message: err.message });
        }
      });
  }
}
export async function huaweiController() {
  const controller = new HuaweiController();
  return await controller.init();
}
