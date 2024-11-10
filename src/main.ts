// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);


    
     // Activer CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


    await app.listen(parseInt(process.env.BACKEND_PORT || '15004', 10));
    console.log('Application démarrée sur http://localhost:3007');
}
bootstrap();
