<template>
  <div class="notify-container">
    <main style="flex:1;">
      <a-tabs v-model:activeKey="activeTab" type="editable-card" @edit="onEdit">
        <a-tab-pane
          v-for="formData in notificationList"
          :key="formData.tabKey"
          :tab="formData.tabTitle"
        >
          <a-form
            :model="formData"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 14 }"
          >
            <h2>推送内容</h2>
            <a-form-item label="展示样式">
              <a-radio-group v-model:value="formData.style">
                <a-radio value="0"
                  >短文本<bd-tooltip
                    >通知栏第一条可展示全部内容，非第一条只展示一行内容，
                    超过一行的内容不会显示</bd-tooltip
                  ></a-radio
                >
                <a-radio value="1"
                  >长文本
                  <bd-tooltip
                    >通知栏第一条消息会全部展开；非第一条消息时和普通消息一样只展示标题和第一行文字，需要长按通知来展开全部内容。国内版MIUI可以通过\n换行
                  </bd-tooltip></a-radio
                >
                <a-radio value="2"
                  >大图<bd-tooltip
                    >通知栏第一条消息展示大图，非第一条消息不显示大图</bd-tooltip
                  ></a-radio
                >
              </a-radio-group>
            </a-form-item>

            <a-form-item label="推送标题" v-bind="validateInfos.title">
              <a-input
                v-model:value="formData.title"
                showCount
                :maxlength="50"
                placeholder="请输入消息标题，最长50个字符"
              ></a-input>
            </a-form-item>
            <a-form-item label="消息摘要">
              <a-textarea
                v-model:value="formData.description"
                :maxlength="128"
              />
            </a-form-item>
            <a-form-item v-if="formData.style == 2" label="消息大图">
              <bd-upload @file-change="uploadImage"></bd-upload>
            </a-form-item>

            <a-form-item label="点击动作">
              <a-radio-group v-model:value="formData.notify_effect">
                <a-radio value="1">打开应用</a-radio>
                <a-radio value="2">打开应用内页</a-radio>
                <a-radio value="3">打开网页地址</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item
              v-if="formData.notify_effect != 1"
              :wrapper-col="{ span: 14, offset: 2 }"
            >
              <div v-if="formData.notify_effect == 2">
                <a-input
                  v-model:value="formData.intent_uri"
                  placeholder="页面内地址"
                ></a-input>
              </div>
              <a-input
                v-else
                v-model:value="formData.web_uri"
                placeholder="请输入合法的URL地址"
              ></a-input>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
              <details>
                <summary>左侧按钮</summary>
                <div class="btn-setting-wrap">
                  <a-input
                    v-model:value="formData.button_left_name"
                    placeholder="请输入左侧按钮名称"
                    class="name-input"
                  ></a-input>
                  <a-radio-group
                    v-model:value="formData.button_left_notify_effect"
                  >
                    <a-radio value="1">打开应用</a-radio>
                    <a-radio value="2">打开应用内页</a-radio>
                    <a-radio value="3">打开网页地址</a-radio>
                  </a-radio-group>
                  <a-input
                    v-if="formData.button_left_notify_effect == 2"
                    v-model:value="formData.button_left_intent_uri"
                    placeholder="请输入左侧按钮的页面内跳转地址"
                  ></a-input>
                  <a-input
                    v-if="formData.button_left_notify_effect == 3"
                    v-model:value="formData.button_left_web_uri"
                    placeholder="请输入左侧按钮的网页跳转地址"
                  ></a-input>
                </div>
              </details>
            </a-form-item>

            <h2>基本设置</h2>

            <a-form-item label="推送范围">
              <a-radio-group v-model:value="formData.target_type">
                <a-radio :value="2">Registration ID</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
              <!-- 上传registerid -->
              <bd-token-input
                v-model:value="formData.registration_id"
              ></bd-token-input>
            </a-form-item>
            <a-form-item label="推送时间">
              <a-radio-group v-model:value="formData.time_to_send">
                <a-radio :value="0">立即</a-radio>
                <a-radio :value="1">定时展示</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <footer class="footer">
        <div class="button-wrap">
          <a-button type="primary" @click="cast('first')"
            >推送第一条文案</a-button
          >
          <a-button type="primary" @click="cast('all')">推送全部</a-button>
        </div>
      </footer>
    </main>

    <!-- 模拟器 -->
    <aside class="aside">
      <section class="cell-wrap">
        <img
          src="https://file.static.xiaomi.net/download/AppStore/026b15dfde32acdf96ee760ad22e7c94cd140e8ff"
          class="logo"
        />
        <div class="main">
          <div class="top">
            <p class="title">{{ notificationList[0]["title"] }}</p>
            <p class="content">{{ notificationList[0]["description"] }}</p>
          </div>
          <img
            v-if="notificationList[0]['style'] == 2"
            :src="notificationList[0]['pic_url']"
            alt=""
          />
          <div class="buttom">
            <span class="btn">{{
              notificationList[0]["button_left_name"]
            }}</span>
          </div>
        </div>
      </section>
    </aside>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useForm } from "@ant-design-vue/use";
import BdUpload from "@/components/bindian/upload";
import BdTokenInput from "@/components/bindian/token-input.vue";
import BdTooltip from "@/components/bindian/tooltip.vue";
import { useHttp, useHttpUpload } from "@/hooks/http";
import { useTabParams } from "@/hooks/tab-params";
import { message } from "ant-design-vue";
const createDefaultNotification = () => {
  return {
    style: "0",
    pass_through: 0,
    restricted_package_name: "uni.UNI5FE02E0",
    title: "",
    description: "",
    notify_type: "",
    target_type: 2,
    registration_id:
      "koSQlH2LRmbmR5vLzrVB3yTm7TtT2ncWE2Ir6vQVp5uGUFBhJoIIvaRYxe/bme5M",
    web_uri: "",
    notify_effect: "2",
    intent_uri: "/pages/book/profile?novel_id=98",
    pic_url: "",
    icon_url: "",
    button_left_name: "",
    button_left_notify_effect: "1",
    button_left_intent_uri: "",
    button_left_web_uri: "",
    time_to_send: ""
  };
};
// YtONgKTWQqDWKNpGpY0DKdmsCqMg4LB2z1Mhum4S532qBYcV0f3Pf0UfNmo1QVp3   912944
// 2EGmIJ4N5rIzM8b6dzlX8LhjfF9VL9NEBxeqVkaGvfIkXduK5luf9JuLKEmpJmpB   913570
// koSQlH2LRmbmR5vLzrVB3yTm7TtT2ncWE2Ir6vQVp5uGUFBhJoIIvaRYxe/bme5M   914046
export default defineComponent({
  components: {
    BdUpload,
    BdTokenInput,
    BdTooltip
  },
  setup() {
    const { activeTab, notificationList, onEdit } = useTabParams(
      createDefaultNotification
    );
    const { validate, validateInfos } = useForm(
      notificationList,
      reactive({
        title: [
          {
            required: true
          }
        ]
      })
    );
    const cast = type => {
      validate()
        .then(() => {
          useHttp({
            uri: `api/xiaomi/${
              type === "first" ? "castByRegId" : "castByRegIds"
            }`,
            body: type === "first" ? notificationList[0] : notificationList
          }).then(res => {
            if (res.code === 0) {
              message.success(res.description);
            } else {
              message.error(res.description);
            }
          });
        })
        .catch(err => {
          message.error(err);
          console.log("error", err);
        });
    };
    const uploadImage = files => {
      console.log(files);
      const formdata = new FormData();
      formdata.append("file", files[0]);
      formdata.append("is_icon", false);
      formdata.append("is_global", false);
      useHttpUpload("api/xiaomi/upload", formdata).then(res => {
        if (res.code === 0) {
          message.success(res.description);
          const index = notificationList.findIndex(
            v => v.tabKey == activeTab.value
          );
          notificationList[index]["pic_url"] = res.data.pic_url;
          console.log(index, res.data, activeTab);
        }
      });
    };
    return {
      notificationList,
      activeTab,
      onEdit,
      validateInfos,
      cast,
      uploadImage
    };
  }
});
</script>

<style lang="scss" scoped>
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
  width: 300px;
  margin-top: 20px;
}
.notify-container {
  display: flex;
}
.btn-setting-wrap {
  .name-input {
    width: 300px;
  }
}
.aside {
  position: relative;
  width: 460px;
  height: 800px;
  margin-left: 100px;
  background-size: cover;
  background-image: url("http://f3.market.xiaomi.com/download/MiPass/09f01427a490a8b986d8baf003f9229fb114081da/largeicon-en3.png");
  .cell-wrap {
    position: absolute;
    top: 326px;
    left: 10px;
    display: flex;
    width: 440px;
    height: 213px;
    padding: 15px;
    background-color: white;
    border-radius: 10px;
  }
  .logo {
    width: 26px;
    height: 26px;
    margin-right: 20px;
  }
  .title {
    width: 360px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .buttom {
    align-items: flex-end;
    .btn {
      color: #ff4a00;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
