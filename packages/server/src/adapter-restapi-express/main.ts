import app from './app';

if (!process.env.SERVER_DOMAIN)
  throw new Error('SERVER_DOMAIN env variable is required');

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`[ ready ] PORT: ${port}`);
});
