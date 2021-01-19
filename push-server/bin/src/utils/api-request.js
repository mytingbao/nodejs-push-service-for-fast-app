"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.defaultRetryConfig = exports.HttpClient = void 0;
const rp = require("request-promise");
const validator = __importStar(require("./validator"));
function send(options) {
    return __awaiter(this, void 0, void 0, function* () {
        options.resolveWithFullResponse = true;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        return rp(options)
            .then(result => {
            return Promise.resolve(createHttpResponse(result));
        })
            .catch(err => {
            return Promise.reject(err);
        });
    });
}
/**
 * Default retry configuration for HTTP requests. Retries up to 4 times on connection reset and timeout errors
 * as well as HTTP 503 errors. Exposed as a function to ensure that every HttpClient gets its own RetryConfig
 * instance.
 */
/**
 * Ensures that the given RetryConfig object is valid.
 *
 * @param retry The configuration to be validated.
 */
function validateRetryConfig(retry) {
    if (!validator.isNumber(retry.maxRetries) || retry.maxRetries < 0) {
        throw new Error("maxRetries must be a non-negative integer");
    }
    if (typeof retry.backOffFactor !== "undefined") {
        if (!validator.isNumber(retry.backOffFactor) || retry.backOffFactor < 0) {
            throw new Error("backOffFactor must be a non-negative number");
        }
    }
    if (!validator.isNumber(retry.maxDelayInMillis) ||
        retry.maxDelayInMillis < 0) {
        throw new Error("maxDelayInMillis must be a non-negative integer");
    }
    if (typeof retry.statusCodes !== "undefined" &&
        !Array.isArray(retry.statusCodes)) {
        throw new Error("statusCodes must be an array");
    }
    if (typeof retry.ioErrorCodes !== "undefined" &&
        !Array.isArray(retry.ioErrorCodes)) {
        throw new Error("ioErrorCodes must be an array");
    }
}
class DefaultHttpResponse {
    /**
     * Constructs a new HttpResponse from the given LowLevelResponse.
     */
    constructor(resp) {
        this.status = resp.statusCode;
        this.headers = resp.headers;
        let body = resp.body || "";
        this.parseError = { name: "", message: "" };
        this.text = validator.isString(body) ? body : JSON.stringify(body);
        try {
            this.parsedData = validator.isString(body) ? JSON.parse(body) : body;
        }
        catch (err) {
            this.parsedData = undefined;
            this.parseError = err;
        }
        this.request = resp.request;
    }
    get data() {
        if (this.isJson()) {
            return this.parsedData;
        }
        throw new Error(`Error while parsing response data: "${this.parseError.toString()}". Raw server ` +
            `response: "${this.text}". Status code: "${this.status}". Outgoing ` +
            `request: "${this.request}."`);
    }
    isJson() {
        return !!this.parsedData;
    }
}
function createHttpResponse(resp) {
    if (!resp) {
        return;
    }
    return new DefaultHttpResponse(resp);
}
class HttpClient {
    constructor(retry = defaultRetryConfig()) {
        this.retry = retry;
        if (this.retry) {
            validateRetryConfig(this.retry);
        }
    }
    /**
     * Sends an HTTP request to a remote server.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    send(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return send(config)
                .then(resp => {
                return resp;
            })
                .catch(err => {
                if (err.response) {
                    throw new Error(JSON.stringify(createHttpResponse(err.response)));
                }
                if (err.error.code === "ETIMEDOUT") {
                    throw new Error(`Error while making request: ${err.message}.`);
                }
                throw new Error(`Error while making request: ${err.message}. Error code: ${err.error.code}`);
            });
        });
    }
    /**
     * Meet the conditions, repeat the request.
     *
     * @param {HttpRequest} config HTTP request to be sent.
     * @return {Promise<HttpResponse>} A promise that resolves with the response details.
     */
    sendWithRetry(config, retryAttempts = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return send(config)
                .then(resp => {
                return resp;
            })
                .catch(err => {
                console.log(err);
                const [delayMillis, canRetry] = this.getRetryDelayMillis(retryAttempts, err);
                if (canRetry && delayMillis <= this.retry.maxDelayInMillis) {
                    return this.waitForRetry(delayMillis).then(() => {
                        return this.sendWithRetry(config, retryAttempts + 1);
                    });
                }
                if (err.response) {
                    throw new Error(JSON.stringify(createHttpResponse(err.response)));
                }
                if (err.error.code === "ETIMEDOUT") {
                    throw new Error(`Error while making request: ${err.message}.`);
                }
                throw new Error(`Error while making request: ${err.message}. Error code: ${err.error.code}`);
            });
        });
    }
    waitForRetry(delayMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            if (delayMillis > 0) {
                return new Promise(resolve => {
                    setTimeout(resolve, delayMillis);
                });
            }
            return Promise.resolve();
        });
    }
    /**
     * Parses the Retry-After HTTP header as a milliseconds value. Return value is negative if the Retry-After header
     * contains an expired timestamp or otherwise malformed.
     */
    parseRetryAfterIntoMillis(retryAfter) {
        const delaySeconds = parseInt(retryAfter, 10);
        if (!isNaN(delaySeconds)) {
            return delaySeconds * 1000;
        }
        const date = new Date(retryAfter);
        if (!isNaN(date.getTime())) {
            return date.getTime() - Date.now();
        }
        return -1;
    }
    backOffDelayMillis(retryAttempts) {
        if (retryAttempts === 0) {
            return 0;
        }
        const backOffFactor = this.retry.backOffFactor || 0;
        const delayInSeconds = 2 ** retryAttempts * backOffFactor;
        return Math.min(delayInSeconds * 1000, this.retry.maxDelayInMillis);
    }
    /**
     * Checks if a failed request is eligible for a retry, and if so returns the duration to wait before initiating
     * the retry.
     *
     * @param {number} retryAttempts Number of retries completed up to now.
     * @param {LowLevelError} err The last encountered error.
     * @returns {[number, boolean]} A 2-tuple where the 1st element is the duration to wait before another retry, and the
     *     2nd element is a boolean indicating whether the request is eligible for a retry or not.
     */
    getRetryDelayMillis(retryAttempts, err) {
        if (!this.isRetryEligible(retryAttempts, err)) {
            return [0, false];
        }
        let response = err.response;
        let headers = response ? response.headers : undefined;
        if (headers && headers["retry-after"]) {
            const delayMillis = this.parseRetryAfterIntoMillis(headers["retry-after"]);
            if (delayMillis > 0) {
                return [delayMillis, true];
            }
        }
        return [this.backOffDelayMillis(retryAttempts), true];
    }
    isRetryEligible(retryAttempts, err) {
        if (!this.retry) {
            return false;
        }
        if (retryAttempts >= this.retry.maxRetries) {
            return false;
        }
        if (err.response) {
            const statusCodes = this.retry.statusCodes || [];
            return statusCodes.indexOf(err.response.status) !== -1;
        }
        const retryCodes = this.retry.ioErrorCodes || [];
        return retryCodes.indexOf(err.error.code) !== -1;
    }
}
exports.HttpClient = HttpClient;
/**
 * Default retry configuration for HTTP requests. Retries up to 4 times on connection reset and timeout errors
 * as well as HTTP 503 errors. Exposed as a function to ensure that every HttpClient gets its own RetryConfig
 * instance.
 */
function defaultRetryConfig() {
    return {
        maxRetries: 4,
        statusCodes: [503, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
        ioErrorCodes: [
            "ECONNRESET",
            "ETIMEDOUT",
            "EADDRINUSE",
            "ECONNREFUSED",
            "EPIPE",
            "ENOTFOUND",
            "ENETUNREACH",
            "EAI_AGAIN"
        ],
        backOffFactor: 0.5,
        maxDelayInMillis: 60 * 1000
    };
}
exports.defaultRetryConfig = defaultRetryConfig;
//# sourceMappingURL=api-request.js.map