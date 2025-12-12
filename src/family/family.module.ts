import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
    imports: [PrismaModule, BlockchainModule],
    controllers: [FamilyController],
    providers: [FamilyService],
})
export class FamilyModule { }
