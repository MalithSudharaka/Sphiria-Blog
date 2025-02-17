import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload size
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS
  app.enableCors();

  // Global validation
  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}
bootstrap();
