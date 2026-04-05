import {PartialType} from '@nestjs/mapped-types';
import {CreateMenuDto} from './create-menu.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}