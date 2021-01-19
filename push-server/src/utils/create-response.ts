import { Response } from "express";
enum ResponseCode {
  invalidParams = 400
}
export async function createInvalidParamsResponse(
  res: Response,
  message = "Bad Request"
) {
  res.send({
    code: ResponseCode["invalidParams"],
    data: null,
    message
  });
}
