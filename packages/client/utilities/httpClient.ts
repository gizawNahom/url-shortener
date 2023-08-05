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

const URLS_BASE_PATH = '/api/urls';

export async function shortenUrl(longUrl: string): Promise<ShortenedUrl> {
  const response = await sendRequest({
    method: 'POST',
    path: URLS_BASE_PATH,
    data: {
      url: longUrl,
    },
  });

  return response.data;
}

export async function geTotalClicksByDay(id: string): Promise<ClickStat> {
  const response = await sendGetRequest(
    `${URLS_BASE_PATH}/${id}/total-clicks-by-day`
  );
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

export async function getUrl(id: string): Promise<Url> {
  const response = await sendGetRequest(`${URLS_BASE_PATH}/${id}`);
  return response.data;
}

export interface Url {
  longUrl: string;
  shortUrl: string;
  totalClicks: number;
}

export async function getTopDeviceTypes(
  id: string
): Promise<DeviceTypePercentage[]> {
  const response = await sendGetRequest(
    `${URLS_BASE_PATH}/${id}/top-device-types`
  );
  return response.data.devices;
}

export interface DeviceTypePercentage {
  type: string;
  percentage: number;
}

async function sendGetRequest(path: string) {
  return sendRequest({ method: 'GET', path });
}

async function sendRequest({
  method,
  path,
  data,
}: {
  method: 'GET' | 'POST';
  path: string;
  data?: object;
}) {
  return await axios.request({
    baseURL: getBaseUrl(),
    headers: { Accept: 'application/json' },
    method,
    url: path,
    data,
  });
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}
