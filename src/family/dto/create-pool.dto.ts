import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreatePoolDto {
    @ApiProperty({ example: 'Okafor Family Fund' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 5000, description: 'Monthly contribution amount' })
    @IsNumber()
    @Min(0)
    monthlyContribution: number;
}
