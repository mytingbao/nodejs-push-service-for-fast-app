import { Router } from "express";
import { XiaoMiService } from "../services/xiaomi";
import { uploadSingleFile, deleteFile } from "../services/uploader";
import {RequestConfig} from '../services/xiaomi/model'
const fs = require("fs");

class XiaoMiController {
  private _xiaomiService: XiaoMiService;
  constructor() {
    this._xiaomiService = new XiaoMiService();
  }
  async init() {
    const router = Router();
    router.post("/castByRegId", this.castByRegId);
    router.post("/castByRegIds", this.castBatchByRegId);
    router.post("/traceMessage", this.traceMessageStatus);
    router.post("/upload", this.upload);
    return router;
  }
  async castByRegId(req, res) {
    const requestParams = originPayload2Target(req.body);
    const _xiaomiService = new XiaoMiService();
    _xiaomiService
      .castByRegId(requestParams)
      .then(result => {
        res.send(result);
        console.log(requestParams, result, " _xiaomiService castByRegId");
      })
      .catch(err => {
        res.send({ code: 500, data: null, message: err.message });
      });
  }
  async castBatchByRegId(req, res) {
    if (Array.isArray(req.body)) {
      const originPayload = req.body;
      const targetPayload = originPayload.map(v => {
        return originPayloadBatch2Target(v);
      });
      const _xiaomiService = new XiaoMiService();
      _xiaomiService
        .castBatchByRegId(targetPayload)
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          res.send({ code: 500, data: null, message: err.message });
        });
    }
  }
  async traceMessageStatus(req, res) {
    const { id, begin_time, end_time } = req.body;
    const _xiaomiService = new XiaoMiService();
    const result = await _xiaomiService.traceMessageStatus({
      qs: { msg_id: id, begin_time, end_time }
    });
    res.send(result);
  }
  async upload(req, res) {
    const { filename, payload } = await uploadSingleFile(req, res);
    const _xiaomiService = new XiaoMiService();
    const result = await _xiaomiService.upload({
      is_icon: payload.is_icon,
      is_global: payload.is_global,
      file: fs.createReadStream(filename)
    });
    res.send(result);
    deleteFile(filename);
  }
}
function originPayload2Target(origin): RequestConfig {
  const {
    style,
    pass_through,
    restricted_package_name,
    title,
    description,
    target_type,
    registration_id,
    notify_effect,
    intent_uri,
    web_uri,
    pic_url,
    button_left_name,
    button_left_notify_effect,
    button_left_intent_uri,
    button_left_web_uri
  } = origin;
  const target = {
    registration_id,
    pass_through,
    restricted_package_name,
    title,
    description,
    target_type,
    "extra.notify_effect": notify_effect,
    "extra.hybrid_path": intent_uri,
    "extra.web_uri": web_uri,
    "extra.notification_style_type": style,
    "extra.notification_bigPic_uri": pic_url,
    "extra.notification_style_button_left_notify_effect": button_left_notify_effect,
    "extra.notification_style_button_left_name": button_left_name,
    "extra.notification_style_button_left_web_uri ": button_left_web_uri,
    "extra.notification_style_button_left_intent_class": button_left_intent_uri
  };
  return target;
}

function originPayloadBatch2Target(origin): object {
  const {
    pass_through,
    restricted_package_name,
    title,
    description,
    target_type,
    registration_id,
    extra: { web_uri, notify_effect, intent_uri }
  } = origin;
  const target = {
    target: registration_id,
    message: {
      pass_through,
      restricted_package_name,
      title,
      description,
      target_type,
      extra: { web_uri, notify_effect, intent_uri }
    }
  };
  return target;
}

export async function xiaomiController() {
  const controller = new XiaoMiController();
  return await controller.init();
}
