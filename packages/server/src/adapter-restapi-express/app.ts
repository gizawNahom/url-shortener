import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import Routes from './routes';

const app = express();

const logger = pinoHttp();
app.use(logger);

const corsOptions: cors.CorsOptions = {
  origin: process.env.CLIENT_ORIGIN,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send({ greeting: 'Hello API' });
});
app.use(Routes);

export default app;
