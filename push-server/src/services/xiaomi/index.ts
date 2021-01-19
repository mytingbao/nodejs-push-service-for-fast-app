import { HttpClient, HttpRequestConfig } from "../../utils/api-request";
import config from "../../../config";
import { MessageResponse, RequestConfig } from "./model";

export class XiaoMiService {
  private _httpClient: HttpClient;
  constructor() {
    this._httpClient = new HttpClient();
  }
  public async castByRegId(requestConfig: RequestConfig): Promise<object> {
    const result = await this.http({
      method: "POST",
      uri: "/v2/message/regid",
      body: requestConfig
    });

    return result;
  }
  public async castBatchByRegId(requestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/v2/multi_messages/regids",
      body: { messages: JSON.stringify(requestConfig) }
    });
    return result;
  }

  public async traceMessageStatus(requestConfig) {
    const result = await this.http({
      method: "GET",
      uri: "/v1/trace/message/status",
      body: {},
      qs: requestConfig.qs
    });

    return result;
  }

  public async upload(requestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/media/upload/image",
      formData: requestConfig,
      body: {},
      headers: { "Content-Type": "multipart/form-data" }
    });
    return result;
  }

  private async http(
    apiOptions: HttpRequestConfig,
    retry?: boolean
  ): Promise<MessageResponse> {
    const CONTETNTYPE =
      apiOptions.method === "GET"
        ? "application/json"
        : "application/x-www-form-urlencoded;charset=UTF-8";

    const customHeaders = apiOptions.headers
      ? apiOptions.headers
      : { "Content-Type": CONTETNTYPE };
    const options: HttpRequestConfig = {
      method: apiOptions.method,
      uri: `${config.xiaomi.baseUrl}${apiOptions.uri}`,
      headers: Object.assign(
        {
          Authorization: `key=${config.xiaomi.appSecret}`
        },
        customHeaders
      ),
      json: true,
      form: apiOptions.body,
      formData: apiOptions.formData,
      qs: apiOptions.qs
    };
    if (retry) {
      return this._httpClient.sendWithRetry(options).then(res => res.data);
    } else {
      return this._httpClient.send(options).then(res => res.data);
    }
  }
}
