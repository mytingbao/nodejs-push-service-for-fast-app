import { Router } from "express";
import { OppoService } from "../services/oppo/index";
import {
  oppoNotificationSchema,
  oppoCastSchema,
  oppoCastBatchSchema,
  oppoBroadcastSchema
} from "../moulds/oppo";
import { CastRequestConfig } from "../services/oppo/model";
import { uploadSingleFile, deleteFile } from "../services/uploader";
const fs = require("fs");

class OppoController {
  private _oppoService: OppoService;
  constructor() {
    this._oppoService = new OppoService();
  }
  public async init() {
    const router = Router();
    router.post("/saveMessage", this.saveMessage);
    router.post("/broadcast", this.broadcast);
    router.post("/saveAndBroadcast", this.saveMessageThenBroadcast);
    router.post("/unicast", this.unicast);
    router.post("/unicastBatch", this.unicastBatch);
    router.post("/pushAmount", this.pushAmount);
    router.post("/uploadBigPicture", this.uploadBigPicture);
    router.post("/uploadIcon", this.uploadIcon);

    return router;
  }
  public async unicast(req, res) {
    const requestParams = originPayload2Target(req.body);
    console.log(requestParams, "requestParams");
    try {
      await oppoCastSchema().validate(requestParams);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const _oppoService = new OppoService();
    const { code, data, message } = await _oppoService.unicast(requestParams);
    res.send({ code, data, message });
  }
  public async unicastBatch(req, res) {
    const originPayload = req.body;
    if (Array.isArray(originPayload)) {
      const targetPayload = originPayload.map(v => {
        return originPayload2Target(v);
      });
      try {
        await oppoCastBatchSchema().validate(targetPayload);
      } catch (e) {
        return res.send({ code: 500, data: "", message: e.message });
      }

      const _oppoService = new OppoService();
      const { code, data, message } = await _oppoService.unicastBatch(
        targetPayload
      );
      res.send({ code, data, message });
    } else {
      res.send({
        code: 400,
        data: null,
        message: "批量单推的参数类型应为list"
      });
    }
  }

  public async saveMessageThenBroadcast(req, res) {
    const params = formatMessage(req.body);
    try {
      await oppoNotificationSchema().validate(params);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const _oppoService = new OppoService();
    console.log(params, "params saveMessageThenBroadcast");
    const messageResponse = await _oppoService.saveMeassageContent(params);

    if (messageResponse.code === 0) {
      // 保存消息模板成功
      const broadcastPayload = {
        message_id: (messageResponse.data as any).message_id,
        target_value: req.body.target_value,
        target_type: req.body.target_type
      };
      try {
        await oppoBroadcastSchema().validate(broadcastPayload);
      } catch (e) {
        return res.send({ code: 500, data: "", message: e.message });
      }

      const { code, data, message } = await _oppoService.broadcast(
        broadcastPayload
      );
      res.send({ code, data, message });
    } else {
      return res.send({ code: 400, data: "", message: "保存消息模板失败" });
    }
  }
  public async saveMessage(req, res) {
    const params = formatMessage(req.body);
    try {
      await oppoNotificationSchema().validate(params);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const _oppoService = new OppoService();
    const { code, data, message } = await _oppoService.saveMeassageContent(
      params
    );
    res.send({ code, data, message });
  }
  public async broadcast(req, res) {
    const { message_id, target_type, target_value } = req.body;
    this._oppoService = new OppoService();
    const { code, data, message } = await this._oppoService.broadcast({
      message_id,
      target_type,
      target_value
    });
    res.send({ code, data, message });
  }

  public async pushAmount(req, res) {
    const _oppoService = new OppoService();
    const { code, data, message } = await _oppoService.pushAmount();
    res.send({ code, data, message });
  }

  public async uploadBigPicture(req, res) {
    const { filename } = await uploadSingleFile(req, res);
    const _oppoService = new OppoService();
    const result = await _oppoService.uploadBigPicture({
      file: fs.createReadStream(filename)
    });
    res.send(result);
    deleteFile(filename);
  }

  public async uploadIcon(req, res) {
    const { filename } = await uploadSingleFile(req, res);
    const _oppoService = new OppoService();
    const result = await _oppoService.uploadIcon({
      file: fs.createReadStream(filename)
    });
    res.send(result);
    deleteFile(filename);
  }
}
function formatMessage(origin) {
  const {
    style,
    title,
    content,
    big_picture_id,
    small_picture_id,
    click_action_type,
    click_action_activity,
    click_action_url,
    action_parameters,
    channel_id
  } = origin;
  const target = {
    style,
    title,
    content,
    big_picture_id,
    small_picture_id,
    click_action_type: click_action_type == 0 ? 1 : click_action_type,
    click_action_activity: "com.nearme.instant.action.PUSH",
    click_action_url,
    action_parameters:
      click_action_type == 1
        ? JSON.stringify({
            page: `${click_action_activity}?${JsonObject2String(
              action_parameters
            )}`
          })
        : "",
    channel_id
  };
  return target;
}

function originPayload2Target(origin): CastRequestConfig {
  return {
    target_type: origin.target_type,
    target_value: origin.target_value,
    notification: formatMessage(origin)
  };
}

/**
打开快应用主页：               click_action_type填写1，click_action_activity填写com.nearme.instant.action.PUSH；
打开Page1（快应用内页）的举例： click_action_type填写1，click_action_activity填写com.nearme.instant.action.PUSH、
                              action_parameters填写{"page":"/Page1?key1=value1&key2=value2"}；
 */
function JsonObject2String(string): string {
  const obj = JSON.parse(string);
  let str = "";
  for (const item of Object.keys(obj)) {
    str += `${item}=${obj[item]}&`;
  }
  return str;
}
export async function oppoController() {
  const controller = new OppoController();
  return await controller.init();
}
