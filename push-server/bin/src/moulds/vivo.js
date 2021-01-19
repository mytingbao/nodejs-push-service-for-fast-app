"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vivoMessageSchema = void 0;
const Yup = require("yup");
const vivoMessageSchema = () => {
    return Yup.object().shape({
        title: Yup.string().required("通知标题不能为空"),
        content: Yup.string().required("通知内容用户不能为空"),
        notifyType: Yup.number().required("通知类型不能为空"),
        skipType: Yup.number().default([1]).oneOf([1, 2, 3, 4]),
        skipContent: Yup.string().when("skipType", {
            is: [2, 3, 4],
            then: Yup.string().required("请输入跳转内容")
        })
    });
};
exports.vivoMessageSchema = vivoMessageSchema;
//# sourceMappingURL=vivo.js.map