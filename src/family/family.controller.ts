import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { FundPoolDto } from './dto/fund-pool.dto';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { VoteClaimDto } from './dto/vote-claim.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Family Fund DAO')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('family')
export class FamilyController {
    constructor(private service: FamilyService) { }

    @Post('create')
    @ApiOperation({ summary: 'Create a new Family Pool (DAO)' })
    createPool(@Request() req, @Body() dto: CreatePoolDto) {
        return this.service.createPool(req.user.userId, dto);
    }

    @Get('my-pool')
    @ApiOperation({ summary: 'Get my family pool details' })
    getMyPool(@Request() req) {
        return this.service.getMyFamily(req.user.userId);
    }

    @Post('fund/:poolId')
    @ApiOperation({ summary: 'Fund the pool (Simulated Fiat-to-Crypto)' })
    fundPool(@Request() req, @Param('poolId') poolId: string, @Body() dto: FundPoolDto) {
        return this.service.fundPool(req.user.userId, poolId, dto);
    }

    @Post('claims')
    @ApiOperation({ summary: 'Submit a claim proposal' })
    submitClaim(@Request() req, @Body() dto: SubmitClaimDto) {
        return this.service.submitClaim(req.user.userId, dto);
    }

    @Get('claims/:poolId')
    @ApiOperation({ summary: 'Get claims for a pool' })
    getClaims(@Param('poolId') poolId: string) {
        return this.service.getPoolClaims(poolId);
    }

    @Post('claims/:id/vote')
    @ApiOperation({ summary: 'Vote on a claim' })
    voteOnClaim(@Request() req, @Param('id') id: string, @Body() dto: VoteClaimDto) {
        return this.service.voteOnClaim(req.user.userId, id, dto);
    }
}
