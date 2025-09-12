import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentOrders } from "@/lib/data";
import { ProductStatus } from "@/Enum";

const statusColors = {
  [ProductStatus.PENDING]: "bg-amber-100 text-amber-800 border-amber-200",
  [ProductStatus.APPROVED]: "bg-blue-100 text-blue-800 border-blue-200",
  [ProductStatus.PREPARING]: "bg-orange-100 text-orange-800 border-orange-200",
  [ProductStatus.SHIPPED]: "bg-purple-100 text-purple-800 border-purple-200",
  [ProductStatus.DELIVERED]: "bg-green-100 text-green-800 border-green-200",
  [ProductStatus.CANCELLED]: "bg-red-100 text-red-800 border-red-200",
};

const getStatusText = (status: ProductStatus) => {
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
      return "Bilinmiyor";
  }
};

export async function RecentOrders() {
  const recentOrders = await getRecentOrders();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Son Siparişler
        </CardTitle>
        <CardDescription className="text-gray-600">
          Son {recentOrders.length} sipariş
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-center">
                Sipariş ID
              </TableHead>
              <TableHead className="font-semibold text-center">
                Müşteri
              </TableHead>
              <TableHead className="font-semibold text-center">Tarih</TableHead>
              <TableHead className="font-semibold text-center">Durum</TableHead>
              <TableHead className="font-semibold text-center">
                Toplam
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-center">
                  <span className="font-mono text-sm">#{order.id}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {order.createdAt.toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`${statusColors[order.status]} border`}
                    variant="secondary"
                  >
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold text-green-600">
                  {order.totalPrice.toLocaleString("tr-TR")} ₺
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
