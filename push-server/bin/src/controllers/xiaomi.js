"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xiaomiController = void 0;
const express_1 = require("express");
const xiaomi_1 = require("../services/xiaomi");
const uploader_1 = require("../services/uploader");
const fs = require("fs");
class XiaoMiController {
    constructor() {
        this._xiaomiService = new xiaomi_1.XiaoMiService();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            router.post("/castByRegId", this.castByRegId);
            router.post("/castByRegIds", this.castBatchByRegId);
            router.post("/traceMessage", this.traceMessageStatus);
            router.post("/upload", this.upload);
            return router;
        });
    }
    castByRegId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParams = originPayload2Target(req.body);
            const _xiaomiService = new xiaomi_1.XiaoMiService();
            _xiaomiService
                .castByRegId(requestParams)
                .then(result => {
                res.send(result);
                console.log(requestParams, result, " _xiaomiService castByRegId");
            })
                .catch(err => {
                res.send({ code: 500, data: null, message: err.message });
            });
        });
    }
    castBatchByRegId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(req.body)) {
                const originPayload = req.body;
                const targetPayload = originPayload.map(v => {
                    return originPayloadBatch2Target(v);
                });
                const _xiaomiService = new xiaomi_1.XiaoMiService();
                _xiaomiService
                    .castBatchByRegId(targetPayload)
                    .then(result => {
                    res.send(result);
                })
                    .catch(err => {
                    res.send({ code: 500, data: null, message: err.message });
                });
            }
        });
    }
    traceMessageStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, begin_time, end_time } = req.body;
            const _xiaomiService = new xiaomi_1.XiaoMiService();
            const result = yield _xiaomiService.traceMessageStatus({
                qs: { msg_id: id, begin_time, end_time }
            });
            res.send(result);
        });
    }
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filename, payload } = yield uploader_1.uploadSingleFile(req, res);
            const _xiaomiService = new xiaomi_1.XiaoMiService();
            const result = yield _xiaomiService.upload({
                is_icon: payload.is_icon,
                is_global: payload.is_global,
                file: fs.createReadStream(filename)
            });
            res.send(result);
            uploader_1.deleteFile(filename);
        });
    }
}
function originPayload2Target(origin) {
    const { style, pass_through, restricted_package_name, title, description, target_type, registration_id, notify_effect, intent_uri, web_uri, pic_url, button_left_name, button_left_notify_effect, button_left_intent_uri, button_left_web_uri } = origin;
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
function originPayloadBatch2Target(origin) {
    const { pass_through, restricted_package_name, title, description, target_type, registration_id, extra: { web_uri, notify_effect, intent_uri } } = origin;
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
function xiaomiController() {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new XiaoMiController();
        return yield controller.init();
    });
}
exports.xiaomiController = xiaomiController;
//# sourceMappingURL=xiaomi.js.map