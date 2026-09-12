import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('wasel api')
    .setDescription("The wasel what's app API CRM")
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      ignoreGlobalPrefix: true,
    });

  app.enableCors();
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new ZodExceptionFilter());
  app.setGlobalPrefix('api');

  SwaggerModule.setup('api/doc', app, documentFactory);

  await app.listen(3000);
}

void bootstrap();
