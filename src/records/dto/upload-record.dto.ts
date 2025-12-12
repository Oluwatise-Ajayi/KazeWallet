import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum RecordType {
    PRESCRIPTION = 'PRESCRIPTION',
    LAB_RESULT = 'LAB_RESULT',
    VACCINE = 'VACCINE',
}

export class UploadRecordDto {
    @ApiProperty({ example: 'Malaria Treatment', description: 'Title of the medical record' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ enum: RecordType, example: 'PRESCRIPTION' })
    @IsEnum(RecordType)
    type: RecordType;

    @ApiProperty({ example: 'General Hospital, Lagos', required: false })
    @IsString()
    @IsOptional()
    hospitalName?: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
