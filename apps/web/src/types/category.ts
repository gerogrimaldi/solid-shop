import { mock } from "node:test";

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

export const mockCategories = ["Electrónica", "Ropa", "Hogar", "Deportes", "Supermercado", "Vehículos"];
