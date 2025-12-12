import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RecordsModule } from '../records/records.module';

@Module({
    imports: [RecordsModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule { }
