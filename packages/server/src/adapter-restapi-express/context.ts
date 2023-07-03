import { FakeUrlStorage } from '../adapter-persistence-fake/fakeUrlStorage';
import { UrlIdGenerator } from '../core/ports/urlIdGenerator';
import { NanoIdGenerator } from '../core/nanoIdGenerator';
import { UrlStorage } from '../core/ports/urlStorage';

export default class Context {
  static urlStorage: UrlStorage = new FakeUrlStorage();
  static urlIdGenerator: UrlIdGenerator = new NanoIdGenerator();
}
