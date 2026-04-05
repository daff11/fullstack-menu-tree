import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({ data: createMenuDto });
  }

  async findAll() {
    const menus = await this.prisma.menu.findMany();
    return this.buildTree(menus);
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException(`Menu id ${id} not found`);
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id); // check exist
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // check exist
    return this.prisma.menu.delete({ where: { id } });
  }

  // recursive tree builder
  private buildTree(menus: any[], parentId: number | null = null) {
    return menus
      .filter(menu => menu.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map(menu => ({
        ...menu,
        children: this.buildTree(menus, menu.id),
      }));
  }
}
