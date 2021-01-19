const rp = require("request-promise");
import * as validator from "./validator";
async function send(options: HttpRequestConfig): Promise<HttpResponse> {
  options.resolveWithFullResponse = true;
  options.timeout=52000;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  return rp(options)
    .then(result => {
      return Promise.resolve(createHttpResponse(result));
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Specifies how failing HTTP requests should be retried.
 */
export interface RetryConfig {
  /** Maximum number of times to retry a given request. */
  maxRetries: number;

  /** HTTP status codes that should be retried. */
  statusCodes?: number[];

  /** Low-level I/O error codes that should be retried. */
  ioErrorCodes?: string[];

  /**
   * The multiplier for exponential back off. When the backOffFactor is setto 0, retries are not delayed.
   * When the backOffFactor is 1, retry duration is doubled each iteration.
   */
  backOffFactor?: number;

  /** Maximum duration to wait before initiating a retry. */
  maxDelayInMillis: number;
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
function validateRetryConfig(retry: RetryConfig) {
  if (!validator.isNumber(retry.maxRetries) || retry.maxRetries < 0) {
    throw new Error("maxRetries must be a non-negative integer");
  }

  if (typeof retry.backOffFactor !== "undefined") {
    if (!validator.isNumber(retry.backOffFactor) || retry.backOffFactor < 0) {
      throw new Error("backOffFactor must be a non-negative number");
    }
  }

  if (
    !validator.isNumber(retry.maxDelayInMillis) ||
    retry.maxDelayInMillis < 0
  ) {
    throw new Error("maxDelayInMillis must be a non-negative integer");
  }

  if (
    typeof retry.statusCodes !== "undefined" &&
    !Array.isArray(retry.statusCodes)
  ) {
    throw new Error("statusCodes must be an array");
  }

  if (
    typeof retry.ioErrorCodes !== "undefined" &&
    !Array.isArray(retry.ioErrorCodes)
  ) {
    throw new Error("ioErrorCodes must be an array");
  }
}
/**
 * Represents an HTTP response received from a remote server.
 */
export interface HttpResponse {
  readonly status: number;
  readonly headers: any;
  /** Response data as a raw string. */
  readonly text: string;
  /** Response data as a parsed JSON object. */
  readonly data: any;
  /** For multipart responses, the payloads of individual parts. */
  readonly multipart?: Buffer[];
  /**
   * Indicates if the response content is JSON-formatted or not. If true, data field can be used
   * to retrieve the content as a parsed JSON object.
   */
  isJson(): boolean;
}

interface LowLevelResponse {
  statusCode: number;
  headers: any;
  body: string;
  request: any;
}

class DefaultHttpResponse implements HttpResponse {
  public readonly status: number;
  public readonly headers: any;
  public readonly text: string;
  private readonly request: string;
  private readonly parsedData: any;
  private readonly parseError: Error;

  /**
   * Constructs a new HttpResponse from the given LowLevelResponse.
   */
  constructor(resp: LowLevelResponse) {
    this.status = resp.statusCode;
    this.headers = resp.headers;
    let body = resp.body || "";
    this.parseError = { name: "", message: "" };
    this.text = validator.isString(body) ? body : JSON.stringify(body);

    try {
      this.parsedData = validator.isString(body) ? JSON.parse(body) : body;
    } catch (err) {
      this.parsedData = undefined;
      this.parseError = err;
    }
    this.request = resp.request;
  }

  get data(): any {
    if (this.isJson()) {
      return this.parsedData;
    }
    throw new Error(
      `Error while parsing response data: "${this.parseError.toString()}". Raw server ` +
        `response: "${this.text}". Status code: "${this.status}". Outgoing ` +
        `request: "${this.request}."`
    );
  }

  public isJson(): boolean {
    return !!this.parsedData;
  }
}
function createHttpResponse(resp: LowLevelResponse): undefined | HttpResponse {
  if (!resp) {
    return;
  }
  return new DefaultHttpResponse(resp);
}

export class HttpClient {
  constructor(private readonly retry: RetryConfig = defaultRetryConfig()) {
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
  public async send(config: HttpRequestConfig): Promise<HttpResponse> {
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
        throw new Error(
          `Error while making request: ${err.message}. Error code: ${err.error.code}`
        );
      });
  }

  /**
   * Meet the conditions, repeat the request.
   *
   * @param {HttpRequest} config HTTP request to be sent.
   * @return {Promise<HttpResponse>} A promise that resolves with the response details.
   */
  public async sendWithRetry(
    config: HttpRequestConfig,
    retryAttempts: number = 0
  ): Promise<HttpResponse> {
    return send(config)
      .then(resp => {
        return resp;
      })
      .catch(err => {
        console.log(err)
        const [delayMillis, canRetry] = this.getRetryDelayMillis(
          retryAttempts,
          err
        );
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
        throw new Error(
          `Error while making request: ${err.message}. Error code: ${err.error.code}`
        );
      });
  }

  private async waitForRetry(delayMillis: number): Promise<any> {
    if (delayMillis > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, delayMillis);
      });
    }
    return Promise.resolve();
  }

  /**
   * Parses the Retry-After HTTP header as a milliseconds value. Return value is negative if the Retry-After header
   * contains an expired timestamp or otherwise malformed.
   */
  private parseRetryAfterIntoMillis(retryAfter: string): number {
    const delaySeconds: number = parseInt(retryAfter, 10);
    if (!isNaN(delaySeconds)) {
      return delaySeconds * 1000;
    }

    const date = new Date(retryAfter);
    if (!isNaN(date.getTime())) {
      return date.getTime() - Date.now();
    }
    return -1;
  }

  private backOffDelayMillis(retryAttempts: number): number {
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
  private getRetryDelayMillis(
    retryAttempts: number,
    err: any
  ): [number, boolean] {
    if (!this.isRetryEligible(retryAttempts, err)) {
      return [0, false];
    }
    let response = err.response;
    let headers = response ? response.headers : undefined;
    if (headers && headers["retry-after"]) {
      const delayMillis = this.parseRetryAfterIntoMillis(
        headers["retry-after"]
      );
      if (delayMillis > 0) {
        return [delayMillis, true];
      }
    }

    return [this.backOffDelayMillis(retryAttempts), true];
  }

  private isRetryEligible(retryAttempts: number, err: any): boolean {
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

export type HttpMethod = "GET" | "POST" | "PUT";
export interface HttpRequestConfig {
  method: HttpMethod;
  baseUrl?: string;
  uri: string;
  headers?: LooseObject;
  qs?: LooseObject;
  body?: string | object | Buffer;
  form?: string | object | Buffer;
  formData?: string | object | Buffer;
  multipart?: string | object | Buffer;
  timeout?: number;
  json?: boolean;
  resolveWithFullResponse?: boolean;
}
interface LooseObject {
  [key: string]: string;
}
export interface RetryConfig {
  maxRetries: number;
  statusCodes?: number[];
  ioErrorCodes?: string[];

  /**
   * The multiplier for exponential back off. When the backOffFactor is setto 0, retries are not delayed.
   * When the backOffFactor is 1, retry duration is doubled each iteration.
   */
  backOffFactor?: number;

  /** Maximum duration to wait before initiating a retry. */
  maxDelayInMillis: number;
}

/**
 * Default retry configuration for HTTP requests. Retries up to 4 times on connection reset and timeout errors
 * as well as HTTP 503 errors. Exposed as a function to ensure that every HttpClient gets its own RetryConfig
 * instance.
 */
export function defaultRetryConfig(): RetryConfig {
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
