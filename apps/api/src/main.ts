import { NestFactory } from '@nestjs/core';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Wasel API')
    .setDescription('The Wasel WhatsApp CRM API')
    .setVersion('1.0')
    .addTag('app', 'Application health')
    .addTag('auth', 'Registration and login')
    .addTag('users', 'User management')
    .addCookieAuth('access_token') // just for doc
    .build();

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('WEB_ORIGIN', 'http://localhost:3001'),
    credentials: true,
  });
  app.useGlobalFilters(new ZodExceptionFilter());
  app.setGlobalPrefix('api');

  const document = cleanupOpenApiDoc(
    SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: true,
    }),
  );
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(3000);
}

void bootstrap();
