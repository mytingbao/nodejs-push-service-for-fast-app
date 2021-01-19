import { HttpClient, HttpRequestConfig } from "../../utils/api-request";
import {
  MessageResponse,
  MessageContent,
  CastRequestConfig,
  BroadcastRequestConfig
} from "./model";
import { AuthClient } from "./auth";
import config from "../../../config";
const TOKENINVALIDCODES = [11, 29];
enum TargetType {
  RegId = 2,
  Alias = 5,
  Label = 6
}
export class OppoService {
  private _httpClient: HttpClient;
  private authClient: AuthClient;
  constructor() {
    this._httpClient = new HttpClient();
    this.authClient = new AuthClient();
  }

  public async unicast(requestConfig: CastRequestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/server/v1/message/notification/unicast",
      body: { message: JSON.stringify(requestConfig) }
    });
    return result;
  }

  public async unicastBatch(requestConfig: Array<CastRequestConfig>) {
    const result = await this.http({
      method: "POST",
      uri: "/server/v1/message/notification/unicast_batch",
      body: { messages: JSON.stringify(requestConfig) }
    });
    return result;
  }

  public async saveMeassageContent(content: MessageContent) {
    const result = await this.http({
      method: "POST",
      uri: "/server/v1/message/notification/save_message_content",
      body: content
    });
    return result;
  }

  public async broadcast(requestConfig: BroadcastRequestConfig) {
    const result = await this.http({
      method: "POST",
      uri: "/server/v1/message/notification/broadcast",
      body: requestConfig
    });

    return result;
  }
  public async pushAmount() {
    const result = await this.http({
      method: "GET",
      uri: "/server/v1/feedback/fetch_push_permit",
      body: {}
    });

    return result;
  }
  public async uploadBigPicture(requestConfig) {
    const result = await this.http({
      method: "POST",
      baseUrl: config.oppo.mediaUrl,
      uri: "/server/v1/media/upload/big_picture",
      formData: requestConfig,
      body: {},
      headers: { "Content-Type": "multipart/form-data" }
    });
    return result;
  }

  public async uploadIcon(requestConfig) {
    const result = await this.http({
      method: "POST",
      baseUrl: config.oppo.mediaUrl,
      uri: "/server/v1/media/upload/small_picture",
      formData: requestConfig,
      body: {},
      headers: { "Content-Type": "multipart/form-data" }
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
      uri: `${apiOptions.baseUrl ? apiOptions.baseUrl : config.oppo.baseUrl}${
        apiOptions.uri
      }`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        auth_token: ` ${this.authClient.token}`
      },
      json: true,
      form: apiOptions.body,
      formData: apiOptions.formData
    };
    if (retry) {
      return this._httpClient.sendWithRetry(options).then(res => res.data);
    } else {
      return this._httpClient.send(options).then(res => res.data);
    }
  }
}
