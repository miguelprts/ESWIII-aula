import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './database/mongoose';

dotenv.config({ path: '.env.dev', quiet: true });
dotenv.config({ quiet: true });

const PORT: number = Number(process.env.PORT) || 3001;

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Erro ao iniciar a aplicacao', error);
  process.exit(1);
});
