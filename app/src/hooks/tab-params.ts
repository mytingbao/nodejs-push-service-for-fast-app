import { reactive, ref } from "vue";
interface Factory {
  (): object;
}
const activeTab = ref("1");
let newTabIndex = 0;

export function useTabParams(factory: Factory, titleTemplate = "文案") {
  const notificationList = reactive([
    Object.assign(factory(), {
      tabTitle: `${titleTemplate}1`,
      tabKey: "1"
    })
  ]);

  const add = () => {
    const len = notificationList.length + 1;
    const activeKey = `tab${newTabIndex++}`;
    notificationList.push(
      Object.assign(factory(), {
        tabTitle: `${titleTemplate}${len}`,
        tabKey: activeKey
      })
    );
    activeTab.value = activeKey;
  };

  const sortList = nowIndex => {
    notificationList.forEach((item, i) => {
      item.tabTitle = `${titleTemplate}${i + 1}`;
    });

    let target;
    const len = notificationList.length;

    if (len > 1) {
      target = nowIndex > 0 ? nowIndex - 1 : nowIndex + 1;
    } else {
      target = 0;
    }

    if (len) {
      activeTab.value = notificationList[target].tabKey;
    }
  };

  const remove = targetKey => {
    if (notificationList.length > 1) {
      const index = notificationList.findIndex(v => {
        return v.tabKey === targetKey;
      });

      notificationList.splice(index, 1);
      sortList(index);
    }
  };

  const onEdit = (targetKey, action) => {
    if (action == "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return { activeTab, notificationList, onEdit };
}
