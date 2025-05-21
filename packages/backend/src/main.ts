import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  
  // Préfixe des routes API
  app.setGlobalPrefix(process.env.API_PREFIX || '/api');
  
  // Filtre d'exception global
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  
  // Documentation API avec Swagger
  const config = new DocumentBuilder()
    .setTitle('DTAHC API')
    .setDescription('API pour la gestion des dossiers d\'autorisations de travaux')
    .setVersion('1.0')
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('clients', 'Gestion des clients')
    .addTag('dossiers', 'Gestion des dossiers')
    .addTag('workflow', 'Workflow des dossiers')
    .addTag('documents', 'Gestion documentaire')
    .addTag('accounting', 'Gestion comptable')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.API_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application API running on: http://localhost:${port}`);
}

bootstrap();