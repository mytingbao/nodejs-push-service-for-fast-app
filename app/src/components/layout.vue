<template>
  <div>
    <layout-header></layout-header>
    <main class="layout-main">
      <layout-sider></layout-sider>
      <article class="layout-artical">
        <layout-breadcrumb></layout-breadcrumb>
        <router-view class="layout-content"></router-view>
      </article>
    </main>
  </div>
</template>
<script>
import LayoutHeader from "./layout/header";
import LayoutSider from "./layout/sider";
import LayoutBreadcrumb from "./layout/breadcrumb";
export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutSider,
    LayoutBreadcrumb
  }
};
</script>
<style lang="scss" scoped>
.layout-main {
  display: flex;
}
.layout-artical {
  flex: 1;
  margin: 80px 20px 0 200px;
}
.layout-content{
  margin-top: 60px;
  padding-left: 20px;
}
</style>
