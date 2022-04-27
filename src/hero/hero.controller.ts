import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { HeroService } from './hero.service';

import { HeroById } from './interfaces/hero-id.interface';
import { Hero } from './interfaces/hero.interface';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  getMany(): Observable<Hero[]> {
    return this.heroService.getMany();
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<Hero> {
    return this.heroService.getById(id);
  }

  @GrpcMethod('HeroService')
  findOne(data: HeroById): Hero {
    return this.heroService.findOne(data);
  }

  @GrpcStreamMethod('HeroService')
  findMany(data: Observable<HeroById>): Observable<Hero> {
    return this.heroService.findMany(data);
  }
}
