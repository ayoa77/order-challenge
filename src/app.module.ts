import { Module, HttpException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './utils/helpers/logging-interceptor.helper';
import { HttpExceptionFilter } from './utils/helpers/http-exception-filter.helper';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), OrderModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: HttpException, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
