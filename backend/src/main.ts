import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // hanya terima properti yg ada di DTO
    forbidNonWhitelisted: true, // error kalau ada extra field
    transform: true, // otomatis convert string -> number (id misal)
  }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Menu Tree API')
    .setDescription('Fullstack Test Menu Tree System')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('Swagger docs: http://localhost:3000/api-docs');
}

bootstrap();
