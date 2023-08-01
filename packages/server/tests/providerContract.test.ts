import { Verifier } from '@pact-foundation/pact';
import app from '../src/adapter-restapi-express/app';
import path from 'path';
import Context from '../src/adapter-restapi-express/context';
import { Url } from '../src/core/domain/url';
import { FakeUrlStorage } from '../src/adapter-persistence-fake/fakeUrlStorage';
import { saveClick } from './utilities';

const port = 8081;
const baseUrl = `http://localhost:${port}`;

const server = app.listen(port, () => {
  console.log(`Service listening on ${baseUrl}`);
});

describe('Pact verification', () => {
  test('validate the expectations of the matching consumer', () => {
    return new Verifier({
      providerBaseUrl: baseUrl,
      pactUrls: [
        path.resolve(
          process.cwd(),
          './pacts/urlShortener-client-urlShortener-server.json'
        ),
      ],
      stateHandlers: {
        'a url is saved and clicked once': async () => {
          const url = new Url('https://google.com', 'googleId1', 0);
          await Context.urlStorage.save(url);
          await saveClick({ id: url.getShortenedId() });
        },
      },
      beforeEach: async () => {
        Context.urlStorage = new FakeUrlStorage();
      },
    })
      .verifyProvider()
      .then(() => {
        console.log('Pact Verification Complete!');
      });
  }, 10000);

  afterAll(() => {
    server.close();
  });
});
