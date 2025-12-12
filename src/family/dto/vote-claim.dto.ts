import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VoteClaimDto {
    @ApiProperty({ example: true, description: 'True to approve, False to reject' })
    @IsBoolean()
    @IsNotEmpty()
    decision: boolean;
}
