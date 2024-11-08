// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3007);
    console.log('Application démarrée sur http://localhost:3007');
}
bootstrap();
