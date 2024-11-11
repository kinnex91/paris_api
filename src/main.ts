import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });


  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  // Configurer CORS
  app.enableCors({
    origin: ['http://localhost:15003', 'http://localhost:15004','http://localhost:3007','http://localhost:15004/'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(3007);
}
bootstrap();