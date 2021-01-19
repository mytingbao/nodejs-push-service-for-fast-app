<template>
  <aside class="sider-container">
    <a-menu mode="inline" @click="handleClick" class="a-menu-vertical">
      <div v-for="(item, index) in routes" :key="index">
        <a-sub-menu
          v-if="item.children && item.children.length"
          :key="item.path"
        >
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级菜单 -->
          <a-menu-item
            v-for="(group, idx) in item.children"
            :key="group.path"
            :index="idx"
            >{{ group.name }}</a-menu-item
          >
        </a-sub-menu>
        <!-- 只有一级菜单 -->
        <a-menu-item v-else :key="item.path">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </div>
    </a-menu>
  </aside>
</template>
<script lang="ts">
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
interface MenuItem {
  key?: string;
}
export default {
  name: "LayoutSider",
  setup() {
    const router = useRouter();
    const routes = router.options.routes[0].children as Array<object>;

    const state = reactive({
      collapse: false
    });
    function handleClick(e: MenuItem) {
      const key = e.key as string | number;
      const path = typeof e.key === "number" ? routes[key]["path"] : key;
      router.push({ path });
    }
    return { ...toRefs(state), routes, handleClick };
  }
};
</script>
<style lang="scss" scoped>
.sider-container {
  position: fixed;
  width: 200px;
  height: 100%;
  margin-top: 80px;
}
.a-menu-vertical {
  height: 100%;
}
</style>
