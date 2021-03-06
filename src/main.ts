import { NestFactory } from '@nestjs/core';
import 'dotenv/config'
import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'test') {
  process.env.MONGO_URI = process.env.MONGO_URI_TEST;
  console.log('----------TESTING IN PROCESS----------');
  console.log('using database', process.env.MONGO_URI);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  await app.listen(process.env.PORT);
}
bootstrap();
