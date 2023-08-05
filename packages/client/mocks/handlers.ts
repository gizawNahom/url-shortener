import { rest } from 'msw';
import {
  idWith0Clicks,
  invalidId,
  shortenedUrl,
  topDeviceTypes,
  totalClicksByDay,
  url,
  urlWith0Clicks,
  validId,
} from './values';
import {
  getClickCountPath,
  getTopDeviceTypesPath,
  getUrlsBasePath,
  getUrlsPath,
} from '__tests__/testUtils';

export const handlers = [
  rest.get('/api', (_req, res, ctx) => {
    return res(
      ctx.json({
        greeting: 'Hello World',
      })
    );
  }),
  rest.post(getUrlsBasePath(), async (req, res, ctx) => {
    return res(ctx.delay(2000), ctx.json(shortenedUrl));
  }),
  rest.get(getClickCountPath(validId), async (req, res, ctx) => {
    return res(ctx.json(totalClicksByDay));
  }),
  rest.get(getUrlsPath(validId), async (req, res, ctx) => {
    return res(ctx.json(url));
  }),
  rest.get(getUrlsPath(idWith0Clicks), async (req, res, ctx) => {
    return res(ctx.json(urlWith0Clicks));
  }),
  rest.get(getUrlsPath(invalidId), async (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ message: 'Id is invalid' }));
  }),
  rest.get(getTopDeviceTypesPath(validId), async (req, res, ctx) => {
    return res(ctx.json({ devices: topDeviceTypes }));
  }),
];
