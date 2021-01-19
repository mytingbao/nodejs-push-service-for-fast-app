<template>
  <div>
    <a-spin :spinning="spinning">
      <main>
        <a-form
          :model="formData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <h2>消息内容</h2>

          <a-form-item label="名称" v-bind="validateInfos.title">
            <a-input v-model:value="formData.name"></a-input>
          </a-form-item>

          <a-form-item label="消息标题" v-bind="validateInfos.title">
            <a-input v-model:value="formData.title"></a-input>
          </a-form-item>

          <a-form-item label="消息内容" v-bind="validateInfos.description">
            <a-textarea v-model:value="formData.description" />
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

          <a-form-item :wrapper-col="{ span: 13, offset: 2 }">
            <bd-token-input v-model:value="formData.token"></bd-token-input>
          </a-form-item>

          <h2>提醒配置</h2>
          <a-form-item label="是否震动">
            <a-switch v-model:checked="formData.vibration" />
          </a-form-item>
          <a-form-item label="是否闪烁呼吸灯">
            <a-switch v-model:checked="formData.breathLight" />
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
      name: "",
      title: "",
      description: "",
      click_action_type: 0, // 0 打开应用； 1  打开网页
      open_app_index: 0, // 0 打开应用首页； 1  打开其他页面
      page: "",
      params: "",
      click_action_url: "", // 网页地址
      token:
        "AFnzjZecLlNrxFglyiTt_LpO29RQ_ACxReYV0thcewraD467lIRRXI1VyWUNJZX63gmajpK2Nx6FstCY9Ud6OWHXgzrVyZLymTlTt-_d_PH79Hu6KPVRm6mHBEygbhEgEg,AEQixQGKuEKVM0jhDwrLys4nd8yHkiVrHCMSAZzgDPl6U0hK73FEwfCRuk9G0c27Hiu2JBELUstMg4iMOou8FhSvWszpPDePY9cJxGVyvqPBFqAY-fohZ4ZNEdrNytwP4g",
      vibration: true,
      breathLight: true
    });
    // AFnzjZecLlNrxFglyiTt_LpO29RQ_ACxReYV0thcewraD467lIRRXI1VyWUNJZX63gmajpK2Nx6FstCY9Ud6OWHXgzrVyZLymTlTt-_d_PH79Hu6KPVRm6mHBEygbhEgEg  921604
    // AEQixQGKuEKVM0jhDwrLys4nd8yHkiVrHCMSAZzgDPl6U0hK73FEwfCRuk9G0c27Hiu2JBELUstMg4iMOou8FhSvWszpPDePY9cJxGVyvqPBFqAY-fohZ4ZNEdrNytwP4g  913137 魏阳
    const { validate, validateInfos } = useForm(
      formData,
      reactive({
        title: [
          {
            required: true
          }
        ],
        name: [
          {
            required: true
          }
        ],
        description: [
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
        uri: "api/huawei",
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
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
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
</style>
