import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment = Environment.Development;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    BYTE_ENGINE_API_KEY: string;

    @IsString()
    OPENAI_API_KEY: string;

    @IsString()
    PAYSTACK_SECRET_KEY: string;

    @IsString()
    @IsUrl()
    PAYSTACK_URL: string;

    @IsString()
    @IsUrl()
    FHIR_BASE_URL: string;

    @IsString()
    FHIR_ACCESS_TOKEN: string;

    @IsString()
    BYTE_ENGINE_BASE_URL: string;

    @IsString()
    FHIR_STORE_ID: string;

    @IsNumber()
    PORT: number = 3000;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
