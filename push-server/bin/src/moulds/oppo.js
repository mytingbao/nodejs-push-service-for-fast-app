"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oppoBroadcastSchema = exports.oppoCastBatchSchema = exports.oppoCastSchema = exports.oppoNotificationSchema = void 0;
const Yup = require("yup");
var TargetType;
(function (TargetType) {
    TargetType[TargetType["RegId"] = 2] = "RegId";
    TargetType[TargetType["Alias"] = 5] = "Alias";
    TargetType[TargetType["Label"] = 6] = "Label";
})(TargetType || (TargetType = {}));
const notification = {
    app_message_id: Yup.string(),
    style: Yup.number().required("通知栏样式不能为空"),
    big_picture_id: Yup.string().when("style", {
        is: 3,
        then: Yup.string().required("请上传大图")
    }),
    small_picture_id: Yup.string(),
    title: Yup.string()
        .required("消息标题不能为空")
        .max(50, "消息标题不可超过 50 字"),
    content: Yup.string().required("消息内容不能为空"),
    click_action_type: Yup.number().default([0]).oneOf([0, 1, 2, 3, 4, 5]),
    click_action_activity: Yup.string().when("click_action_type", {
        is: 1,
        then: Yup.string().required("请输入应用内页地址")
    }),
    click_action_url: Yup.string().when("click_action_type", {
        is: 2,
        then: Yup.string().required("请输入网页地址")
    }),
    action_parameters: Yup.string()
};
const oppoNotificationSchema = () => {
    return Yup.object().shape(notification);
};
exports.oppoNotificationSchema = oppoNotificationSchema;
const oppoCastSchema = () => {
    return Yup.object().shape({
        notification: Yup.object().shape(notification),
        target_type: Yup.number()
            .required("目标类型不能为空")
            .default([TargetType["RegId"]])
            .oneOf([2, 5, 6]),
        target_value: Yup.string().required("推送目标用户不能为空")
    });
};
exports.oppoCastSchema = oppoCastSchema;
const oppoCastBatchSchema = () => {
    const castSchema = exports.oppoCastSchema();
    return Yup.array().of(castSchema);
};
exports.oppoCastBatchSchema = oppoCastBatchSchema;
const oppoBroadcastSchema = () => {
    return Yup.object().shape({
        message_id: Yup.string().required("消息模板id不能为空"),
        target_type: Yup.number()
            .required("目标类型不能为空")
            .default([TargetType["RegId"]])
            .oneOf([2, 5, 6]),
        target_value: Yup.string().required("推送目标用户不能为空")
    });
};
exports.oppoBroadcastSchema = oppoBroadcastSchema;
//# sourceMappingURL=oppo.js.map