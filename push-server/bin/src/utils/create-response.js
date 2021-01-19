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
exports.createInvalidParamsResponse = void 0;
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["invalidParams"] = 400] = "invalidParams";
})(ResponseCode || (ResponseCode = {}));
function createInvalidParamsResponse(res, message = "Bad Request") {
    return __awaiter(this, void 0, void 0, function* () {
        res.send({
            code: ResponseCode["invalidParams"],
            data: null,
            message
        });
    });
}
exports.createInvalidParamsResponse = createInvalidParamsResponse;
//# sourceMappingURL=create-response.js.map