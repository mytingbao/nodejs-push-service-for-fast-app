<template>
  <div class="login-container">
    <h2>登录</h2>
    <a-form
      :model="formData"
      ref="form"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 24 }"
      class="form"
    >
      <a-form-item laba="用户名">
        <a-input
          v-model:value="formData.username"
          placeholder="请输入用户名"
        ></a-input>
      </a-form-item>
      <a-form-item laba="密码">
        <a-input
          type="password"
          v-model:value="formData.passoword"
          placeholder="请输入密码"
        ></a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24 }">
        <a-button type="primary" style="width: 100%" @click="submitForm"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
enum Captial {
  零,
  一,
  二,
  三,
  四,
  五,
  六,
  七,
  八,
  九,
  十 = 10,
  百 = 100,
  千 = 1000,
  万 = 10000
}
const str = "第三章";
const mathced =
  str.match(/(零|一|二|三|四|五|六|七|八|九|十|百|千|万)/gm) || [];

const tvalue = mathced.reduce((total, now, index, arr) => {
  const next = Captial[arr[index + 1]];
  if (next >= 10) {
    return (total += Captial[now] * next);
  } else if (Captial[now] >= 10) {
    return (total += 0);
  } else {
    return (total += Captial[now]);
  }
}, 0);
console.log(tvalue);
import { defineComponent, reactive } from "vue";
import { useRouteMixin } from "@/hooks/router";
export default defineComponent({
  setup() {
    const { routerLink } = useRouteMixin();
    const formData = reactive({
      username: "",
      passoword: ""
    });
    const rules = {
      username: ""
    };
    const submitForm = (): void => {
      window.sessionStorage.setItem("token", formData.username);
      routerLink("/");
    };

    return { formData, rules, submitForm };
  }
});
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .form {
    width: 300px;
  }
}
</style>
