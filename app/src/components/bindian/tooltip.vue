<template>
  <div style="display:inline-block;">
    <a-tooltip
      :get-popup-container="getPopupContainer"
      overlayClassName="bd-tooltip"
    >
      <template #title>
        <slot></slot>
      </template>
      <span class="qusetion">?</span>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
export default {
  name: "BdTooltip",

  setup() {
    const getPopupContainer = trigger => {
      return trigger.parentElement;
    };
    return { getPopupContainer };
  }
};
</script>

<style lang="scss" scoped>
/deep/ .ant-tooltip {
  background-color: white;
  width: 350px;
  white-space: pre-wrap;
  .ant-tooltip-inner {
    background-color: white;
    color: #999999;
  }
  .ant-tooltip-arrow::before {
    background-color: white;
  }
}
.qusetion {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 0 8px;
  line-height: 15px;
  border: 1px solid #999999;
  border-radius: 50%;
  text-align: center;
  font-size: 12px;
}
</style>
