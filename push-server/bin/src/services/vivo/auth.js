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
exports.AuthClient = void 0;
const api_request_1 = require("../../utils/api-request");
const config_1 = __importDefault(require("../../../config"));
const crypto_1 = require("../../utils/crypto");
const REFRESH_TOKEN_METHOD = "POST";
class AuthClient {
    constructor() {
        this._httpClient = new api_request_1.HttpClient();
        this._token = "";
    }
    get httpClient() {
        return this._httpClient;
    }
    get token() {
        return this._token;
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let option = {};
            option.uri = `${config_1.default.vivo.baseUrl}/message/auth`;
            option.headers = {
                "Content-Type": "application/json"
            };
            const timestamp = new Date().getTime();
            const body = {
                appId: config_1.default.vivo.appid,
                appKey: config_1.default.vivo.appKey,
                sign: crypto_1.md5(`${config_1.default.vivo.appid}${config_1.default.vivo.appKey}${timestamp}${config_1.default.vivo.appSecret}`),
                timestamp
            };
            option.body = body;
            option.method = REFRESH_TOKEN_METHOD;
            option.json = true;
            return this._httpClient.send(option).then(response => {
                const res = response.data;
                this._token = res.authToken;
                return this._token;
            });
        });
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=auth.js.map