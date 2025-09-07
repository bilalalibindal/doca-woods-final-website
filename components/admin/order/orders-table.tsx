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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Package } from "lucide-react";
import { ProductStatus } from "@/Enum";
import { updateOrderStatusAction } from "@/lib/actions";
import { toast } from "sonner";

interface OrdersTableProps {
  orders: any[];
  onOrderUpdate?: () => void;
}

export function OrdersTable({ orders, onOrderUpdate }: OrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ProductStatus.APPROVED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ProductStatus.PREPARING:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ProductStatus.SHIPPED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ProductStatus.DELIVERED:
        return "bg-green-100 text-green-800 border-green-200";
      case ProductStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ProductStatus.PENDING:
        return "Beklemede";
      case ProductStatus.APPROVED:
        return "Onaylandı";
      case ProductStatus.PREPARING:
        return "Hazırlanıyor";
      case ProductStatus.SHIPPED:
        return "Kargoda";
      case ProductStatus.DELIVERED:
        return "Teslim Edildi";
      case ProductStatus.CANCELLED:
        return "İptal Edildi";
      default:
        return status;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast.success("Sipariş durumu güncellendi");
        onOrderUpdate?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Sipariş durumu güncellenirken hata oluştu");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Sipariş ID</TableHead>
            <TableHead className="font-semibold">Müşteri</TableHead>
            <TableHead className="font-semibold">Ürünler</TableHead>
            <TableHead className="font-semibold">Durum</TableHead>
            <TableHead className="font-semibold">Toplam</TableHead>
            <TableHead className="font-semibold">Tarih</TableHead>
            <TableHead className="font-semibold">Eylemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm">
                    {order.id.slice(-8)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">
                    {order.customer?.name || "İsim Yok"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.email || "Email Yok"}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">{order.items?.length || 0} ürün</div>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`cursor-pointer border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sipariş Durumu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(order.id, ProductStatus.APPROVED)
                      }
                      className="cursor-pointer"
                    >
                      ✅ Onayla
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(order.id, ProductStatus.PREPARING)
                      }
                      className="cursor-pointer"
                    >
                      📦 Hazırla
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(order.id, ProductStatus.SHIPPED)
                      }
                      className="cursor-pointer"
                    >
                      🚚 Gönder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(order.id, ProductStatus.DELIVERED)
                      }
                      className="cursor-pointer"
                    >
                      ✅ Teslim Et
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(order.id, ProductStatus.CANCELLED)
                      }
                      className="cursor-pointer text-red-600"
                    >
                      ❌ İptal Et
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <TableCell className="font-semibold text-green-600">
                {order.totalPrice?.toLocaleString("tr-TR")} ₺
              </TableCell>

              <TableCell className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      Detayları Görüntüle
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sipariş bulunamadı
          </h3>
          <p className="text-gray-500">
            Arama kriterlerinize uygun sipariş bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
}
