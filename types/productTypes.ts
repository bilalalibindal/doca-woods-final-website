export interface IProduct {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  price: number;
  inStock: boolean;
  stockCount: number;
  material: string;
  color: string;
  size?: {
    height: number;
    width: number;
    depth: number;
  };
  weight?: {
    value: number;
    unit: "kg";
  };
  sku: string;
}

export interface ProductFilters {
  category?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
