import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { grpcClientOptions } from 'src/grpc-client.options';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);

  const config = new DocumentBuilder()
    .setTitle('HEROES API')
    .setDescription('The heroes API description')
    .setVersion('1.0')
    .addTag('heroes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
