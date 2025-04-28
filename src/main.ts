import { NestFactory, repl } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ENV } from './config/env';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseEntity } from './common/entities/response.entity';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('App example')
    .setDescription('The app API description')
    .addTag('app')
    .addSecurity('JWT', { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      exceptionFactory(errors) {
        throw new HttpException(
          new ResponseEntity({
            errors: errors.map((err) => {
              return {
                field: err.property,
                message: Object.values(err.constraints || {}),
              };
            }),
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Unprocessable Entity',
          }),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, document);
  }

  if (!ENV.APP_PORT) {
    Logger.warn(
      'To enable http server, set APP_PORT=3000 in .env file',
      'Application',
    );
  }
  if (!ENV.RMQ_URL) {
    Logger.warn(
      'To enable microservice server, set RMQ_URL=amqp://localhost:5672 in .env file',
      'Application',
    );
  }

  if (ENV.APP_PORT) {
    await app.listen(ENV.APP_PORT);
    Logger.log(`Application is running on: ${await app.getUrl()}`);
  }

  if (ENV.RMQ_URL) {
    const ms = await NestFactory.createMicroservice<MicroserviceOptions>(
      MainModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [ENV.RMQ_URL],
          queue: ENV.APP_NAME,
          queueOptions: {
            durable: false,
          },
        },
      },
    );
    await ms.listen();
    Logger.log(`Microservice is running on channel: ${ENV.APP_NAME}`);
  }

  if (ENV.REPL) {
    await repl(MainModule);
  }
}

bootstrap();
