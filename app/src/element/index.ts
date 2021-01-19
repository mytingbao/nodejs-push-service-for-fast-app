/**
 * @ElementUI
 */

import {
    /* 表单 */
    ElInput,
} from "element-plus";

export default {
    install(app) {
        // 表单
        app.use(ElInput.name, ElInput);

    }
};
