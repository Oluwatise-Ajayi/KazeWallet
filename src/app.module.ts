import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';
import { FamilyModule } from './family/family.module';
import { UtilitiesModule } from './utilities/utilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BlockchainModule,
    AuthModule,
    RecordsModule,
    FamilyModule,
    UtilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
