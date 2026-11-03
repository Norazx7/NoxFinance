import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    // "*" com credentials quebra o preflight no browser; refletir a origin.
    origin:
      !corsOrigin || corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((v) => v.trim()),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('NOX FINANCE API')
    .setDescription(
      'API REST do NOX FINANCE — gestão financeira pessoal com NOX AI. Valores monetários em centavos.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3847);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`NOX FINANCE API on http://0.0.0.0:${port}/api`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs on http://0.0.0.0:${port}/api/docs`);
}

void bootstrap();
