// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

     // Activer CORS
  app.enableCors({
    origin: 'http://localhost:'+process.env.FRONT_CORS_PORT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


    await app.listen(3007);
    console.log('Application démarrée sur http://localhost:3007');
}
bootstrap();
