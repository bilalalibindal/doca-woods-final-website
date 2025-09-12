import { User } from "@/types";
import { create } from "zustand";
import { mockAddresses, mockUser } from "./mockData";
import { toast } from "sonner";
import { getUserAction } from "@/lib/actions";
import { signOut } from "next-auth/react";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchGetUser: () => Promise<void>;
  clearUser: () => void;
}

export const userStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchGetUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getUserAction();

      if (result.success && result.data) {
        set({
          user: result.data,
          isLoading: false,
          error: null,
        });
      } else {
        signOut({ callbackUrl: "/profil" });
        throw new Error(result.message || "Kullanıcı verisi alınamadı");
      }
    } catch (error: any) {
      console.error("Kullanıcı verilerini çekerken hata:", error);
      toast.error("Kullanıcı bilgisi alınamadı, demo veriler gösteriliyor.");

      // Fallback olarak mock user ve adresleri kullan
      set({
        user: { ...mockUser, addresses: mockAddresses },
        isLoading: false,
        error: error.message,
      });
    }
  },

  clearUser: () => {
    set({ user: null, isLoading: false, error: null });
  },
}));
