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
exports.huaweiController = void 0;
const express_1 = require("express");
const index_1 = require("../services/huawei/index");
class HuaweiController {
    constructor() { }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            router.post("/", this.send);
            return router;
        });
    }
    send(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, page, params, vibration, breathLight } = req.body;
            const token = req.body.token.split(",");
            const push = new index_1.HuaweiService();
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
                }
                catch (error) {
                    res.send({ code: 400, data: null, message: err.message });
                }
            });
        });
    }
}
function huaweiController() {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new HuaweiController();
        return yield controller.init();
    });
}
exports.huaweiController = huaweiController;
//# sourceMappingURL=huawei.js.map