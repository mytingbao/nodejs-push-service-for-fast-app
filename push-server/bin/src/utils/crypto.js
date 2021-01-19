"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.sha256 = void 0;
const crypto = require("crypto");
function sha256(str) {
    const hash = crypto.createHash("sha256");
    return hash.update(str).digest("hex");
}
exports.sha256 = sha256;
function md5(str) {
    const hash = crypto.createHash("md5");
    return hash.update(str).digest("hex");
}
exports.md5 = md5;
//# sourceMappingURL=crypto.js.map