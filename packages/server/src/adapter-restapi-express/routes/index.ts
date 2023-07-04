import express from 'express';
import { ShortenUrlsRoute } from './urls/shortenUrlsRoute';
import { RedirectUrlsRoute } from './urls/redirectUrlsRoute';
import { ErrorHandler } from './errorHandler';
import { TotalClicksRoute } from './urls/totalClicksRoute';
import { GetUrlsRoute } from './urls/getUrlsRoute';

const router = express.Router();

const rURhandlers = RedirectUrlsRoute.getHandlers();
router.get('/', rURhandlers);
router.get('/:id', rURhandlers);

router.post('/api/urls', ShortenUrlsRoute.getHandlers());

router.get('/api/urls/:id/total-clicks-by-day', TotalClicksRoute.getHandlers());

const gURHandlers = GetUrlsRoute.getHandlers();
router.get('/api/urls/', gURHandlers);
router.get('/api/urls/:id', gURHandlers);

router.use(ErrorHandler.getHandlers());

export default router;
