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
exports.globalController = void 0;
const express_1 = require("express");
const uploader_1 = require("../services/uploader");
const huawei_1 = require("../services/huawei");
const oppo_1 = require("../services/oppo");
const vivo_1 = require("../services/vivo");
const xiaomi_1 = require("../services/xiaomi");
const mass_1 = require("../moulds/mass");
class GloabalController {
    constructor() { }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            router.post("/readTxt", this.readTxt);
            router.post("/push", this.push);
            return router;
        });
    }
    readTxt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filename } = yield uploader_1.uploadSingleFile(req, res);
            const data = yield uploader_1.parseTxtContent(filename);
            if (data) {
                res.send({ code: 200, data: data.split("\n"), message: "上传成功" });
            }
            uploader_1.deleteFile(filename);
        });
    }
    push(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _huaweiSerive = new huawei_1.HuaweiService();
            const _oppoService = new oppo_1.OppoService();
            const _vivoService = new vivo_1.VivoService();
            const _xiaomiService = new xiaomi_1.XiaoMiService();
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
                yield mass_1.massMessageSchema().validate(body);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const requestMap = {
                huawei_token() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield _huaweiSerive.send({
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
                    });
                },
                oppo_token() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield _oppoService.unicast({
                            target_type: 2,
                            target_value: body.oppo_token,
                            notification: {
                                title: body.title,
                                content: body.content
                            }
                        });
                    });
                },
                xiaomi_token() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield _xiaomiService.castByRegId({
                            restricted_package_name: "",
                            registration_id: body.xiaomi_token,
                            pass_through: 0,
                            title: body.title,
                            description: body.content
                        });
                    });
                },
                vivo_token() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield _vivoService.unicast({
                            regId: body.vivo_token,
                            notifyType: 1,
                            title: body.title,
                            content: body.content,
                            skipType: 1,
                            skipContent: ""
                        });
                    });
                }
            };
            let responseMap = {};
            for (const key of Object.keys(requestMap)) {
                if (body[key]) {
                    const result = yield requestMap[key]();
                    responseMap[key] = result;
                }
            }
            res.send({
                code: 1,
                data: responseMap,
                message: ""
            });
        });
    }
}
function globalController() {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new GloabalController();
        return yield controller.init();
    });
}
exports.globalController = globalController;
//# sourceMappingURL=global.js.map