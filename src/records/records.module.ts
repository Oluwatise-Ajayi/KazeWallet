import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { OcrService } from './services/ocr.service';
import { IpfsService } from './services/ipfs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
    imports: [PrismaModule, BlockchainModule],
    controllers: [RecordsController],
    providers: [RecordsService, OcrService, IpfsService],
})
export class RecordsModule { }
