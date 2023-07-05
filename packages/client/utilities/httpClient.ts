import axios from 'axios';

export async function fetch(path: string): Promise<string> {
  const response = await axios.request({
    baseURL: getBaseUrl(),
    headers: { Accept: '*/*' },
    method: 'GET',
    url: path,
  });
  return response.data.greeting;
}

export async function shortenUrl(longUrl: string): Promise<ShortenedUrl> {
  const reqBody = {
    url: longUrl,
  };
  const reqConf = {
    headers: { Accept: 'application/json' },
    baseURL: getBaseUrl(),
  };

  const response = await axios.post('/api/urls', reqBody, reqConf);

  return response.data;
}

export async function geTotalClicksByDay(validId: string): Promise<ClickStat> {
  const response = await axios.request({
    baseURL: getBaseUrl(),
    headers: { Accept: 'application/json' },
    method: 'GET',
    url: `/api/urls/${validId}/total-clicks-by-day`,
  });
  return response.data;
}

export interface ShortenedUrl {
  longUrl: string;
  shortUrl: string;
}

export interface ClickStat {
  totalClicks: number;
  dailyClickCounts: Array<DailyClickCount>;
}

export interface DailyClickCount {
  day: string;
  totalClicks: number;
}

export async function getUrl(id: string) {
  const response = await axios.request({
    baseURL: getBaseUrl(),
    headers: { Accept: 'application/json' },
    method: 'GET',
    url: `/api/urls/${id}`,
  });
  return response.data;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}
