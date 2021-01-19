<template>
  <!-- 消息消息统计页面 -->
  <div>
    <header class="bd-query">
      <div>
        <label>消息id:</label>
        <a-input
          v-model:value="queryPrams.id"
          placeholder="输入消息id"
          style="width:300px;"
        ></a-input>
      </div>

      <div>
        <label>推送时间:</label>
        <a-range-picker
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{ format: 'HH:mm:ss' }"
          :placeholder="['Start Time', 'End Time']"
          @ok="timerChange"
        />
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
      id: "sdm60081608888649329QR",
      begin_time: "",
      end_time: ""
    });
    const query = () => {
      useHttp({
        uri: `api/xiaomi/traceMessage`,
        body: queryPrams
      }).then(res => {
        if (res.code === 0) {
          const list = res.data.data;
          if (Array.isArray(list)) {
            tableData.value = list;
          } else {
            Object.keys(list).length > 0
              ? (tableData.value = [list])
              : (tableData.value = []);
          }
          console.log(tableData, "data");
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
        title: "消息ID",
        dataIndex: "id"
      },
      {
        title: "计划送达数",
        dataIndex: "resolved"
      },
      {
        title: "网络请求原始目标数",
        dataIndex: "raw_counter"
      },
      {
        title: "实际下发数",
        dataIndex: "msg_send"
      },
      {
        title: "实际送达数",
        dataIndex: "delivered"
      },
      {
        title: "实际展示数",
        dataIndex: "msg_display"
      },
      {
        title: "点击数",
        dataIndex: "click"
      },
      {
        title: "点击率",
        dataIndex: "click_rate"
      },
      {
        title: "消息发送时间",
        dataIndex: "create_time"
      }
    ];

    return { tableData, columns, queryPrams, query, timerChange };
  }
};
</script>

<style lang="scss" scoped>
.bd-query {
  display: grid;
  grid-template-columns: 300px 400px 100px;
  grid-gap: 50px;
  width: 100%;
  padding: 20px;
  box-shadow: 1px 1px 10px #e0e0e0;
}
</style>
