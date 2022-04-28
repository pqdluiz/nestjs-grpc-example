import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { grpcClientOptions } from '../grpc-client.options';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  providers: [HeroService],
  controllers: [HeroController],
})
export class HeroModule {}
