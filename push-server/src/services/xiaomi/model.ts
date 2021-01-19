export interface MessageResponse {
  code: number;
  description: string;
  data: string | LooseObject;
}
interface LooseObject {
  [key: string]: string | object;
}

export interface RequestConfig {
  restricted_package_name: string;
  pass_through: number;
  title: string;
  description: string;
  notify_type?: number;
  registration_id?: string;
}
