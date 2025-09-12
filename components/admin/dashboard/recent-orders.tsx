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
import { getRecentOrders } from "@/lib/admin-actions";
import { ProductStatus } from "@/Enum";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
  PREPARING: "bg-orange-100 text-orange-800 border-orange-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Beklemede";
    case "APPROVED":
      return "Onaylandı";
    case "PREPARING":
      return "Hazırlanıyor";
    case "SHIPPED":
      return "Kargoda";
    case "DELIVERED":
      return "Teslim Edildi";
    case "CANCELLED":
      return "İptal Edildi";
    default:
      return "Bilinmiyor";
  }
};

interface RecentOrdersProps {
  ordersData?: {
    success: boolean;
    data?: Array<{
      id: string;
      customer: { name: string; email: string };
      totalPrice: number;
      status: string;
      createdAt: Date;
      items: any[];
    }>;
    message?: string;
  };
}

export function RecentOrders({ ordersData }: RecentOrdersProps) {
  const result = ordersData || { success: false, message: "Veri bulunamadı" };

  if (!result.success || !result.data) {
    // Fallback data
    const fallbackOrders = [
      {
        id: "001",
        customer: { name: "Test Kullanıcı", email: "test@example.com" },
        totalPrice: 1500,
        status: "PENDING",
        createdAt: new Date(),
        items: [],
      },
    ];

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Son Siparişler
          </CardTitle>
          <CardDescription className="text-gray-600">
            Son {fallbackOrders.length} sipariş
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
                <TableHead className="font-semibold text-center">
                  Tarih
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Durum
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Toplam
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fallbackOrders.map((order) => (
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

  const recentOrders = result.data;

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
            {recentOrders.map((order: any) => (
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
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")}
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
