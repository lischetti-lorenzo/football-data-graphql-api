import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { League } from '../../models/league.model';
import { LeagueService } from './league.service';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => League)
export class LeagueResolver {
  private readonly leagueImportedEvent = 'leagueImported';

  constructor (
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly leagueService: LeagueService
  ) {}

  @Mutation(() => Boolean)
  async importLeague (
    @Args('leagueCode') leagueCode: string
  ): Promise<boolean> {
    // We don't wait for the promise to finish and return the control
    // as soon as possible to avoid blocking the execution on the client side.
    // Then, we notify that the league was imported succesfully or the error
    // using the subscription
    this.leagueService.importLeague(leagueCode)
      .then(importedLeague => {
        this.pubSub.publish(this.leagueImportedEvent, { importedLeague });
      })
      .catch(error => {
        this.pubSub.publish(this.leagueImportedEvent, { importedLeague: error });
      });
    return true;
  }

  @Subscription(() => League)
  async importedLeague (): Promise<AsyncIterator<League>> {
    return this.pubSub.asyncIterator(this.leagueImportedEvent);
  }
}
