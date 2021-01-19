import { HttpClient, HttpRequestConfig } from "../../utils/api-request";
import { AuthClient } from "./auth";
import { MessageResponse, RequestConfig } from "./model";
import config from "../../../config";
const TOKENINVALIDCODES = [10000];
export class VivoService {
  private _httpClient: HttpClient;
  private authClient: AuthClient;
  constructor() {
    this._httpClient = new HttpClient();
    this.authClient = new AuthClient();
  }
  public async unicast(requestConfig: RequestConfig): Promise<object> {
    const result = await this.http({
      method: "POST",
      uri: "/message/send",
      body: requestConfig
    });
    return result;
  }
  public async saveTemplate(requestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/message/saveListPayload",
      body: requestConfig
    });
    return result;
  }

  public async broadcast(requestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/message/pushToList",
      body: requestConfig
    });
    return result;
  }

  public async statics(taskIds: string) {
    const result = await this.http({
      method: "GET",
      uri: "/report/getStatistics",
      body: {},
      qs: { taskIds }
    });
    return result;
  }

  public async getAppConfig() {
    const result = await this.http({
      method: "GET",
      uri: "/report/getAppConfig",
      body: {}
    });

    return result;
  }

  private async http(apiOptions: HttpRequestConfig, retry: boolean = true) {
    if (!this.authClient) {
      throw new Error("can't refresh token because getting auth client fail");
    }
    if (!this.authClient.token) {
      await this.authClient.refreshToken();
    }
    let result = await this.sendRequest(apiOptions, retry);
    if (TOKENINVALIDCODES.includes(result.code)) {
      await this.authClient.refreshToken();
      result = await this.sendRequest(apiOptions, retry);
    }

    return result;
  }

  private async sendRequest(
    apiOptions: HttpRequestConfig,
    retry?: boolean
  ): Promise<MessageResponse> {
    const options: HttpRequestConfig = {
      method: apiOptions.method,
      uri: `${config.vivo.baseUrl}${apiOptions.uri}`,
      headers: {
        "Content-Type": "application/json",
        authToken: ` ${this.authClient.token}`
      },
      json: true,
      body: Object.assign(apiOptions.body, {
        requestId: this.randomRequestId()
      }),
      qs: apiOptions.qs
    };
    if (retry) {
      return this._httpClient.sendWithRetry(options).then(res => res.data);
    } else {
      return this._httpClient.send(options).then(res => res.data);
    }
  }

  private randomRequestId(len = 32): string {
    len = len || 32;
    const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    const maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return pwd;
  }
}
