// =============================================================
// TEMEL TİPLER - Prisma Schema'ya Uygun
// =============================================================

import { ProductStatus } from "@/Enum";

// Address tipi - Prisma Address model'ine uygun
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
  createdAt: Date;
  updatedAt: Date;
}

// User tipi - Prisma User model'ine uygun
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  addresses?: Address[];
  orders?: Order[];
  createdAt: Date;
  updatedAt: Date;
}

// Category tipi - Prisma Category model'ine uygun
export interface Category {
  id: string;
  name: string;
  products?: Product[];
}

// Product tipi - Prisma Product model'ine uygun
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
  orderItems?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// OrderItem tipi - Prisma OrderItem model'ine uygun
export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  order?: Order;
  product?: Product;
}

// Order tipi - Prisma Order model'ine uygun
export interface Order {
  id: string;
  totalPrice: number;
  status: ProductStatus;
  shippingTrackingUrl?: string;
  customizationImages: string[];
  customerId: string;
  addressId: string;
  customer?: User;
  address?: Address;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================
// FORM TİPLERİ
// =============================================================

// Adres oluşturma/güncelleme formu için
export interface AddressFormData {
  addressTitle: string;
  ulke: string;
  sehir: string;
  mahalle: string;
  sokak: string;
  no: string;
  postaKodu: string;
  tarif: string;
  varsayilan: boolean;
}

// Sipariş oluşturma için
export interface CreateOrderData {
  customerId: string;
  addressId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  customizationImages?: string[];
}

// =============================================================
// UI TİPLERİ
// =============================================================

// Ürün filtreleme için
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// Sıralama seçenekleri
export interface SortOption {
  value: string;
  label: string;
}

// Sayfalama bilgisi
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// =============================================================
// API RESPONSE TİPLERİ
// =============================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}
