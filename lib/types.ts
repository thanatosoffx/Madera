import type { OrderStatus } from "./constants";

export type ProductImage = {
  url: string;
  blurDataURL: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "stock" | "custom";
  price_cents: number;
  stock_quantity: number;
  base_wood_options: string[];
  images: ProductImage[];
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  product_id: string;
  flow: "stock" | "custom";
  status: OrderStatus;
  wood_type: string | null;
  finish: string | null;
  custom_specs: Record<string, unknown> | null;
  deposit_paid_cents: number;
  total_cents: number;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ManufacturingLog = {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
};

export type OrderWithLogs = Order & {
  product: Pick<Product, "name" | "slug" | "images">;
  logs: ManufacturingLog[];
};
