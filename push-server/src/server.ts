const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("../config");
const port = config.server.port;
import { initControllers } from "./controllers/index";
async function bootstrap() {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

  app.use(await initControllers());
  app.use("/", function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../public/index.html"));
  });

  app.listen(port, () => {
    console.log(`server running at ${port}`);
  });
}

// 监听未捕获的 Promise 异常，
// 直接退出进程
process.on("unhandledRejection", err => {
  console.error(err);
  process.exit(1);
});

bootstrap();
