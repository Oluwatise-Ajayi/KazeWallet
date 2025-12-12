import { Controller, Get, Param } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Utilities')
@Controller('drugs')
export class UtilitiesController {
    constructor(private service: UtilitiesService) { }

    @Get('verify/:number')
    @ApiOperation({ summary: 'Verify drug by NAFDAC number' })
    verifyDrug(@Param('number') number: string) {
        return this.service.verifyDrug(number);
    }
}
