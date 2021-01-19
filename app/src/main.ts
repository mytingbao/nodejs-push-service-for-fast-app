import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
const app = createApp(App);
import "@/assets/scss/index.scss";
import "./permission";
import {
  /* 表单控件 */
  Button,
  Form,
  Input,
  InputNumber,
  Upload,
  Radio,
  Select,
  Switch,
  Tooltip,
  /**菜单栏 */
  Menu,
  Table,
  Steps,
  Spin,
  Tabs,
  Card,
  DatePicker
} from "ant-design-vue";
const components = [
  Button,
  Form,
  Input,
  InputNumber,
  Table,
  Menu,
  Upload,
  Radio,
  Select,
  Steps,
  Spin,
  Switch,
  Tooltip,
  Tabs,
  Card,
  DatePicker
];
components.forEach(component => {
  app.use(component);
});

app.use(router).mount("#app");
