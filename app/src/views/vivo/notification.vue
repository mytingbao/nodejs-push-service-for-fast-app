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

          <a-form-item label="通知类型">
            <a-radio-group v-model:value="formData.notifyType">
              <a-radio :value="1">无</a-radio>
              <a-radio :value="2">响铃</a-radio>
              <a-radio :value="3">振动</a-radio>
              <a-radio :value="4">响铃和振动</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="点击通知动作">
            <a-select v-model:value="formData.skipType" style="width: 450px">
              <a-select-option :value="1">打开应用首页</a-select-option>
              <a-select-option :value="4">打开应用内页</a-select-option>
              <a-select-option :value="2">打开链接</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 打开网页地址配置 -->
          <a-form-item v-if="formData.skipType == 2" label="网页地址">
            <a-input v-model:value="formData.skipContent"></a-input>
          </a-form-item>

          <!-- 打开应用配置 -->
          <section v-show="formData.skipType != 1">
            <a-form-item
              v-if="formData.skipType == 4"
              :wrapper-col="{ span: 5, offset: 2 }"
            >
              <a-input
                v-model:value="formData.skipContent"
                placeholder="页面内地址"
              ></a-input>
            </a-form-item>
            <!-- <a-form-item label="自定义键值对">
              <bd-query-input
                v-model:value="formData.skipContent"
              ></bd-query-input>
            </a-form-item> -->
          </section>

          <h2>基本设置</h2>

          <a-form-item :wrapper-col="{ span: 13, offset: 2 }">
            <bd-token-input v-model:value="formData.regId"></bd-token-input>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 5, offset: 2 }">
            <div class="button-wrap">
              <a-button type="primary" @click="cast">立即推送</a-button>
              <a-button type="primary" @click="saveTemplate"
                >保存消息模板</a-button
              >
              <a-button type="primary" @click="broadcast">立即广播</a-button>
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
import BdTokenInput from "@/components/bindian/token-input.vue";
// import BdQueryInput from "@/components/bindian/query-input.vue";
import { message } from "ant-design-vue";

// 16080040871401196171822  912719
export default defineComponent({
  components: {
    BdTokenInput
  },
  setup() {
    const spinning = ref(false);
    const formData = reactive({
      regId: "16080040871401196171822",
      title: "",
      content: "",
      notifyType: 1,
      skipType: 1,
      skipContent:
        "hap://app/uni.UNI5FE02E0/pages/book?novel_id=98&chapter_id=18882"
    });
    const { validate, validateInfos } = useForm(
      formData,
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

    const saveTemplate = () => {
      useHttp({ uri: "api/vivo/saveTemplate", body: formData }).then(res => {
        spinning.value = false;
        if (res.result === 0) {
          message.success(res.desc);
        } else {
          message.error(res.desc);
        }
      });
    };

    const broadcast = () => {
      useHttp({ uri: "api/vivo/saveThenBroadcast", body: formData }).then(
        res => {
          spinning.value = false;
          if (res.result === 0) {
            message.success(res.desc);
          } else {
            message.error(res.desc);
          }
        }
      );
    };
    const cast = e => {
      e.preventDefault();
      validate()
        .then(() => {
          spinning.value = true;
          useHttp({ uri: "api/vivo/cast", body: formData }).then(res => {
            spinning.value = false;
            if (res.result === 0) {
              message.success(res.desc);
            } else {
              message.error(res.desc);
            }
          });
        })
        .catch(err => {
          console.log("error", err);
        });
    };

    return {
      spinning,
      formData,
      validateInfos,
      saveTemplate,
      broadcast,
      cast
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
