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
exports.VivoService = void 0;
const api_request_1 = require("../../utils/api-request");
const auth_1 = require("./auth");
const config_1 = __importDefault(require("../../../config"));
const TOKENINVALIDCODES = [10000];
class VivoService {
    constructor() {
        this._httpClient = new api_request_1.HttpClient();
        this.authClient = new auth_1.AuthClient();
    }
    unicast(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/message/send",
                body: requestConfig
            });
            return result;
        });
    }
    saveTemplate(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/message/saveListPayload",
                body: requestConfig
            });
            return result;
        });
    }
    broadcast(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/message/pushToList",
                body: requestConfig
            });
            return result;
        });
    }
    statics(taskIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "GET",
                uri: "/report/getStatistics",
                body: {},
                qs: { taskIds }
            });
            return result;
        });
    }
    getAppConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "GET",
                uri: "/report/getAppConfig",
                body: {}
            });
            return result;
        });
    }
    http(apiOptions, retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.authClient) {
                throw new Error("can't refresh token because getting auth client fail");
            }
            if (!this.authClient.token) {
                yield this.authClient.refreshToken();
            }
            let result = yield this.sendRequest(apiOptions, retry);
            if (TOKENINVALIDCODES.includes(result.code)) {
                yield this.authClient.refreshToken();
                result = yield this.sendRequest(apiOptions, retry);
            }
            return result;
        });
    }
    sendRequest(apiOptions, retry) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: apiOptions.method,
                uri: `${config_1.default.vivo.baseUrl}${apiOptions.uri}`,
                headers: {
                    "Content-Type": "application/json",
                    authToken: ` ${this.authClient.token}`
                },
                json: true,
                body: Object.assign(apiOptions.body, {
                    requestId: this.randomRequestId()
                }),
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
    randomRequestId(len = 32) {
        len = len || 32;
        const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        const maxPos = $chars.length;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}
exports.VivoService = VivoService;
//# sourceMappingURL=index.js.map