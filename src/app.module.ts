import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { ClubModule } from './club/club.module';

@Module({
  imports: [PlayerModule, ClubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
