import { HttpClient, HttpRequestConfig } from "../../utils/api-request";
import { HcmConfig, MsgResponse } from "./model";
import { AuthClient } from "./auth";
import config from "../../../config";
interface MsgRequest {
  validate_only?: boolean;
  message?: Message;
}
interface Message {
  [key: string]: string | object;
}
const TOKENTIMEOUTERR = "80200003";
const authConfig: HcmConfig = {
  appId: config.huawei.appid,
  appSecret: config.huawei.appSecret,
  authUrl: "https://login.cloud.huawei.com/oauth2/v2/token"
};
export class HuaweiService {
  private _httpClient: HttpClient;
  private authClient: AuthClient;
  constructor() {
    this._httpClient = new HttpClient();
    this.authClient = new AuthClient(authConfig);
  }
  public async send(
    message: Message,
    validationOnly: boolean = false,
    dryRun: boolean = true
  ) {
    let request: MsgRequest = {
      validate_only: validationOnly,
      message
    };
    if (!message) {
      throw new Error("can't refresh token because getting auth client fail");
    }
    if (!this.authClient) {
      throw new Error("can't refresh token because getting auth client fail");
    }
    if (!this.authClient.token) {
      await this.authClient.refreshToken();
    }
    let result = await this.sendRequest(request, dryRun);
    if (result.code === TOKENTIMEOUTERR) {
      await this.authClient.refreshToken();
      result = await this.sendRequest(request, dryRun);
    }
    return result;
  }

  private async sendRequest(
    req: MsgRequest,
    dryRun?: boolean
  ): Promise<MsgResponse> {
    let option: HttpRequestConfig = {} as any;
    let url = config.huawei.baseUrl;
    option.uri = `${url}/${config.huawei.appid}/messages:send`;
    option.headers = {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${this.authClient.token}`
    };
    option.body = req;
    option.json = true;
    console.log(option, "option sendRequest");
    if (dryRun) {
      return this._httpClient.sendWithRetry(option).then(res => {
        let data = res.data;
        return data;
      });
    }
    return this._httpClient.send(option).then(res => {
      let data = res.data;
      return data;
    });
  }
}
