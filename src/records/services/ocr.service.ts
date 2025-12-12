import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
    async extractText(imageBuffer: Buffer): Promise<string> {
        try {
            // Tesseract.recognize accepts a buffer directly
            const result = await Tesseract.recognize(
                imageBuffer,
                'eng',
            );
            return result.data.text;
        } catch (error) {
            console.error('OCR Error:', error);
            return 'Error extracting text';
        }
    }
}
