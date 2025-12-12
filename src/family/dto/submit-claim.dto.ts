import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class SubmitClaimDto {
    @ApiProperty({ example: 'uuid-of-pool' })
    @IsString()
    @IsNotEmpty()
    poolId: string;

    @ApiProperty({ example: 15000 })
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: 'Malaria Treatment' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ example: '0xHospitalWalletAddress', required: false })
    @IsString()
    @IsOptional()
    hospitalWallet?: string;
}
