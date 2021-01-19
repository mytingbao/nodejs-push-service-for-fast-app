<template>
  <div class="header-container">
    <img src="@/assets/images/logo.png" alt="logo" class="logo"/>
    <h6 class="caption">百香果推送平台</h6>
  </div>
</template>
<script>
export default {
  name: "LayoutHeader",
};
</script>
<style lang="scss" scoped>
.header-container {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  background-color: #c7eef7;
  z-index: 1;
  .logo{
    width: 60px;
    border-radius: 50%;
  }
  .caption{
    font-size: 26px;
    margin-left: 20px;
  }
}
</style>
