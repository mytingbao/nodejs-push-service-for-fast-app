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
exports.deleteFile = exports.parseTxtContent = exports.uploadSingleFile = exports.uploader = void 0;
const path = require("path");
const fs = require("fs");
const multer = require("multer");
exports.uploader = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../../static"));
        },
        filename: (req, file, cb) => {
            cb(null, new Date().getTime() + "-" + file.originalname);
        }
    }),
    limits: {
        fileSize: 1000 * 1024,
        files: 1
    }
});
/**
 * upoload single file and return the filename
 *
 * @param {Request} req Requst to be sent.(express expose)
 * @param {Response} res Response .(express expose)
 * @param {String} field Just the key of the formdata file
 * @return {Promise<Sting>} A promise that resolves with the response filename.
 */
function uploadSingleFile(req, res, field = "file") {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            const interceptor = exports.uploader.single(field);
            interceptor(req, res, err => {
                if (err) {
                    const reflectList = {
                        LIMIT_FILE_SIZE: 413
                    };
                    if (reflectList.hasOwnProperty(err.code)) {
                        return res.sendStatus(reflectList[err.code]);
                    }
                    res.send({ code: 500, data: err.message, message: "上传失败" });
                }
                else {
                    fs.exists(req.file.path, exists => {
                        if (!exists) {
                            res.send({ code: 500, data: "", message: "上传失败" });
                        }
                        else {
                            resolve({ filename: req.file.path, payload: req.body });
                        }
                    });
                }
            });
        });
    });
}
exports.uploadSingleFile = uploadSingleFile;
/**
 * Parsing text content
 * @param {String} filename filename
 * @return {String} text content
 */
function parseTxtContent(filename) {
    return new Promise(reslove => {
        const rs = fs.createReadStream(filename);
        rs.setEncoding("utf-8");
        let data = "";
        rs.on("data", trunk => {
            data += trunk;
        });
        rs.on("end", () => {
            reslove(data);
        });
    });
}
exports.parseTxtContent = parseTxtContent;
function deleteFile(filename) {
    fs.unlink(filename, err => {
        if (!err) {
            console.log(`移除${filename}成功`);
        }
    });
}
exports.deleteFile = deleteFile;
//# sourceMappingURL=uploader.js.map