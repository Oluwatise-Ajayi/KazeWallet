import { Injectable } from '@nestjs/common';
import { RecordsService } from '../records/records.service';
import * as QRCode from 'qrcode';

@Injectable()
export class UsersService {
    constructor(private recordsService: RecordsService) { }

    async generateRecordsQrUrl(userId: string, origin: string): Promise<string> {
        const url = `${origin}/users/share/${userId}`;
        return QRCode.toDataURL(url);
    }

    async generateRecordsHtml(userId: string): Promise<string> {
        const records = await this.recordsService.getMyRecords(userId);

        const rows = records.map(r => `
      <tr>
        <td>${r.createdAt.toISOString().split('T')[0]}</td>
        <td>${r.hospitalName || 'N/A'}</td>
        <td>${r.title}</td>
        <td><a href="${r.fileUrl}" target="_blank">View File</a></td>
      </tr>
    `).join('');

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shared Health Records</title>
        <style>
          body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Health Records</h1>
        <p>Patient ID: ${userId}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Hospital</th>
              <th>Title</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length > 0 ? rows : '<tr><td colspan="4">No records found.</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `;
    }
}
