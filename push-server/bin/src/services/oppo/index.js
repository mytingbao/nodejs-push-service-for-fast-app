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
exports.OppoService = void 0;
const api_request_1 = require("../../utils/api-request");
const auth_1 = require("./auth");
const config_1 = __importDefault(require("../../../config"));
const TOKENINVALIDCODES = [11, 29];
var TargetType;
(function (TargetType) {
    TargetType[TargetType["RegId"] = 2] = "RegId";
    TargetType[TargetType["Alias"] = 5] = "Alias";
    TargetType[TargetType["Label"] = 6] = "Label";
})(TargetType || (TargetType = {}));
class OppoService {
    constructor() {
        this._httpClient = new api_request_1.HttpClient();
        this.authClient = new auth_1.AuthClient();
    }
    unicast(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/server/v1/message/notification/unicast",
                body: { message: JSON.stringify(requestConfig) }
            });
            return result;
        });
    }
    unicastBatch(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/server/v1/message/notification/unicast_batch",
                body: { messages: JSON.stringify(requestConfig) }
            });
            return result;
        });
    }
    saveMeassageContent(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/server/v1/message/notification/save_message_content",
                body: content
            });
            return result;
        });
    }
    broadcast(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                uri: "/server/v1/message/notification/broadcast",
                body: requestConfig
            });
            return result;
        });
    }
    pushAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "GET",
                uri: "/server/v1/feedback/fetch_push_permit",
                body: {}
            });
            return result;
        });
    }
    uploadBigPicture(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                baseUrl: config_1.default.oppo.mediaUrl,
                uri: "/server/v1/media/upload/big_picture",
                formData: requestConfig,
                body: {},
                headers: { "Content-Type": "multipart/form-data" }
            });
            return result;
        });
    }
    uploadIcon(requestConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.http({
                method: "POST",
                baseUrl: config_1.default.oppo.mediaUrl,
                uri: "/server/v1/media/upload/small_picture",
                formData: requestConfig,
                body: {},
                headers: { "Content-Type": "multipart/form-data" }
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
                uri: `${apiOptions.baseUrl ? apiOptions.baseUrl : config_1.default.oppo.baseUrl}${apiOptions.uri}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    auth_token: ` ${this.authClient.token}`
                },
                json: true,
                form: apiOptions.body,
                formData: apiOptions.formData
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
exports.OppoService = OppoService;
//# sourceMappingURL=index.js.map