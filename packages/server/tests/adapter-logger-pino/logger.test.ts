import pino from 'pino';
import { PinoLogger } from '../../src/adapter-logger-pino/pinoLogger';

function createLoggerWithASpyOnMethod(methodName: string) {
  const p = createPino();
  const logger = createLogger(p);
  const spy = createSpy(p, methodName);
  return { logger, spy };

  function createPino() {
    return pino();
  }

  function createLogger(p) {
    return new PinoLogger(p);
  }

  function createSpy(p, methodName: string) {
    return jest.spyOn(p, methodName).mockImplementation((msg) => msg);
  }
}

test('logs error', () => {
  const { logger, spy } = createLoggerWithASpyOnMethod('error');
  const error = new Error('Error to be logged');

  logger.logError(error);

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(error);
});

test('logs info', () => {
  const { logger, spy } = createLoggerWithASpyOnMethod('info');
  const message = 'Event happened';

  logger.logInfo(message);

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(message);
});
