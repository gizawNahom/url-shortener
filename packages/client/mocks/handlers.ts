import { rest } from 'msw';
import { invalidId, totalClicksByDay, url } from './values';

export const handlers = [
  rest.get('/api', (_req, res, ctx) => {
    return res(
      ctx.json({
        greeting: 'Hello World',
      })
    );
  }),
  rest.post('/api/urls', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.delay(2000),
      ctx.json({
        longUrl: body.url,
        shortUrl: 'https://sh.rt/go',
      })
    );
  }),
  rest.get('/api/urls/googleId1/total-clicks-by-day', async (req, res, ctx) => {
    return res(ctx.json(totalClicksByDay));
  }),
  rest.get('/api/urls/googleId1', async (req, res, ctx) => {
    return res(ctx.json(url));
  }),
  rest.get(`/api/urls/${invalidId}`, async (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ message: 'Id is invalid' }));
  }),
];
