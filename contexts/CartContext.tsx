"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stockCount: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + 1,
          action.payload.stockCount
        );
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        return calculateTotals({ ...state, items: [...state.items, newItem] });
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return calculateTotals({ ...state, items: updatedItems });
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  Math.min(action.payload.quantity, item.stockCount)
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0);
      return calculateTotals({ ...state, items: updatedItems });
    }

    case "CLEAR_CART": {
      return { items: [], totalItems: 0, totalPrice: 0 };
    }

    case "LOAD_CART": {
      return calculateTotals({ ...state, items: action.payload });
    }

    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { ...state, totalItems, totalPrice };
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  // localStorage'dan sepet verilerini yükle
  useEffect(() => {
    const savedCart = localStorage.getItem("doca-woods-cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Sepet verileri yüklenemedi:", error);
      }
    }
  }, []);

  // Sepet değişikliklerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("doca-woods-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
