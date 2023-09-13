import { RequestHandler, Request, Response, NextFunction } from 'express';
import Context from '../../context';
import {
  GetTopDeviceTypesUseCase,
  GetTopDevicesUseCaseResponse,
} from '../../../core/useCases/getTopDeviceTypesUseCase';

export class GetTopDeviceTypesRoute {
  static getHandlers(): Array<RequestHandler> {
    const gU = new GetTopDeviceTypesRoute();
    return [gU.handle.bind(gU)];
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      next(error);
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildUseCase();
    const response = await this.getResponse(uC, req);
    this.sendResponse(res, response);
  }

  private buildUseCase() {
    return new GetTopDeviceTypesUseCase(Context.urlStorage, Context.logger);
  }

  private async getResponse(uC: GetTopDeviceTypesUseCase, req: Request) {
    return await uC.getTopDevices(req.params.id);
  }

  private sendResponse(res: Response, response: GetTopDevicesUseCaseResponse) {
    res.status(200);
    res.json(response);
  }
}
