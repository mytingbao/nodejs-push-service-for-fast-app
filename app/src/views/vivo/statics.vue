<template>
  <!-- 消息消息统计页面 -->
  <div>
    <header class="bd-query">
      <div>
        <label>消息ids:</label>
        <a-textarea
          v-model:value="queryPrams.taskIds"
          placeholder="输入消息id"
          style="width:300px;"
        ></a-textarea>
      </div>

      <a-button @click="query">查询</a-button>
    </header>
    <a-card>
      <a-table :columns="columns" :data-source="tableData" size="small" />
    </a-card>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useHttp } from "@/hooks/http";
import { message } from "ant-design-vue";
export default {
  setup() {
    const tableData = ref([]);
    const queryPrams = reactive({
      taskIds: "792404282179923968"
    });
    const query = () => {
      useHttp({
        uri: `api/vivo/statics`,
        body: queryPrams
      }).then(res => {
        if (res.result === 0) {
          tableData.value = res.statistics;
          message.success(res.description);
        } else {
          message.error(res.description);
        }
      });
    };
    const timerChange = timers => {
      [queryPrams.begin_time, queryPrams.end_time] = [
        Number(timers[0].format("x")),
        Number(timers[1].format("x"))
      ];
    };
    const columns = [
      {
        title: "任务号",
        dataIndex: "taskId"
      },
      {
        title: "目标总数",
        dataIndex: "target"
      },
      {
        title: "有效目标总数",
        dataIndex: "valid"
      },
      {
        title: "下发总数",
        dataIndex: "send"
      },
      {
        title: "到达总数",
        dataIndex: "receive"
      },
      {
        title: "展示总数",
        dataIndex: "display"
      },
      {
        title: "点击数",
        dataIndex: "click"
      }
    ];

    return { tableData, columns, queryPrams, query, timerChange };
  }
};
</script>

<style lang="scss" scoped>
.bd-query {
  display: grid;
  grid-template-columns: 300px 100px;
  grid-gap: 50px;
  width: 100%;
  padding: 20px;
  box-shadow: 1px 1px 10px #e0e0e0;
}
</style>
