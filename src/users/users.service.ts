import { Injectable } from '@nestjs/common';
import { RecordsService } from '../records/records.service';
import * as QRCode from 'qrcode';

@Injectable()
export class UsersService {
    constructor(private recordsService: RecordsService) { }

    async generateRecordsQrCode(userId: string): Promise<string> {
        const records = await this.recordsService.getMyRecords(userId);

        // Minimize payload to fit in QR code
        const condensed = records.map((r) => ({
            t: r.title,
            h: r.hospitalName,
            d: r.updatedAt.toISOString().split('T')[0], // YYYY-MM-DD
            u: r.fileUrl,
        }));

        const jsonPayload = JSON.stringify(condensed);

        // Check if payload is too large for standard QR (approx 2953 bytes for version 40 L)
        // Realistically, we want it smaller for scanability (Version 10-20).
        const isTooLarge = Buffer.byteLength(jsonPayload) > 2500;

        if (isTooLarge) {
            // Fallback: In a real app, upload this JSON to IPFS/S3 and encode the URL.
            // For now, we'll try to slice or return a warning/URL to profile.
            // Or simpler: just encode the profile URL where they can view records.
            // But user requested records in QR.
            // Strategies:
            // 1. Just latest 5 records.
            // 2. Error.

            // Let's try slicing to latest 5
            const partial = condensed.slice(0, 5);
            return QRCode.toDataURL(JSON.stringify({
                note: 'Latest 5 records only (Total too large)',
                data: partial
            }));
        }

        return QRCode.toDataURL(jsonPayload);
    }
}
