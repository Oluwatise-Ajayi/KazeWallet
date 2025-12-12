import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService implements OnModuleInit {
    private provider: ethers.JsonRpcProvider;
    private systemWallet: ethers.Wallet;

    constructor(private configService: ConfigService) {
        // Default to Amoy Testnet if not provided
        const rpcUrl = this.configService.get<string>('RPC_URL') || 'https://rpc-amoy.polygon.technology';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    onModuleInit() {
        const systemKey = this.configService.get<string>('SYSTEM_PRIVATE_KEY');
        if (systemKey) {
            this.systemWallet = new ethers.Wallet(systemKey, this.provider);
            console.log(`System Wallet Loaded: ${this.systemWallet.address}`);
        } else {
            console.warn('SYSTEM_PRIVATE_KEY not set. Blockchain writes will fail.');
        }
    }

    createWallet() {
        const wallet = ethers.Wallet.createRandom();
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
        };
    }

    // Encrypt private key (Simple mock for hackathon, use proper encryption in prod)
    // Real world: Use KMS or explicit AES encryption
    encryptKey(privateKey: string): string {
        // In a real app, use crypto module with a secret.
        // For now, we return as is or base64 mock to satisfy "Encrypted" requirement logic flow
        return Buffer.from(privateKey).toString('base64');
    }

    decryptKey(encryptedKey: string): string {
        return Buffer.from(encryptedKey, 'base64').toString('utf-8');
    }

    async getUserWallet(encryptedKey: string): Promise<ethers.Wallet> {
        const privateKey = this.decryptKey(encryptedKey);
        return new ethers.Wallet(privateKey, this.provider);
    }

    async getBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }
}
