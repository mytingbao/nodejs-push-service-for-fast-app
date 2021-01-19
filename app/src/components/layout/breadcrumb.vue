<template>
  <ul class="breadcrumb-wrap">
    <li
      v-for="(item, index) in crumbList"
      :key="index"
      class="item"
      :class="{ 'item-last': index == crumbList.length - 1 }"
      @click="navigate(item)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
export default defineComponent({
  name: "LayoutBreadcrumb",
  setup() {
    const formatRoutes = matched => {
      if (Array.isArray(matched)) {
        return matched.map(v => {
          return {
            name: v.name,
            path: v.path
          };
        });
      }
    };
    const routes = formatRoutes(useRoute().matched);
    const crumbList = ref(routes);
    onBeforeRouteUpdate(to => {
      crumbList.value = formatRoutes(to.matched);
    });

    const router = useRouter();
    const navigate = item => {
      router.push({
        path: item.path
      });
    };

    return { crumbList, navigate };
  }
});
</script>

<style lang="scss" scoped>
.breadcrumb-wrap {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  z-index: 2;
  background-color: white;
  border-bottom: 1px solid #f5f5f5;

  .item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .item::after {
    content: ">";
    display: block;
    width: 40px;
    height: 28px;
    font-size: 16px;
    text-align: center;
  }
  .item-last::after {
    content: "";
  }
}
</style>
