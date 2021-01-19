export interface OppoAuthConfig {
  app_key?: string;
  sign?: string;
  timestamp: number;
}
export interface MessageResponse {
  code: number;
  message: string;
  data: string | LooseObject;
}
interface LooseObject {
  [key: string]: string | object;
}
export interface MessageContent {
  app_message_id?: string;
  title: string;
  content: string;
  click_action_type?: number;
  click_action_activity?: string;
  click_action_url?: string;
  action_parameters?: string|object;
}
export interface CastRequestConfig {
  target_type: number;
  target_value: string;
  notification: MessageContent;
  verify_registration_id?: boolean;
}
export interface BroadcastRequestConfig {
  message_id: string;
  target_type: number;
  target_value: string;
}
