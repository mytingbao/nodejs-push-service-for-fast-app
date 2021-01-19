export interface VivoAuthConfig {
  appId: number;
  appKey: string;
  sign: string;
  timestamp: number;
}
export interface MessageResponse {
  code: number;
  result: number;
  message: string;
  data: string | LooseObject;
  taskId?: string;
}
interface LooseObject {
  [key: string]: string | object;
}

export interface RequestConfig {
  regId: string;
  notifyType: number;
  title: string;
  content: string;
  skipType: number;
  skipContent: string;
}
