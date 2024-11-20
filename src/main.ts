import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:15002',
      'http://localhost:15003',
      'http://localhost:15004',
      'http://localhost:3007',
      'http://localhost:5173',
      'https://betforfun.devforever.ovh',
      'https://server.pronostics.devforever.ovh',
      'https://backend-pronostics.devforever.ovh',
      'https://lighthearted-entremet-760983.netlify.app',
      'https://www.betforfun.devforever.ovh'
    ],

    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Origin', 'X-Custom-Referer','Access-Control-Allow-Origin'],
    credentials: true,
  });

  app.use('/api', (req, res, next) => {
    req.headers['origin'] = 'http://localhost:15002';
    req.headers['referer'] = 'http://localhost:15002/';
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });


  await app.listen(15004);
}

bootstrap();
