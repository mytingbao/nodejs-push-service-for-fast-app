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
exports.initControllers = void 0;
const express_1 = require("express");
const global_1 = require("./global");
const huawei_1 = require("./huawei");
const oppo_1 = require("./oppo");
const xiaomi_1 = require("./xiaomi");
const vivo_1 = require("./vivo");
function initControllers() {
    return __awaiter(this, void 0, void 0, function* () {
        const router = express_1.Router();
        router.use("/api/global", yield global_1.globalController());
        router.use("/api/huawei", yield huawei_1.huaweiController());
        router.use("/api/oppo", yield oppo_1.oppoController());
        router.use("/api/xiaomi", yield xiaomi_1.xiaomiController());
        router.use("/api/vivo", yield vivo_1.vivoController());
        return router;
    });
}
exports.initControllers = initControllers;
//# sourceMappingURL=index.js.map