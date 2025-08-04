import { config } from 'dotenv';
config(); // Load environment variables

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for specific origins
  app.enableCors({
    origin: [
      'https://revobrix-marketplace-web-oqoy.vercel.app',
      'https://www.revobrix.com',
      'https://developer.revobrix.com',
      'https://console.revobrix.com',
      'https://backend-core-production-cbc1.up.railway.app',
      'https://revobricks-backend-core.onrender.com',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Real Estate Developer API')
    .setDescription(
      'API for managing real estate developers, offices, and users',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
