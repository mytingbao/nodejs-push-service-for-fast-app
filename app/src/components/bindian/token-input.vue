<template>
  <!-- registerId导入上传组件 -->
  <div class="bd-token-input">
    <h4>输入RegistrationId</h4>
    <a-textarea
      v-model:value="target_value"
      placeholder="输入RegistrationId，用分号分割"
      :rows="4"
      @blur="emitValue"
    />
    <h4>RegistrationId上传</h4>
    <a-input type="file" accept="txt" @change="importText">导入txt文档</a-input>
  </div>
</template>

<script lang="ts">
import { ref, onBeforeMount } from "vue";
import { useHttpReadTxt } from "@/hooks/http";
export default {
  name: "BdTokenInput",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  setup(props, ctx) {
    const target_value = ref("");
    const emitValue = () => {
      ctx.emit("update:value", target_value.value);
    };
    const importText = e => {
      const file = e.target.files[0];
      const fd = new FormData();
      fd.append("file", file);

      useHttpReadTxt(fd).then(res => {
        if (res.code == 200) {
          target_value.value = res.data.join(",");
          emitValue();
        }
      });
    };
    onBeforeMount(() => {
      target_value.value = props.value;
    });
    return { target_value, emitValue, importText };
  }
};
</script>

<style lang="scss" scoped>
.bd-token-input {
  background-color: #f6f6f6;
  padding: 15px;
}
</style>
