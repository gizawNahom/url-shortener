import DailyClickCountStat, {
  DailyClickCount,
} from '../domain/dailyClickCountStat';
import { UrlId } from '../domain/urlId';
import { Logger } from '../ports/logger';
import { UrlStorage } from '../ports/urlStorage';
import { checkIfUrlIsRegistered } from './domainServices';

export class TotalClicksUseCase {
  constructor(private urlStorage: UrlStorage, private logger: Logger) {}

  async getTotalClicksByDay(id: string): Promise<TotalClicksUseCaseResponse> {
    const uId = this.buildUrlId(id);
    await checkIfUrlIsRegistered(uId, this.urlStorage, this.logger);
    const stat = await this.fetchDailyClickCountStat(uId);
    this.logFetching(id, stat);
    return this.buildResponse(stat);
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private async fetchDailyClickCountStat(uId: UrlId) {
    return await this.urlStorage.getTotalClicksByDay(uId);
  }

  private logFetching(id: string, stat: DailyClickCountStat) {
    this.logger.logInfo(`Fetched total clicks by day using id(${id})`, stat);
  }

  private buildResponse(stat: DailyClickCountStat): TotalClicksUseCaseResponse {
    return {
      totalClicks: stat.getTotalClicks(),
      dailyClickCounts: stat.getDailyClickCounts(),
    };
  }
}

export interface TotalClicksUseCaseResponse {
  totalClicks: number;
  dailyClickCounts: Array<DailyClickCount>;
}
