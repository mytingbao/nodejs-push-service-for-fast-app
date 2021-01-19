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
exports.oppoController = void 0;
const express_1 = require("express");
const index_1 = require("../services/oppo/index");
const oppo_1 = require("../moulds/oppo");
const uploader_1 = require("../services/uploader");
const fs = require("fs");
class OppoController {
    constructor() {
        this._oppoService = new index_1.OppoService();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            router.post("/saveMessage", this.saveMessage);
            router.post("/broadcast", this.broadcast);
            router.post("/saveAndBroadcast", this.saveMessageThenBroadcast);
            router.post("/unicast", this.unicast);
            router.post("/unicastBatch", this.unicastBatch);
            router.post("/pushAmount", this.pushAmount);
            router.post("/uploadBigPicture", this.uploadBigPicture);
            router.post("/uploadIcon", this.uploadIcon);
            return router;
        });
    }
    unicast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParams = originPayload2Target(req.body);
            console.log(requestParams, "requestParams");
            try {
                yield oppo_1.oppoCastSchema().validate(requestParams);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const _oppoService = new index_1.OppoService();
            const { code, data, message } = yield _oppoService.unicast(requestParams);
            res.send({ code, data, message });
        });
    }
    unicastBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const originPayload = req.body;
            if (Array.isArray(originPayload)) {
                const targetPayload = originPayload.map(v => {
                    return originPayload2Target(v);
                });
                try {
                    yield oppo_1.oppoCastBatchSchema().validate(targetPayload);
                }
                catch (e) {
                    return res.send({ code: 500, data: "", message: e.message });
                }
                const _oppoService = new index_1.OppoService();
                const { code, data, message } = yield _oppoService.unicastBatch(targetPayload);
                res.send({ code, data, message });
            }
            else {
                res.send({
                    code: 400,
                    data: null,
                    message: "批量单推的参数类型应为list"
                });
            }
        });
    }
    saveMessageThenBroadcast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = formatMessage(req.body);
            try {
                yield oppo_1.oppoNotificationSchema().validate(params);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const _oppoService = new index_1.OppoService();
            console.log(params, "params saveMessageThenBroadcast");
            const messageResponse = yield _oppoService.saveMeassageContent(params);
            if (messageResponse.code === 0) {
                // 保存消息模板成功
                const broadcastPayload = {
                    message_id: messageResponse.data.message_id,
                    target_value: req.body.target_value,
                    target_type: req.body.target_type
                };
                try {
                    yield oppo_1.oppoBroadcastSchema().validate(broadcastPayload);
                }
                catch (e) {
                    return res.send({ code: 500, data: "", message: e.message });
                }
                const { code, data, message } = yield _oppoService.broadcast(broadcastPayload);
                res.send({ code, data, message });
            }
            else {
                return res.send({ code: 400, data: "", message: "保存消息模板失败" });
            }
        });
    }
    saveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = formatMessage(req.body);
            try {
                yield oppo_1.oppoNotificationSchema().validate(params);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const _oppoService = new index_1.OppoService();
            const { code, data, message } = yield _oppoService.saveMeassageContent(params);
            res.send({ code, data, message });
        });
    }
    broadcast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message_id, target_type, target_value } = req.body;
            this._oppoService = new index_1.OppoService();
            const { code, data, message } = yield this._oppoService.broadcast({
                message_id,
                target_type,
                target_value
            });
            res.send({ code, data, message });
        });
    }
    pushAmount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _oppoService = new index_1.OppoService();
            const { code, data, message } = yield _oppoService.pushAmount();
            res.send({ code, data, message });
        });
    }
    uploadBigPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filename } = yield uploader_1.uploadSingleFile(req, res);
            const _oppoService = new index_1.OppoService();
            const result = yield _oppoService.uploadBigPicture({
                file: fs.createReadStream(filename)
            });
            res.send(result);
            uploader_1.deleteFile(filename);
        });
    }
    uploadIcon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filename } = yield uploader_1.uploadSingleFile(req, res);
            const _oppoService = new index_1.OppoService();
            const result = yield _oppoService.uploadIcon({
                file: fs.createReadStream(filename)
            });
            res.send(result);
            uploader_1.deleteFile(filename);
        });
    }
}
function formatMessage(origin) {
    const { style, title, content, big_picture_id, small_picture_id, click_action_type, click_action_activity, click_action_url, action_parameters, channel_id } = origin;
    const target = {
        style,
        title,
        content,
        big_picture_id,
        small_picture_id,
        click_action_type: click_action_type == 0 ? 1 : click_action_type,
        click_action_activity: "com.nearme.instant.action.PUSH",
        click_action_url,
        action_parameters: click_action_type == 1
            ? JSON.stringify({
                page: `${click_action_activity}?${JsonObject2String(action_parameters)}`
            })
            : "",
        channel_id
    };
    return target;
}
function originPayload2Target(origin) {
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
function JsonObject2String(string) {
    const obj = JSON.parse(string);
    let str = "";
    for (const item of Object.keys(obj)) {
        str += `${item}=${obj[item]}&`;
    }
    return str;
}
function oppoController() {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new OppoController();
        return yield controller.init();
    });
}
exports.oppoController = oppoController;
//# sourceMappingURL=oppo.js.map