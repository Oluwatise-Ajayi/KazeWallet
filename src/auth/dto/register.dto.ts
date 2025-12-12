import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'chioma@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePass123' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Chioma A' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'PATIENT', description: 'PATIENT, DOCTOR, HOSPITAL, or ADMIN' })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({ example: '08012345678', required: false })
    @IsString()
    @IsOptional()
    phoneNumber?: string;
}
