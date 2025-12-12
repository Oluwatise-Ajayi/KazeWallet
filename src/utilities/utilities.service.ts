import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
    // Mock NAFDAC Database
    private drugRegistry = {
        '04-1234': { name: 'Amoxil', manufacturer: 'Emzor', status: 'VERIFIED' },
        '04-5678': { name: 'Coartem', manufacturer: 'Novartis', status: 'VERIFIED' },
        '04-9999': { name: 'FakeMeds', manufacturer: 'Unknown', status: 'COUNTERFEIT' },
    };

    verifyDrug(nafdacNumber: string) {
        const drug = this.drugRegistry[nafdacNumber];
        if (!drug) {
            throw new NotFoundException('Drug not found in NAFDAC registry');
        }
        return drug;
    }
}
