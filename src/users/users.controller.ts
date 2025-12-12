import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('qr')
    @ApiOperation({ summary: 'Get a QR code (Data URI) containing my health records' })
    async getMyQrCode(@Request() req) {
        const qrCodeDataUrl = await this.usersService.generateRecordsQrCode(req.user.userId);
        return { qrCode: qrCodeDataUrl };
    }
}
