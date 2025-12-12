import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EngineClient } from '@boolbyte/engine';

@Injectable()
export class ByteEngineService {
    private client: EngineClient;
    private logger = new Logger(ByteEngineService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('BYTE_ENGINE_API_KEY');
        if (!apiKey) {
            this.logger.warn('BYTE_ENGINE_API_KEY is not set. ByteEngine features will not work.');
        } else {
            this.client = new EngineClient({ apiKey });
        }
    }

    async createFhirStore(name: string, region: 'global' | 'us' | 'eu' = 'global') {
        if (!this.client) return null;
        try {
            const store = await this.client.dataStore.createFhirStore({
                name,
                region: region as any,
                fhirVersion: 'R4' as any,
                type: 'serverless' as any,
            });
            return store;
        } catch (error) {
            this.logger.error(`Failed to create FHIR store: ${error.message}`);
            throw error;
        }
    }

    async storeFhirResource(storeId: string, resourceType: string, data: any) {
        // Use environment variables directly or passed storeId if relevant
        const baseUrl = this.configService.get<string>('FHIR_BASE_URL');
        const token = this.configService.get<string>('FHIR_ACCESS_TOKEN');
        const envStoreId = this.configService.get<string>('FHIR_STORE_ID');

        // Allow overriding storeId, but default to env
        const targetStoreId = envStoreId || storeId; // Note: storeId passed from service might be different, but in this context 
        // the user's curl example implies a specific URL structure: https://.../fhir/<store-id>/<resource-type>
        // But the FHIR_BASE_URL in env is: "https://0bc15de071df8127-r4-global.fhir.engine.dev.boolbyte.com/fhir"
        // This URL *already contains* the store-id specific domain part "0bc15de071df8127...".
        // And the user provided curl: https://fhir.global.byteengine.health/fhir/my-fhir-dev/Patient
        // Let's assume FHIR_BASE_URL is the root for the FHIR server.

        if (!baseUrl || !token) {
            this.logger.warn('FHIR_BASE_URL or FHIR_ACCESS_TOKEN not set. Skipping ByteEngine storage.');
            return null;
        }

        // Construct URL: <FHIR_BASE_URL>/<ResourceType>
        // If data is a Bundle, we usually POST to the base url (transaction) or just /Bundle?
        // But if it's a specific resource type like 'Bundle', we post to /Bundle.
        const url = `${baseUrl}/${resourceType}`;

        try {
            const axios = require('axios'); // Dynamic require to ensure dependency availability or import at top
            this.logger.log(`Sending ${resourceType} to ${url}`);

            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/fhir+json',
                }
            });

            this.logger.log(`Successfully stored ${resourceType} in ByteEngine. ID: ${response.data.id}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to store FHIR resource: ${error.message} - ${error.response?.data ? JSON.stringify(error.response.data) : ''}`);
            // throw error; // Optional: throw or just log error to allow app to continue
            return null;
        }
    }
}
