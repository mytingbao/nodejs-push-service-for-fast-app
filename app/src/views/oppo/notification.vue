<template>
  <div>
    <header class="header">
      <a-steps :current="0" style="width: 500px">
        <a-step>
          <template #title> 创建推送 </template>
        </a-step>
        <a-step title="确认提交" />
      </a-steps>
    </header>
    <main>
      <a-tabs v-model:activeKey="activeTab" type="editable-card" @edit="onEdit">
        <a-tab-pane
          v-for="formData in notificationList"
          :key="formData.tabKey"
          :tab="formData.tabTitle"
        >
          <a-form
            :model="formData"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <h2>推送内容</h2>
            <a-form-item label="展示样式">
              <a-radio-group v-model:value="formData.style">
                <a-radio :value="1"
                  >短文本<bd-tooltip
                    >通知栏第一条可展示全部内容，非第一条只展示一行内容，
                    超过一行的内容不会显示</bd-tooltip
                  ></a-radio
                >
                <a-radio :value="2"
                  >长文本
                  <bd-tooltip
                    >通知栏第一条消息可展示全部内容，非第一条消息只展示一行内容。ColorOS版本>
                    5.0可用
                  </bd-tooltip></a-radio
                >
                <a-radio :value="3"
                  >大图<bd-tooltip
                    >通知栏第一条消息展示大图，非第一条消息不显示大图，推送方式仅支持广播，且不支持定速功能,只能在wifi状态下收到大图，ColorOS版本>5.0可用</bd-tooltip
                  ></a-radio
                >
              </a-radio-group>
            </a-form-item>

            <a-form-item label="消息标题" v-bind="validateInfos.title">
              <a-input
                v-model:value="formData.title"
                showCount
                :maxlength="50"
                placeholder="请输入消息标题，最长50个字符"
              ></a-input>
            </a-form-item>
            <a-form-item label="消息内容" v-bind="validateInfos.content">
              <a-textarea
                v-model:value="formData.content"
                showCount
                :maxlength="formData.style == 2 ? 128 : 50"
                :placeholder="
                  '请输入消息内容，最长' + formData.style == 2
                    ? 128
                    : 50 + '个字符'
                "
              />
            </a-form-item>
            <a-form-item label="备注">
              <a-input v-model:value="formData.remark"></a-input>
            </a-form-item>
            <a-form-item v-if="formData.style == 3" label="消息大图">
              <bd-upload @file-change="uploadImage"></bd-upload>
            </a-form-item>
            <a-form-item label="消息图标">
              <bd-upload @file-change="uploadIcon"></bd-upload>
            </a-form-item>

            <h2>基本设置</h2>

            <a-form-item label="点击动作">
              <a-radio-group v-model:value="formData.click_action_type">
                <a-radio :value="0">打开应用</a-radio>
                <a-radio :value="1">打开应用内页</a-radio>
                <a-radio :value="2">打开网页地址</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-if="formData.click_action_type != 0"
              :wrapper-col="{ span: 14, offset: 2 }"
            >
              <div v-if="formData.click_action_type == 1">
                <a-input
                  v-model:value="formData.click_action_activity"
                  placeholder="页面内地址"
                ></a-input>
              </div>

              <a-input
                v-else
                v-model:value="formData.click_action_url"
                placeholder="请输入合法的URL地址"
              ></a-input>
              <h4>
                动作参数
              </h4>
              <bd-query-input
                style="margin-top:20px;"
                v-model:value="formData.action_parameters"
              ></bd-query-input>
            </a-form-item>
            <a-form-item label="推送范围">
              <a-radio-group v-model:value="formData.target_type">
                <a-radio :value="2">Registration ID</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
              <!-- 上传registerid -->
              <bd-token-input
                v-model:value="formData.target_value"
              ></bd-token-input>
            </a-form-item>
            <a-form-item label="推送时间">
              <a-radio-group v-model:value="formData.push_time_type">
                <a-radio :value="0">立即</a-radio>
                <a-radio :value="1">定时展示</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="是否离线">
              <a-radio-group v-model:value="formData.off_line">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item v-if="formData.off_line" label="有效时长">
              <a-input-number
                v-model:value="formData.off_line_ttl"
                :min="1"
                :max="10"
                placeholder="1-240"
              />小时
            </a-form-item>
            <a-form-item label="限时展示">
              <a-radio-group v-model:value="formData.show_ttl">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="2">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <footer class="footer">
        <div class="button-wrap">
          <a-button
            type="primary"
            @click="cast('first')"
            :disabled="notificationList[0].style == 3"
            >立即单推第一条</a-button
          >
          <a-button
            type="primary"
            :disabled="notificationList[0].style == 3"
            @click="cast('all')"
            >立即单推全部</a-button
          >
          <a-button type="primary" @click="broadcast">立即广播</a-button>
          <a-button type="primary" @click="saveDraft">存为草稿</a-button>
          <a-button type="primary" @click="reset">重置</a-button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useForm } from "@ant-design-vue/use";
import BdUpload from "@/components/bindian/upload";
import BdTooltip from "@/components/bindian/tooltip.vue";
import BdTokenInput from "@/components/bindian/token-input.vue";
import BdQueryInput from "@/components/bindian/query-input.vue";
import { useHttp, useHttpUpload } from "@/hooks/http";
import { useTabParams } from "@/hooks/tab-params";
import { message } from "ant-design-vue";
const createDefaultNotification = () => {
  return {
    style: 1,
    title: "",
    content: "",
    remark: "",
    big_picture_id: "",
    small_picture_id: "",
    click_action_type: 0,
    click_action_activity: "",
    click_action_url: "",
    action_parameters: "",
    target_type: 2,
    target_value: "CN_12dcc07852446a8da7f146905658dffd",
    push_time_type: 0,
    push_start_time: "",
    show_time_type: "",
    show_start_time: "",
    show_end_time: "",
    off_line: true,
    off_line_ttl: "",
    show_ttl: "",
    channel_id: "OPPO PUSH"
  };
};
export default defineComponent({
  components: {
    BdUpload,
    BdTooltip,
    BdTokenInput,
    BdQueryInput
  },
  setup() {
    const { activeTab, notificationList, onEdit } = useTabParams(
      createDefaultNotification,
      "消息模板"
    );
    const { resetFields, validate, validateInfos } = useForm(
      notificationList,
      reactive({
        title: [
          {
            required: true
          }
        ],
        content: [
          {
            required: true,
            message: "请输入推送内容"
          }
        ]
      })
    );
    const cast = type => {
      console.log(type, notificationList, notificationList[0], "type");
      validate()
        .then(() => {
          useHttp({
            uri: `api/oppo/${type === "first" ? "unicast" : "unicastBatch"}`,
            body: type === "first" ? notificationList[0] : notificationList
          }).then(res => {
            if (res.code === 0) {
              message.success(res.message);
            } else {
              message.error(res.message);
            }
          });
        })
        .catch(err => {
          message.error(err);
          console.log("error", err);
        });
    };
    const broadcast = () => {
      useHttp({
        uri: "api/oppo/saveAndBroadcast",
        body: notificationList[0]
      }).then(res => {
        console.log(res);
      });
    };
    const saveDraft = () => {
      useHttp({
        uri: "api/oppo/saveMessage",
        body: notificationList[0]
      }).then(res => {
        console.log(res);
      });
    };
    const reset = () => {
      resetFields();
    };
    const uploadImage = files => {
      const formdata = new FormData();
      formdata.append("file", files[0]);

      useHttpUpload("api/oppo/uploadBigPicture", formdata).then(res => {
        if (res.code === 0) {
          message.success(res.description);
          const index = notificationList.findIndex(
            v => v.tabKey == activeTab.value
          );
          notificationList[index]["big_picture_id"] = res.data.big_picture_id;
        }
      });
    };

    const uploadIcon = files => {
      const formdata = new FormData();
      formdata.append("file", files[0]);
      useHttpUpload("api/oppo/uploadIcon", formdata).then(res => {
        if (res.code === 0) {
          message.success(res.description);
          const index = notificationList.findIndex(
            v => v.tabKey == activeTab.value
          );
          notificationList[index]["small_picture_id"] =
            res.data.small_picture_id;
        }
      });
    };

    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      notificationList,
      activeTab,
      onEdit,
      validateInfos,
      cast,
      broadcast,
      saveDraft,
      reset,
      uploadImage,
      uploadIcon
    };
  }
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  border-radius: 15px;
  margin-bottom: 40px;
  background-color: #f8fafc;
}
.formData {
  width: 800px;
  margin: 15px 0;
}

.footer {
  width: 70%;
  padding: 0 0 40px 110px;
}
.button-wrap {
  display: flex;
  justify-content: space-between;
  width: 500px;
  margin-top: 20px;
}
</style>
