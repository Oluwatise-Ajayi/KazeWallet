import { Module } from '@nestjs/common';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { ByteEngineService } from './byte-engine.service';

@Module({
    controllers: [UtilitiesController],
    providers: [UtilitiesService, ByteEngineService],
    exports: [ByteEngineService],
})
export class UtilitiesModule { }
