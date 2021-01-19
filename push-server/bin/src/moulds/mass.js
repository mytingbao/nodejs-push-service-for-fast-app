"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.massMessageSchema = void 0;
const Yup = require("yup");
const massMessageSchema = () => {
    return Yup.object().shape({
        title: Yup.string().required("通知标题不能为空"),
        content: Yup.string().required("通知内容不能为空"),
        huawei_token_type: Yup.number().default([0]).oneOf([0, 1]),
        huawei_token: Yup.string().when("huawei_token_type", {
            is: [0],
            then: Yup.string().required("请输入华为pushToken")
        })
    });
};
exports.massMessageSchema = massMessageSchema;
//# sourceMappingURL=mass.js.map