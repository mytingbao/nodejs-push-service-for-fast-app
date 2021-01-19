<template>
  <div>
    <a-spin :spinning="spinning">
      <main>
        <a-form
          :model="formData"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 14 }"
        >
          <h2>消息内容</h2>
          <a-form-item label="消息标题" v-bind="validateInfos.title">
            <a-input v-model:value="formData.title"></a-input>
          </a-form-item>

          <a-form-item label="消息内容" v-bind="validateInfos.content">
            <a-textarea v-model:value="formData.content" />
          </a-form-item>

          <a-form-item label="点击通知动作">
            <a-select
              v-model:value="formData.click_action_type"
              style="width: 450px"
            >
              <a-select-option :value="0">打开应用</a-select-option>
              <a-select-option :value="1">打开网页</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 打开应用配置 -->
          <section v-show="formData.click_action_type == 0">
            <a-form-item label="APP页面">
              <a-select
                v-model:value="formData.open_app_index"
                style="width: 450px"
              >
                <a-select-option :value="0"> 首页 </a-select-option>
                <a-select-option :value="1"> 应用内页</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item
              v-if="formData.open_app_index == 1"
              :wrapper-col="{ span: 5, offset: 2 }"
            >
              <a-input
                v-model:value="formData.page"
                placeholder="页面内地址"
              ></a-input>
            </a-form-item>
            <a-form-item label="自定义键值对">
              <bd-query-input v-model:value="formData.params"></bd-query-input>
            </a-form-item>
          </section>
          <!-- 打开网页地址配置 -->
          <a-form-item v-if="formData.click_action_type == 1" label="网页地址">
            <a-input v-model:value="formData.click_action_url"></a-input>
          </a-form-item>

          <h2>基本配置</h2>

          <a-form-item :wrapper-col="{ span: 15, offset: 2 }">
            <section class="push-token-wrap">
              <div class="item">
                <h4 class="caption">oppo</h4>
                <a-radio-group v-model:value="formData.oppo_token_type">
                  <a-radio :value="0">部分用户</a-radio>
                </a-radio-group>
                <bd-token-input
                  v-model:value="formData.oppo_token"
                ></bd-token-input>
              </div>

              <div class="item">
                <h4 class="caption">华为</h4>
                <a-radio-group v-model:value="formData.huawei_token_type">
                  <a-radio :value="0">部分用户</a-radio>
                </a-radio-group>
                <bd-token-input
                  v-model:value="formData.huawei_token"
                ></bd-token-input>
              </div>

              <div class="item">
                <h4 class="caption">小米</h4>
                <a-radio-group v-model:value="formData.xiaomi_token_type">
                  <a-radio :value="0">部分用户</a-radio>
                </a-radio-group>
                <bd-token-input
                  v-model:value="formData.xiaomi_token"
                ></bd-token-input>
              </div>

              <div class="item">
                <h4 class="caption">维沃</h4>
                <a-radio-group v-model:value="formData.vivo_token_type">
                  <a-radio :value="0">部分用户</a-radio>
                </a-radio-group>
                <bd-token-input
                  v-model:value="formData.vivo_token"
                ></bd-token-input>
              </div>
            </section>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 5, offset: 2 }">
            <div class="button-wrap">
              <a-button type="primary" @click="submitForm">立即推送</a-button>
            </div>
          </a-form-item>
        </a-form>
      </main>
    </a-spin>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { useForm } from "@ant-design-vue/use";
import { useHttp } from "@/hooks/http";
import BdQueryInput from "@/components/bindian/query-input";
import BdTokenInput from "@/components/bindian/token-input";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {
    BdQueryInput,
    BdTokenInput
  },
  setup() {
    const spinning = ref(false);
    const formData = reactive({
      title: "",
      content: "",
      click_action_type: 0, // 0 打开应用； 1  打开网页
      open_app_index: 0, // 0 打开应用首页； 1  打开其他页面
      page: "",
      params: "",
      click_action_url: "", // 网页地址
      oppo_token_type: 0,
      oppo_token: "CN_12dcc07852446a8da7f146905658dffd",
      huawei_token_type: 0,
      huawei_token:
        "AFnzjZecLlNrxFglyiTt_LpO29RQ_ACxReYV0thcewraD467lIRRXI1VyWUNJZX63gmajpK2Nx6FstCY9Ud6OWHXgzrVyZLymTlTt-_d_PH79Hu6KPVRm6mHBEygbhEgEg",
      xiaomi_token_type: 0,
      xiaomi_token:
        "koSQlH2LRmbmR5vLzrVB3yTm7TtT2ncWE2Ir6vQVp5uGUFBhJoIIvaRYxe/bme5M",
      vivo_token_type: 0,
      vivo_token: "16080040871401196171822"
    });

    const { validate, validateInfos } = useForm(
      formData,
      reactive({
        title: [
          {
            required: true,
            message: "请输入推送标题"
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

    function push() {
      spinning.value = true;
      useHttp({
        uri: "api/global/push",
        body: formData
      }).then(res => {
        spinning.value = false;
        if (res.code === 200) {
          message.success("推送成功");
        } else {
          message.error(res.message);
        }
      });
    }

    const submitForm = e => {
      e.preventDefault();
      validate()
        .then(() => {
          console.log(formData);
          push();
        })
        .catch(err => {
          console.log("error", err);
        });
    };

    return {
      spinning,
      formData,
      validateInfos,
      submitForm
    };
  }
});
</script>

<style lang="scss" scoped>
.formData {
  width: 800px;
  margin: 15px 0;
}
.button-wrap {
  display: flex;
  justify-content: space-between;
}
.push-token-wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .item {
    width: 48%;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 5px;
  }
  .caption {
    font-size: 23px;
  }
}
</style>
