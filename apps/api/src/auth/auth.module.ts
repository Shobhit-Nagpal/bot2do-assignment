import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { DbModule } from 'src/db/db.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DbModule, MailModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
