import {
  HttpClient,
  HttpRequestConfig,
  HttpMethod
} from "../../utils/api-request";
import { VivoAuthConfig } from "./model";
import config from "../../../config";
import { md5 } from "../../utils/crypto";

const REFRESH_TOKEN_METHOD: HttpMethod = "POST";

export class AuthClient {
  private _httpClient: HttpClient;
  private _token: string;
  constructor() {
    this._httpClient = new HttpClient();
    this._token = "";
  }

  get httpClient(): HttpClient {
    return this._httpClient;
  }

  get token(): string {
    return this._token;
  }

  public async refreshToken() {
    let option: HttpRequestConfig = {} as any;
    option.uri = `${config.vivo.baseUrl}/message/auth`;
    option.headers = {
      "Content-Type": "application/json"
    };
    const timestamp = new Date().getTime();
    const body: VivoAuthConfig = {
      appId: config.vivo.appid,
      appKey: config.vivo.appKey,
      sign: md5(
        `${config.vivo.appid}${config.vivo.appKey}${timestamp}${config.vivo.appSecret}`
      ),
      timestamp
    };
    option.body = body;
    option.method = REFRESH_TOKEN_METHOD;
    option.json = true;
    return this._httpClient.send(option).then(response => {
      const res = response.data;
      this._token = res.authToken;
      return this._token;
    });
  }
}
