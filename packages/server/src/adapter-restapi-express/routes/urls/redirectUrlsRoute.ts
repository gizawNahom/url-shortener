import { NextFunction, Request, RequestHandler, Response } from 'express';
import UAParser from 'ua-parser-js';
import { RedirectUseCase } from '../../../core/useCases/redirectUseCase';
import Context from '../../context';

export class RedirectUrlsRoute {
  static getHandlers(): Array<RequestHandler> {
    const rU = new RedirectUrlsRoute();
    return [rU.handle.bind(rU)];
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tryHandle(req, res);
    } catch (error) {
      next(error);
    }
  }

  private async tryHandle(req: Request, res: Response) {
    const uC = this.buildRedirectUseCase();
    const rUrl = await this.getRedirectUrl(uC, req);
    this.redirect(res, rUrl);
  }

  private buildRedirectUseCase() {
    return new RedirectUseCase(Context.urlStorage, Context.logger);
  }

  private async getRedirectUrl(uC: RedirectUseCase, req): Promise<string> {
    const deviceType = parseDeviceType();
    return await uC.execute(req.params.id, deviceType);

    function parseDeviceType() {
      const parser = new UAParser(req.headers['user-agent']);
      return parser.getDevice().type;
    }
  }

  private redirect(res: Response, redirectUrl: string) {
    res.redirect(302, redirectUrl);
  }
}
