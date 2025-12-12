import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const pdfParse = require('pdf-parse'); // Use require for pdf-parse types compatibility
import * as mammoth from 'mammoth';
import * as Tesseract from 'tesseract.js';
import OpenAI from 'openai';

@Injectable()
export class DocumentAnalysisService {
    private openai: OpenAI;
    private logger = new Logger(DocumentAnalysisService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new OpenAI({
                apiKey,
                baseURL: 'https://openrouter.ai/api/v1',
            });
        } else {
            this.logger.warn('OPENAI_API_KEY not set.');
        }
    }

    async extractText(fileBuffer: Buffer, mimeType: string): Promise<string> {
        if (mimeType === 'application/pdf') {
            const data = await pdfParse(fileBuffer);
            return data.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            return result.value;
        } else if (mimeType.startsWith('image/')) {
            const result = await Tesseract.recognize(fileBuffer, 'eng');
            return result.data.text;
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }
    }

    async analyzeAndConvertToFhir(text: string): Promise<any> {
        if (!this.openai) {
            return { error: 'AI Service unable' };
        }

        const prompt = `
      You are a specialized medical AI assistant. Your task is to extract key clinical information from the provided text and convert it into a valid FHIR R4 Bundle.
      
      CRITICAL INSTRUCTIONS:
      1. Output MUST be strictly valid JSON.
      2. Do NOT include greetings, detailed explanations, or markdown formatting (like \`\`\`json).
      3. If the text does not contain medical information, return an empty FHIR Bundle.
      4. Ensure the JSON structure matches the FHIR R4 specification.

      Text to analyze:
      ${text.substring(0, 3000)}
    `;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'system', content: 'You are a backend API that outputs only JSON.' }, { role: 'user', content: prompt }],
                model: 'gpt-4o',
                max_tokens: 1000,
                response_format: { type: 'json_object' },
            });

            const content = completion.choices[0].message.content || '{}';
            console.log('AI Response:', content); // Debug logging

            const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
            if (!cleaned) return null;
            return JSON.parse(cleaned);
        } catch (error) {
            this.logger.error('Failed to analyze text with AI', error);
            // Don't throw, return null to allow partial success (upload without full analysis)
            return null;
        }
    }
}
