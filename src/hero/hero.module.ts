import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';

@Module({
  providers: [HeroService]
})
export class HeroModule {}
