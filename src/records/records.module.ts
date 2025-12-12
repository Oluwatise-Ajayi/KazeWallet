import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { OcrService } from './services/ocr.service';
import { IpfsService } from './services/ipfs.service';
import { DocumentAnalysisService } from './services/document-analysis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { UtilitiesModule } from '../utilities/utilities.module';

@Module({
    imports: [PrismaModule, BlockchainModule, UtilitiesModule],
    controllers: [RecordsController],
    exports: [RecordsService],
    providers: [RecordsService, OcrService, IpfsService, DocumentAnalysisService],
})
export class RecordsModule { }
