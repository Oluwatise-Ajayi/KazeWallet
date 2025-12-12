import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import pinataSDK from '@pinata/sdk'; // If using SDK, else use fetch

@Injectable()
export class IpfsService {
    constructor(private config: ConfigService) { }

    async uploadFile(fileBuffer: Buffer, name: string): Promise<string> {
        // Mock for Hackathon if no keys
        // In production: Use Pinata SDK or generic IPFS node
        console.log(`Uploading ${name} to IPFS (Mock)...`);

        // Simulate latency
        await new Promise(r => setTimeout(r, 500));

        // Return a fake Qm hash
        return 'Qm' + Math.random().toString(36).substring(7) + 'MockHash';
    }

    async uploadMetadata(metadata: any): Promise<string> {
        console.log('Uploading metadata to IPFS...');
        return 'Qm' + Math.random().toString(36).substring(7) + 'MetadataHash';
    }
}
