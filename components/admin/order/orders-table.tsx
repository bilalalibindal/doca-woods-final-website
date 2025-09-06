import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";

// Kendi bileşenleriniz ve fonksiyonlarınız
import { ProductForm } from "@/components/admin/product/product-form";
import { deleteProduct } from "@/lib/admin-actions";
import type { Product, Category, Order } from "@/types/admin";
import { toast } from "react-toastify";
import { toastAlert } from "@/components/toastAlert";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="border-rounded-lg">
      {/* Order Tablosu */}
      <Table>
        <TableRow>
          <TableHead>Sipariş ID</TableHead>
          <TableHead>Müşteri</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Toplam Fiyat</TableHead>
          <TableHead>Tarih</TableHead>
          <TableHead>Eylemler</TableHead>
        </TableRow>
        <TableHeader>
          <TableBody></TableBody>
        </TableHeader>
      </Table>
    </div>
  );
}
