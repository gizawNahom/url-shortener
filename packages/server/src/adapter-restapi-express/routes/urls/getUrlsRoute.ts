import { RequestHandler, NextFunction, Request, Response } from 'express';
import { GetUrlUseCase } from 'packages/server/src/core/useCases/getUrlUseCase';
import Context from '../../context';
import { Url } from 'packages/server/src/core/domain/url';

export class GetUrlsRoute {
  static getHandlers(): Array<RequestHandler> {
    const gU = new GetUrlsRoute();
    return [gU.handle.bind(gU)];
  }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      return await this.tryHandle(req, res);
    } catch (error) {
      next(error);
    }
  }

  private async tryHandle(req, res: Response) {
    const uC = this.buildUseCase();
    const url = await this.getUrl(uC, req);
    this.sendUrl(res, url);
  }

  private buildUseCase() {
    return new GetUrlUseCase(Context.urlStorage);
  }

  private getUrl(uC: GetUrlUseCase, req: Request) {
    return uC.getUrl(req.params.id);
  }

  private sendUrl(res: Response, url: Url) {
    res.json({
      longUrl: url.getLongUrl(),
      shortUrl: `https://${process.env.domain}/${url.getShortenedId()}`,
      totalClicks: url.getTotalClicks(),
    });
  }
}