import { Router, Response } from "express";
import {
  uploadSingleFile,
  parseTxtContent,
  deleteFile
} from "../services/uploader";

import { HuaweiService } from "../services/huawei";
import { OppoService } from "../services/oppo";
import { VivoService } from "../services/vivo";
import { XiaoMiService } from "../services/xiaomi";
import { massMessageSchema } from "../moulds/mass";

class GloabalController {
  constructor() {}
  public async init() {
    const router = Router();
    router.post("/readTxt", this.readTxt);
    router.post("/push", this.push);
    return router;
  }
  public async readTxt(req, res: Response) {
    const { filename } = await uploadSingleFile(req, res);
    const data = await parseTxtContent(filename);
    if (data) {
      res.send({ code: 200, data: data.split("\n"), message: "上传成功" });
    }
    deleteFile(filename);
  }
  public async push(req, res) {
    const _huaweiSerive = new HuaweiService();
    const _oppoService = new OppoService();
    const _vivoService = new VivoService();
    const _xiaomiService = new XiaoMiService();

    // content: "",
    // click_action_type: 0, // 0 打开应用； 1  打开网页
    // open_app_index: 0, // 0 打开应用首页； 1  打开其他页面
    // page: "",
    // params: "",
    // click_action_url: "", // 网页地址

    // oppo_token_type: 0,
    // oppo_token: "",
    // huawei_token_type: 0,
    // huawei_token: "",
    // xiaomi_token_type: 0,
    // xiaomi_token: "",
    // vivo_token_type: 0,
    // vivo_token: ""

    const body = req.body;

    try {
      await massMessageSchema().validate(body);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const requestMap = {
      async huawei_token() {
        return await _huaweiSerive.send({
          data: JSON.stringify({
            pushtype: 0,
            pushbody: {
              title: body.title,
              descriprion: body.content,
              ringtone: {
                vibration: true,
                breathLight: true
              }
            }
          }),
          android: {
            fast_app_target: 2
          },
          token: body.huawei_token.split(",")
        });
      },
      async oppo_token() {
        return await _oppoService.unicast({
          target_type: 2,
          target_value: body.oppo_token,
          notification: {
            title: body.title,
            content: body.content
          }
        });
      },
      async xiaomi_token() {
        return await _xiaomiService.castByRegId({
          restricted_package_name: "",
          registration_id: body.xiaomi_token,
          pass_through: 0,
          title: body.title,
          description: body.content
        });
      },
      async vivo_token() {
        return await _vivoService.unicast({
          regId: body.vivo_token,
          notifyType: 1,
          title: body.title,
          content: body.content,
          skipType: 1,
          skipContent: ""
        });
      }
    };

    let responseMap: object = {};
    for (const key of Object.keys(requestMap)) {
      if (body[key]) {
        const result = await requestMap[key]();
        responseMap[key] = result;
      }
    }
    res.send({
      code: 1,
      data: responseMap,
      message: ""
    });
  }
}

export async function globalController() {
  const controller = new GloabalController();
  return await controller.init();
}
