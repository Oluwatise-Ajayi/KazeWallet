import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('qr')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get a QR code (Data URI) containing my health records' })
    async getMyQrCode(@Request() req) {
        // Determine base URL (protocol + host)
        const protocol = req.protocol;
        const host = req.get('host');
        const origin = `${protocol}://${host}`;

        const qrCodeDataUrl = await this.usersService.generateRecordsQrUrl(req.user.userId, origin);
        return { qrCode: qrCodeDataUrl };
    }

    @Get('share/:userId')
    @ApiOperation({ summary: 'Public view of health records (for scanning)' })
    async getSharedRecords(@Request() req, @Param('userId') userId: string) {
        // This endpoint returns HTML
        return this.usersService.generateRecordsHtml(userId);
    }
}
