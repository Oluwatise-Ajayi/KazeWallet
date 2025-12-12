import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

export class FundPoolDto {
    @ApiProperty({ example: 5000 })
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: 'NGN' })
    @IsString()
    currency: string;
}
