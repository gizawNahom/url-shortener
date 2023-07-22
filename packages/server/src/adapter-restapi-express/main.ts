import app from './app';
import { setupMongo } from './setup';

class Main {
  static async start() {
    try {
      await tryStart();
    } catch (error) {
      console.log('Failure to start: ' + error.message);
      throw error;
    }

    async function tryStart() {
      checkRequiredEnvironmentVariables();
      await setupMongo();
      startServer();
    }

    function checkRequiredEnvironmentVariables() {
      if (!process.env.SERVER_DOMAIN)
        throw new Error('SERVER_DOMAIN env variable is required');
      if (!process.env.CLIENT_ORIGIN)
        throw new Error('CLIENT_ORIGIN env variable is required');
    }

    function startServer() {
      const port = process.env.PORT ? Number(process.env.PORT) : 3000;
      app.listen(port, () => {
        console.log(`[ ready ] PORT: ${port}`);
      });
    }
  }
}

Main.start();
