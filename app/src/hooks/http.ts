export interface FetchOptions {
  method?: string;
  uri: string;
  body: object | FormData;
}
export async function useHttp(options: FetchOptions) {
  const response = await fetch(`http://localhost:3210/${options.uri}`, {
    method: options.method || "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options.body)
  });
  return response.json();
}

export async function useHttpReadTxt(formData: FormData) {
  const response = await fetch(`http://localhost:3210/api/global/readTxt`, {
    method: "POST",
    mode: "cors",
    body: formData
  });
  return response.json();
}
export async function useHttpUpload(uri: string, formData: FormData) {
  const response = await fetch(`http://localhost:3210/${uri}`, {
    method: "POST",
    mode: "cors",
    body: formData
  });
  return response.json();
}
