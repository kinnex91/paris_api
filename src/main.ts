import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  // Configurer CORS pour autoriser uniquement les domaines spécifiés
  app.enableCors({
    origin: [
      'http://localhost:15002',
      'http://localhost:15003',
      'http://localhost:15004',
      'http://localhost:3007',
      'https://concours-pronostics.devforever.ovh',
      'https://server.pronostics.devforever.ovh',
      'https://backend-pronostics.devforever.ovh'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization','Access-Control-Allow-Origin' ],
    credentials: true, // pour les cookies et les en-têtes d'autorisation
  });

  //await app.listen(3007);
  await app.listen(15004);
}
bootstrap();
