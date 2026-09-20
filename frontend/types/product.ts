export type ProductCategory =
  | "Electronics"
  | "Clothing"
  | "Food"
  | "Other";


export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  minimum_stock: number;
  created_at?: string | null;
  updated_at?: string | null;
}


export interface ProductFormData {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  minimum_stock: number;
}


export interface StockUpdateData {
  action: "add" | "remove";
  quantity: number;
}