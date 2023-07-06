import { Url } from '@/utilities/httpClient';

export const totalClicksByDay = {
  totalClicks: 5,
  dailyClickCounts: [
    {
      totalClicks: 5,
      day: new Date('9/1/2023').toISOString(),
    },
  ],
};

export const url: Url = {
  totalClicks: 0,
  longUrl: 'https://google.com',
  shortUrl: 'https://sh.rt/googleId1',
};

export const invalidId = 'invalid-id';
