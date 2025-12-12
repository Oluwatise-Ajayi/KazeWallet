import { Controller, Post, Get, UseGuards, UseInterceptors, UploadedFile, Body, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { RecordsService } from './records.service';
import { UploadRecordDto } from './dto/upload-record.dto';

@ApiTags('Medical Records')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('records')
export class RecordsController {
    constructor(private service: RecordsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a medical record (OCR + IPFS + Blockchain)' })
    upload(
        @Request() req,
        @Body() dto: UploadRecordDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.service.uploadRecord(req.user.userId, dto, file);
    }

    @Get()
    @ApiOperation({ summary: 'Get all my records' })
    getMyRecords(@Request() req) {
        return this.service.getMyRecords(req.user.userId);
    }
}
