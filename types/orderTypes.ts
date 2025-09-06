import { ProductStatus } from "@/Enum";
import { IUserData } from "./userTypes";
import { IProduct } from "./productTypes";
import { IAddress } from "./addressTypes";

export interface IOrder {
  id: string;
  user: IUserData;
  products: IProduct[];
  customizationImage: string[];
  totalPrice: number;
  status: ProductStatus;
  shippingTrackingUrl?: string;
  address: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
}

// Sipariş oluşturmak için API'ye gönderilecek verinin tipi
export interface CreateOrderData {
  user: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  address: IAddress; // IAddress olarak güncelledik
  customizationImage?: string[];
}
