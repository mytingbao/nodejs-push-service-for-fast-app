import { RetryConfig } from "../../utils/api-request";
export interface MessagingConfig {
  devappid: string;
  messagingUrl?: string;
  retryConfig?: RetryConfig;
}
export interface HcmConfig {
  appId: string;
  appSecret: string;
  authUrl: string;
  pushUrl?: string;
}
export interface MsgResponse {
  code: string;
  msg: string;
  requestId: string;
}
