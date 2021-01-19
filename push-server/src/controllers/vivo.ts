import { Router } from "express";
import { VivoService } from "../services/vivo";
import { vivoMessageSchema } from "../moulds/vivo";
class VivoController {
  private _vivoService: VivoService;
  constructor() {
    this._vivoService = new VivoService();
  }
  public async init() {
    const router = Router();
    router.post("/cast", this.cast);
    router.post("/saveTemplate", this.saveTemplate);
    router.post("/broadcast", this.broadcast);
    router.post("/saveThenBroadcast", this.saveThenBroadcast);
    router.post("/statics", this.statics);
    router.post("/appConfig", this.appConfig);
    return router;
  }
  private async cast(req, res) {
    const body = req.body;

    try {
      await vivoMessageSchema().validate(body);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const _vivoService = new VivoService();
    const response = await _vivoService.unicast(body);
    res.send(response);
  }
  private async saveTemplate(req, res) {
    const body = req.body;
    const _vivoService = new VivoService();
    const response = await _vivoService.saveTemplate(body);
    res.send(response);
  }
  private async broadcast(req, res) {
    const body = req.body;
    const _vivoService = new VivoService();
    const response = await _vivoService.broadcast(body);
    res.send(response);
  }

  private async saveThenBroadcast(req, res) {
    const body = req.body;
    try {
      await vivoMessageSchema().validate(body);
    } catch (e) {
      return res.send({ code: 500, data: "", message: e.message });
    }

    const _vivoService = new VivoService();
    const saveResponse = await _vivoService.saveTemplate(body);
    if (saveResponse.result !== 0) {
      return res.send(saveResponse);
    }
    const regId = req.body.regId.split(",");
    const params = {
      regIds: regId,
      taskId: saveResponse.taskId
    };
    const response = await _vivoService.broadcast(params);
    res.send(response);
  }

  private async statics(req, res) {
    const { taskIds } = req.body;
    const _vivoService = new VivoService();
    const response = await _vivoService.statics(taskIds);
    res.send(response);
  }
  private async appConfig(req, res) {
    const _vivoService = new VivoService();
    const response = await _vivoService.getAppConfig();
    res.send(response);
  }
}

export async function vivoController() {
  const controller = new VivoController();
  return await controller.init();
}
