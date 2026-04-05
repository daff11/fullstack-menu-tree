import axios from "axios";
import type {Menu} from "../types/menu";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //backend url
});

export const getMenus = async (): Promise<Menu[]> => {
    const res = await api.get("/menus");
    return res.data;
};

export const createMenu = async (name: string, parentId?: number) => {
  const res = await api.post("/menus", { name, parentId });
  return res.data;
};

export const updateMenu = async (id: number, name: string) => {
  const res = await api.put(`/menus/${id}`, { name });
  return res.data;
};

export const deleteMenu = async (id: number) => {
  const res = await api.delete(`/menus/${id}`);
  return res.data;
};