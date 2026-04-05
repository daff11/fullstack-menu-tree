import {IsOptional, IsString, IsInt} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
    @ApiProperty({ description: 'Menu name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Parent menu ID, null if root' })
    @IsOptional()
    @IsInt()
    parentId?: number;
}