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
exports.vivoController = void 0;
const express_1 = require("express");
const vivo_1 = require("../services/vivo");
const vivo_2 = require("../moulds/vivo");
class VivoController {
    constructor() {
        this._vivoService = new vivo_1.VivoService();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const router = express_1.Router();
            router.post("/cast", this.cast);
            router.post("/saveTemplate", this.saveTemplate);
            router.post("/broadcast", this.broadcast);
            router.post("/saveThenBroadcast", this.saveThenBroadcast);
            router.post("/statics", this.statics);
            router.post("/appConfig", this.appConfig);
            return router;
        });
    }
    cast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                yield vivo_2.vivoMessageSchema().validate(body);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const _vivoService = new vivo_1.VivoService();
            const response = yield _vivoService.unicast(body);
            res.send(response);
        });
    }
    saveTemplate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const _vivoService = new vivo_1.VivoService();
            const response = yield _vivoService.saveTemplate(body);
            res.send(response);
        });
    }
    broadcast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const _vivoService = new vivo_1.VivoService();
            const response = yield _vivoService.broadcast(body);
            res.send(response);
        });
    }
    saveThenBroadcast(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            try {
                yield vivo_2.vivoMessageSchema().validate(body);
            }
            catch (e) {
                return res.send({ code: 500, data: "", message: e.message });
            }
            const _vivoService = new vivo_1.VivoService();
            const saveResponse = yield _vivoService.saveTemplate(body);
            if (saveResponse.result !== 0) {
                return res.send(saveResponse);
            }
            const regId = req.body.regId.split(",");
            const params = {
                regIds: regId,
                taskId: saveResponse.taskId
            };
            const response = yield _vivoService.broadcast(params);
            res.send(response);
        });
    }
    statics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taskIds } = req.body;
            const _vivoService = new vivo_1.VivoService();
            const response = yield _vivoService.statics(taskIds);
            res.send(response);
        });
    }
    appConfig(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _vivoService = new vivo_1.VivoService();
            const response = yield _vivoService.getAppConfig();
            res.send(response);
        });
    }
}
function vivoController() {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new VivoController();
        return yield controller.init();
    });
}
exports.vivoController = vivoController;
//# sourceMappingURL=vivo.js.map