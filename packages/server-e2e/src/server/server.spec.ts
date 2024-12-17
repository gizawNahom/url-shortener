import supertest from 'supertest';

let shortUrl: URL;
const longUrl = 'https://google.com';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ?? '3000';
const request = supertest(`http://${host}:${port}`);

test('shortens url', async () => {
  const res = await request.post('/api/urls').send({ url: longUrl });
  shortUrl = new URL(res.body.shortUrl);

  expect(res.statusCode).toBe(201);
  expect(res.body.longUrl).toBe(longUrl);
  expect(shortUrl.protocol).toBe('https:');
});

test('redirects url', async () => {
  const res = await request.get(shortUrl.pathname);

  expect(res.statusCode).toBe(302);
  expect(res.headers.location).toBe(longUrl);
});

test('saves correct click stat', async () => {
  const res = await request.get(
    `/api/urls${shortUrl.pathname}/total-clicks-by-day`
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.totalClicks).toBe(1);
  expect(res.body.dailyClickCounts.length).toBe(1);
  expect(res.body.dailyClickCounts[0].totalClicks).toBe(1);
  expect(
    new Date()
      .toISOString()
      .slice(0, -4)
      .includes(res.body.dailyClickCounts[0].day)
  ).toBe(true);
});

test('shows top device types', async () => {
  const res = await request.get(
    `/api/urls${shortUrl.pathname}/top-device-types`
  );

  expect(res.statusCode).toBe(200);
  expect(res.body).toStrictEqual({
    devices: [
      {
        type: 'desktop',
        percentage: 1,
      },
    ],
  });
});
