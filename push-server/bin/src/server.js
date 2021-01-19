"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("../config");
const port = config.server.port;
const index_1 = require("./controllers/index");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.all("*", function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "*");
            next();
        });
        app.use(yield index_1.initControllers());
        app.use("/", function (req, res) {
            res.sendFile(path.resolve(__dirname + "/../public/index.html"));
        });
        app.listen(port, () => {
            console.log(`server running at ${port}`);
        });
    });
}
// 监听未捕获的 Promise 异常，
// 直接退出进程
process.on("unhandledRejection", err => {
    console.error(err);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=server.js.map