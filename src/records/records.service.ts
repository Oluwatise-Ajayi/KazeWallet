import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { OcrService } from './services/ocr.service';
import { IpfsService } from './services/ipfs.service';
import { UploadRecordDto } from './dto/upload-record.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecordsService {
    constructor(
        private prisma: PrismaService,
        private blockchain: BlockchainService,
        private ocr: OcrService,
        private ipfs: IpfsService,
        private config: ConfigService,
    ) { }

    async uploadRecord(userId: string, dto: UploadRecordDto, file: Express.Multer.File) {
        // 1. OCR
        const ocrText = await this.ocr.extractText(file.buffer);

        // 2. AI Summary (Mocking OpenAI for simplicity/resilience if key missing)
        const aiSummary = `Summary of ${dto.title}: ${ocrText.substring(0, 50)}...`;

        // 3. Upload File to IPFS
        const fileHash = await this.ipfs.uploadFile(file.buffer, file.originalname);

        // 4. Upload Metadata to IPFS
        const metadata = {
            title: dto.title,
            type: dto.type,
            hospital: dto.hospitalName,
            summary: aiSummary,
            fileHash,
            timestamp: new Date().toISOString()
        };
        const metadataHash = await this.ipfs.uploadMetadata(metadata);

        // 5. Blockchain Write
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.encryptedPKey) {
            throw new Error('User wallet not found');
        }

        // In a real app, we would decrypt user key and sign. 
        // Here we simulate the blockchain transaction or use the system wallet to 'record' it.
        // For Hackathon, let's assume we just log it or call a contract if we had one.
        // We'll mock the txHash.
        console.log(`Writing to blockchain: User ${user.walletAddress} adds record ${metadataHash}`);
        const txHash = '0x' + Math.random().toString(36).substring(7) + 'TransactionHash';

        // 6. Database Save
        const record = await this.prisma.medicalRecord.create({
            data: {
                userId,
                type: dto.type,
                title: dto.title,
                summary: aiSummary,
                ipfsHash: metadataHash,
                txHash,
                hospitalName: dto.hospitalName,
                fileUrl: `https://gateway.pinata.cloud/ipfs/${fileHash}`, // Gateway URL
            },
        });

        return record;
    }

    async getMyRecords(userId: string) {
        return this.prisma.medicalRecord.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
