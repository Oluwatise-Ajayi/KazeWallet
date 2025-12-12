import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'chioma@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePass123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
