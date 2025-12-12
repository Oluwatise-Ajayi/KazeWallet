import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private blockchain: BlockchainService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check existing email
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new BadRequestException('Email already exists');

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Generate Wallet
        const wallet = this.blockchain.createWallet();
        const encryptedKey = this.blockchain.encryptKey(wallet.privateKey);

        // Create User
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hashedPassword,
                fullName: dto.fullName,
                role: dto.role,
                phoneNumber: dto.phoneNumber,
                walletAddress: wallet.address,
                encryptedPKey: encryptedKey,
            },
        });

        const token = this.signToken(user.id, user.email, user.role);

        return {
            id: user.id,
            token,
            walletAddress: user.walletAddress,
            role: user.role,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(dto.password, user.passwordHash);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const token = this.signToken(user.id, user.email, user.role);

        // Remove sensitive data
        const { passwordHash, encryptedPKey, ...userSafe } = user;

        return {
            token,
            user: userSafe,
        };
    }

    private signToken(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }

    async getMe(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found'); // Added null check
        const { passwordHash, encryptedPKey, ...userSafe } = user;
        return userSafe;
    }
}
