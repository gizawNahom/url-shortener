import {
  DeviceTypePercentage,
  ShortenedUrl,
  Url,
} from '@/utilities/httpClient';

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
export const idWith0Clicks = 'googleId2';

export const longUrl = 'https://google.com';
export const shortUrl = `https://sh.rt/${validId}`;

export const url: Url = {
  totalClicks: 1,
  longUrl,
  shortUrl,
};
export const urlWith0Clicks: Url = {
  totalClicks: 0,
  longUrl,
  shortUrl,
};

export const shortenedUrl: ShortenedUrl = {
  longUrl: longUrl,
  shortUrl: shortUrl,
};

export const topDeviceTypes: DeviceTypePercentage[] = [
  {
    type: 'Desktop',
    percentage: 0.5,
  },
  {
    type: 'Mobile',
    percentage: 0.3,
  },
  {
    type: 'Tablet',
    percentage: 0.1,
  },
];

export const formattedTopDeviceTypePercentages = ['50%', '30%', '10%'];
