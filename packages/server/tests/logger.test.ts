import pino from 'pino';
import { PinoLogger } from '../src/adapter-logger-pino/pinoLogger';

test('logs error', () => {
  const logger = pino();
  const spy = jest.spyOn(logger, 'error').mockImplementation((msg) => msg);
  const pL = new PinoLogger(logger);
  const error = new Error('Error to be logged');

  pL.logError(error);

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(error);
});
