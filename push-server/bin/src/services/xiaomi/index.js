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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoMiService = void 0;
const api_request_1 = require("../../utils/api-request");
const config_1 = __importDefault(require("../../../config"));
class XiaoMiService {
    constructor() {
        this._httpClient = new api_request_1.HttpClient();
    }
    castByRegId(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/v2/message/regid",
                body: requestConfig
            });
            return result;
        });
    }
    castBatchByRegId(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/v2/multi_messages/regids",
                body: { messages: JSON.stringify(requestConfig) }
            });
            return result;
        });
    }
    traceMessageStatus(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "GET",
                uri: "/v1/trace/message/status",
                body: {},
                qs: requestConfig.qs
            });
            return result;
        });
    }
    upload(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/media/upload/image",
                formData: requestConfig,
                body: {},
                headers: { "Content-Type": "multipart/form-data" }
            });
            return result;
        });
    }
    http(apiOptions, retry) {
        return __awaiter(this, void 0, void 0, function* () {
            const CONTETNTYPE = apiOptions.method === "GET"
                ? "application/json"
                : "application/x-www-form-urlencoded;charset=UTF-8";
            const customHeaders = apiOptions.headers
                ? apiOptions.headers
                : { "Content-Type": CONTETNTYPE };
            const options = {
                method: apiOptions.method,
                uri: `${config_1.default.xiaomi.baseUrl}${apiOptions.uri}`,
                headers: Object.assign({
                    Authorization: `key=${config_1.default.xiaomi.appSecret}`
                }, customHeaders),
                json: true,
                form: apiOptions.body,
                formData: apiOptions.formData,
                qs: apiOptions.qs
            };
            if (retry) {
                return this._httpClient.sendWithRetry(options).then(res => res.data);
            }
            else {
                return this._httpClient.send(options).then(res => res.data);
            }
        });
    }
}
exports.XiaoMiService = XiaoMiService;
//# sourceMappingURL=index.js.map