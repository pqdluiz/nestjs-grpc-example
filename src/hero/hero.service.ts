import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject, toArray } from 'rxjs';

import { HeroById } from './interfaces/hero-id.interface';
import { Hero } from './interfaces/hero.interface';

interface HeroServiceInterface {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

@Injectable()
export class HeroService implements OnModuleInit {
  private readonly items: Hero[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private heroService: HeroServiceInterface;

  constructor(@Inject('HERO_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit(): HeroServiceInterface {
    return this.heroService = this.client.getService<HeroServiceInterface>('HeroService');
  }

  getMany(): Observable<Hero[]> {
    const ids$ = new ReplaySubject<HeroById>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();

    const stream = this.heroService.findMany(ids$.asObservable());
    return stream.pipe(toArray());
  }

  getById(id: string): Observable<Hero> {
    return this.heroService.findOne({ id: +id });
  }

  findOne(data: HeroById): Hero {
    return this.items.find(({ id }) => id === data.id);
  }

  @GrpcStreamMethod('HeroService')
  findMany(data$: Observable<HeroById>): Observable<Hero> {
    const hero$ = new Subject<Hero>();

    const onNext = (heroById: HeroById): void => {
      const item = this.items.find(({ id }) => id === heroById.id);
      return hero$.next(item);
    };

    const onComplete = (): void => hero$.complete();

    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }
}
