import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BookModule } from './book.module';

async function bootstrap() {
  const app = await NestFactory.create(BookModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
