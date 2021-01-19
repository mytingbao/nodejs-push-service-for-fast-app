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
exports.HuaweiService = void 0;
const api_request_1 = require("../../utils/api-request");
const auth_1 = require("./auth");
const config_1 = __importDefault(require("../../../config"));
const TOKENTIMEOUTERR = "80200003";
const authConfig = {
    appId: config_1.default.huawei.appid,
    appSecret: config_1.default.huawei.appSecret,
    authUrl: "https://login.cloud.huawei.com/oauth2/v2/token"
};
class HuaweiService {
    constructor() {
        this._httpClient = new api_request_1.HttpClient();
        this.authClient = new auth_1.AuthClient(authConfig);
    }
    send(message, validationOnly = false, dryRun = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = {
                validate_only: validationOnly,
                message
            };
            if (!message) {
                throw new Error("can't refresh token because getting auth client fail");
            }
            if (!this.authClient) {
                throw new Error("can't refresh token because getting auth client fail");
            }
            if (!this.authClient.token) {
                yield this.authClient.refreshToken();
            }
            let result = yield this.sendRequest(request, dryRun);
            if (result.code === TOKENTIMEOUTERR) {
                yield this.authClient.refreshToken();
                result = yield this.sendRequest(request, dryRun);
            }
            return result;
        });
    }
    sendRequest(req, dryRun) {
        return __awaiter(this, void 0, void 0, function* () {
            let option = {};
            let url = config_1.default.huawei.baseUrl;
            option.uri = `${url}/${config_1.default.huawei.appid}/messages:send`;
            option.headers = {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${this.authClient.token}`
            };
            option.body = req;
            option.json = true;
            console.log(option, "option sendRequest");
            if (dryRun) {
                return this._httpClient.sendWithRetry(option).then(res => {
                    let data = res.data;
                    return data;
                });
            }
            return this._httpClient.send(option).then(res => {
                let data = res.data;
                return data;
            });
        });
    }
}
exports.HuaweiService = HuaweiService;
//# sourceMappingURL=index.js.map