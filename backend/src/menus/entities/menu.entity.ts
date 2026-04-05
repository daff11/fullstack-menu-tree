export class MenuEntity {
  id: number;
  name: string;
  parentId?: number;
  order: number;
  createdAt: Date;
}
