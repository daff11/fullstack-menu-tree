export interface Menu {
    id: number;
    name: string;
    parentId: number | null;
    order: number;
    children: Menu[];
}