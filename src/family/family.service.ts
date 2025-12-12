import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { FundPoolDto } from './dto/fund-pool.dto';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { VoteClaimDto } from './dto/vote-claim.dto';

@Injectable()
export class FamilyService {
    constructor(
        private prisma: PrismaService,
        private blockchain: BlockchainService,
    ) { }

    async createPool(userId: string, dto: CreatePoolDto) {
        // 1. Deploy Contract (Mock)
        const mockContractAddress = '0xPool' + Math.random().toString(36).substring(7);

        // 2. Create in DB
        const pool = await this.prisma.familyPool.create({
            data: {
                name: dto.name,
                contractAddress: mockContractAddress,
                totalBalance: 0,
                members: {
                    connect: { id: userId },
                },
            },
        });

        // 3. Update User's Family Pool
        await this.prisma.user.update({
            where: { id: userId },
            data: { familyPoolId: pool.id },
        });

        return pool;
    }

    async fundPool(userId: string, poolId: string, dto: FundPoolDto) {
        // 1. Verify Pool
        const pool = await this.prisma.familyPool.findUnique({ where: { id: poolId } });
        if (!pool) throw new NotFoundException('Pool not found');

        // 2. Simulate Payment Gateway (Paystack/Stripe)
        // In real app, verify transaction reference here.

        // 3. Update Balance
        const updatedPool = await this.prisma.familyPool.update({
            where: { id: poolId },
            data: {
                totalBalance: { increment: dto.amount },
            },
        });

        return {
            status: 'SUCCESS',
            newBalance: updatedPool.totalBalance,
            message: 'Pool funded successfully'
        };
    }

    async submitClaim(userId: string, dto: SubmitClaimDto) {
        // 1. Verify Pool Membership
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        if (user.familyPoolId !== dto.poolId) {
            throw new BadRequestException('User does not belong to this pool');
        }

        // 2. Create Claim
        const claim = await this.prisma.claim.create({
            data: {
                poolId: dto.poolId,
                userId: userId,
                amount: dto.amount,
                reason: dto.reason,
                status: 'PENDING',
            },
        });

        // 3. Log to Blockchain (Mock)
        console.log(`Claim Proposal ${claim.id} submitted to DAO contract`);

        return claim;
    }

    async voteOnClaim(userId: string, claimId: string, dto: VoteClaimDto) {
        // 1. Get Claim
        const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
        if (!claim) throw new NotFoundException('Claim not found');

        if (claim.status !== 'PENDING') {
            throw new BadRequestException('Claim is already finalized');
        }

        // 2. Record Vote (In DB for hackathon simplicity, logic would be on-chain in production)
        // We are not tracking *who* voted to keep schema simple, just the count.

        const updateData = dto.decision
            ? { votesFor: { increment: 1 } }
            : { votesAgainst: { increment: 1 } };

        await this.prisma.claim.update({
            where: { id: claimId },
            data: updateData,
        });

        // 3. Check for Consensus (Mock Logic: If votes > 2, approve)
        // In real app, check total members vs votes
        if (claim.votesFor + (dto.decision ? 1 : 0) > 2) { // Mock threshold
            await this.approveClaim(claimId);
            return { status: 'APPROVED', message: 'Vote recorded and claim approved' };
        }

        return { status: 'VOTED', message: 'Vote recorded' };
    }

    private async approveClaim(claimId: string) {
        const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
        if (!claim) throw new NotFoundException('Claim not found'); // Added null check

        // Debit Pool
        await this.prisma.familyPool.update({
            where: { id: claim.poolId },
            data: { totalBalance: { decrement: claim.amount } }
        });

        // Update Claim Status
        await this.prisma.claim.update({
            where: { id: claimId },
            data: {
                status: 'PAID',
                txHash: '0xPayout' + Math.random().toString(36).substring(7)
            }
        });
    }

    async getPoolClaims(poolId: string) {
        return this.prisma.claim.findMany({
            where: { poolId },
            include: { user: { select: { fullName: true } } }
        });
    }

    async getMyFamily(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { familyPool: { include: { members: true } } }
        });
        if (!user) throw new NotFoundException('User not found');
        return user.familyPool;
    }
}
