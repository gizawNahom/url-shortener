import { FakeUrlStorage } from '../adapter-persistence-fake/fakeUrlStorage';
import { UrlIdGenerator } from '../core/ports/urlIdGenerator';
import { NanoIdGenerator } from '../core/nanoIdGenerator';
import { UrlStorage } from '../core/ports/urlStorage';
import { Logger } from '../core/ports/logger';
import { PinoLogger } from '../adapter-logger-pino/pinoLogger';
import { pino } from 'pino';

export default class Context {
  static urlStorage: UrlStorage = new FakeUrlStorage();
  static urlIdGenerator: UrlIdGenerator = new NanoIdGenerator();
  static logger: Logger = new PinoLogger(pino());
}
