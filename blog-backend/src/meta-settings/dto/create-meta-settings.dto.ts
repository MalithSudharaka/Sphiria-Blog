import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMetaSettingsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  metaKeyword: string;

  @IsNotEmpty()
  @IsString()
  metaDescription: string;

  @IsNotEmpty()
  @IsString()
  googleAnalyticsId: string;

  @IsOptional()
  @IsString()
  defaultImage?: string;
}
