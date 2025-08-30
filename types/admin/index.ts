export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PREPARING = "PREPARING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif: string;
  varsayilan: boolean;
  userId: string;
  user: User;
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  inStock: boolean;
  stockCount: number;
  material: string;
  color: string;
  sku: string;
  sizeWidth?: number | null;
  sizeHeight?: number | null;
  sizeDepth?: number | null;
  categoryId: string;
  category: Category;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Order {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  shippingTrackingUrl?: string;
  customizationImages: string[];
  customerId: string;
  customer: User;
  addressId: string;
  address: Address;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
}
