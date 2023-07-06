import { rest } from 'msw';
import {
  invalidId,
  shortenedUrl,
  totalClicksByDay,
  url,
  validId,
} from './values';

export const handlers = [
  rest.get('/api', (_req, res, ctx) => {
    return res(
      ctx.json({
        greeting: 'Hello World',
      })
    );
  }),
  rest.post('/api/urls', async (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.json(shortenedUrl));
  }),
  rest.get(
    `/api/urls/${validId}/total-clicks-by-day`,
    async (req, res, ctx) => {
      return res(ctx.json(totalClicksByDay));
    }
  ),
  rest.get(`/api/urls/${validId}`, async (req, res, ctx) => {
    return res(ctx.json(url));
  }),
  rest.get(`/api/urls/${invalidId}`, async (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ message: 'Id is invalid' }));
  }),
];
