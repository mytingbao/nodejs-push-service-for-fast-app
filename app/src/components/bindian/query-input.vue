<template>
  <div>
    <ul class="params-wrap">
      <li class="item item-header">
        <span class="th">键</span>
        <span class="th">值</span>
        <span class="th">操作</span>
      </li>
      <li v-for="(item, index) in paramsData" :key="index" class="item">
        <a-input v-model:value="item.key" class="item-inp"></a-input>
        <a-input v-model:value="item.value" class="item-inp"></a-input>
        <span class="del-btn" @click="delParams(index)">删除</span>
      </li>
    </ul>
    <p class="add" @click="addParams">+添加</p>
  </div>
</template>

<script lang="ts">
import { watch, onBeforeUpdate } from "vue";
import { useActionQuery } from "@/hooks/action-query";
export default {
  name: "BdQueryInput",
  props: ["value"],
  setup(props, ctx) {
    const {
      paramsData,
      addParams,
      delParams,
      transferArray2String
    } = useActionQuery();

    onBeforeUpdate(() => {
      ctx.emit("update:value", transferArray2String());
    });
    
    return { paramsData, addParams, delParams };
  }
};
</script>

<style lang="scss" scoped>
.params-wrap {
  .item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #bac0c6;
  }
  .item-header {
    padding: 0 20px;
  }
  .th {
    flex: 1;
    text-align: center;
  }
  .th::before {
    content: "|";
    display: inline-block;
    margin-right: 10px;
  }
  .item-inp {
    width: 220px;
  }
  .del-btn {
    display: inline-block;
    color: blue;
    cursor: pointer;
  }
}
.add {
  text-align: center;
  border-top: 1px solid #bac0c6;
  font-size: 16px;
  cursor: pointer;
}
</style>
