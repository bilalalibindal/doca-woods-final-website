import { IAddress } from "@/types/addressTypes";
import { CreateOrderData, IOrder } from "@/types/orderTypes";
import { IUserData } from "@/types/userTypes";
import { create } from "zustand";
import { mockAddresses, mockUser } from "./mockData";
import { toast } from "react-toastify";

interface UserState {
  user: IUserData | null; // Başlangıçta null olabilir
  isLoading: boolean;
  error: string | null;
  fetchGetUser: () => Promise<void>;
  //createOrder: (orderData: CreateOrderData) => Promise<IOrder | undefined>;
  saveAddress: (address: IAddress) => Promise<void>;
  clearUser: () => void; // İsmi daha anlamlı hale getirdik
}

export const userStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchGetUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/user");
      if (!res.ok) {
        toast.error("Kullanıcı bilgileri alınamadıi mockUserData gösteriliyor");
        set({ user: mockUser, isLoading: false, error: null });
        return;
      }
      const data = await res.json();
      const apiUser = data.user;
      const userData = {
        ...apiUser,
        orders: apiUser.orders || [],
      };
      set({ user: userData, isLoading: false, error: null });
    } catch (error: any) {
      toast.error("Kullanıcı API'si erişilemedi, demo veriler gösteriliyor.");
      // Fallback olarak mock user ve adresleri kullan
      set({
        user: { ...mockUser, addresses: mockAddresses },
        isLoading: false,
        error: error.message,
      });
    }
  },
  /* createOrder: async (orderData: CreateOrderData) => {
    set({isLoading:true, error:null})
    }, 
*/
  saveAddress: async (address: IAddress) => {
    set({ isLoading: true, error: null });
  },
  clearUser: () => {
    set({ user: null, isLoading: false, error: null });
  },
}));
