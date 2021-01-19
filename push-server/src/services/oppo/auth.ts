import {
  HttpClient,
  HttpRequestConfig,
  HttpMethod
} from "../../utils/api-request";
import { OppoAuthConfig } from "./model";
import config from "../../../config";
import { sha256 } from "../../utils/crypto";
import { response } from "express";
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
    option.uri = `${config.oppo.baseUrl}/server/v1/auth`;
    option.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    const timestamp = new Date().getTime();
    const form: OppoAuthConfig = {
      app_key: config.oppo.appKey,
      sign: sha256(
        `${config.oppo.appKey}${timestamp}${config.oppo.MasterSecrect}`
      ),
      timestamp
    };
    option.form = form;
    option.method = REFRESH_TOKEN_METHOD;
    option.json = true;
    return this._httpClient.send(option).then(response => {
      const res = response.data;
      this._token = res.data.auth_token;
      return this._token;
    });
    
  }
}
