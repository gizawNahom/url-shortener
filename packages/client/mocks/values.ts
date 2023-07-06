import { ShortenedUrl, Url } from '@/utilities/httpClient';

export const totalClicksByDay = {
  totalClicks: 5,
  dailyClickCounts: [
    {
      totalClicks: 5,
      day: new Date('9/1/2023').toISOString(),
    },
  ],
};

export const invalidId = 'invalid-id';
export const validId = 'googleId1';

export const longUrl = 'https://google.com';
export const shortUrl = `https://sh.rt/${validId}`;

export const url: Url = {
  totalClicks: 0,
  longUrl,
  shortUrl,
};

export const shortenedUrl: ShortenedUrl = {
  longUrl: longUrl,
  shortUrl: shortUrl,
};
