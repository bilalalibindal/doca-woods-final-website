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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { ProductStatus } from "@/Enum";
import { updateOrderStatusAction } from "@/lib/actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface OrdersTableProps {
  orders: any[];
  onOrderUpdate?: () => void;
}

// Tarih Component - Hydration hatasını önlemek için
function OrderDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Client-side'da tarih hesaplaması
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFormattedDate(formatted);
  }, [dateString]);

  return <span>{formattedDate}</span>;
}

export function OrdersTable({ orders, onOrderUpdate }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddressDetails, setShowAddressDetails] = useState(false);

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
        // Modal açıkken durum güncellenirse modal'ı da güncelle
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Sipariş durumu güncellenirken hata oluştu");
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setShowAddressDetails(false); // Modal açıldığında adres detaylarını kapat
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
                <OrderDate dateString={order.createdAt} />
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleViewDetails(order)}
                    >
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

      {/* Sipariş Detayları Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Sipariş Detayları</span>
              <Badge variant="outline" className="ml-2">
                #{selectedOrder?.id?.slice(-8)}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Sipariş bilgilerini görüntüleyin ve düzenleyin
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Sipariş Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      Sipariş Tarihi
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-800 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "tr-TR"
                    )}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      Toplam Tutar
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-green-800 mt-1">
                    {selectedOrder.totalPrice?.toLocaleString("tr-TR")} ₺
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Sipariş Durumu
                    </span>
                  </div>
                  <div className="mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`cursor-pointer border ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {getStatusText(selectedOrder.status)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          Sipariş Durumu Değiştir
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(
                              selectedOrder.id,
                              ProductStatus.APPROVED
                            )
                          }
                          className="cursor-pointer"
                        >
                          ✅ Onaylandı
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(
                              selectedOrder.id,
                              ProductStatus.PREPARING
                            )
                          }
                          className="cursor-pointer"
                        >
                          📦 Hazırlanıyor
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(
                              selectedOrder.id,
                              ProductStatus.SHIPPED
                            )
                          }
                          className="cursor-pointer"
                        >
                          🚚 Kargoda
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(
                              selectedOrder.id,
                              ProductStatus.DELIVERED
                            )
                          }
                          className="cursor-pointer"
                        >
                          ✅ Teslim Edildi
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(
                              selectedOrder.id,
                              ProductStatus.CANCELLED
                            )
                          }
                          className="cursor-pointer text-red-600"
                        >
                          ❌ İptal Edildi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* Müşteri Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Müşteri Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {selectedOrder.customer?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedOrder.customer?.name || "İsim Yok"}
                        </p>
                        <p className="text-sm text-gray-500">Müşteri</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {selectedOrder.customer?.email || "Email Yok"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {selectedOrder.customer?.phone || "Telefon Yok"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* Teslimat Adresi */}
              {selectedOrder.address && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Teslimat Adresi
                    </h3>
                    <div
                      className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setShowAddressDetails(!showAddressDetails)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                {selectedOrder.address.addressTitle ||
                                  "Adres Başlığı Yok"}
                              </p>
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800 ml-2 flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddressDetails(!showAddressDetails);
                                }}
                              >
                                {showAddressDetails
                                  ? "Gizle"
                                  : "Detayları Göster"}
                                <ChevronDown
                                  className={`w-3 h-3 ml-1 transition-transform ${
                                    showAddressDetails ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedOrder.address.sokak} No:{" "}
                              {selectedOrder.address.no}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.address.mahalle},{" "}
                              {selectedOrder.address.sehir} /{" "}
                              {selectedOrder.address.ulke}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.address.postaKodu}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Detaylı Adres Bilgileri */}
                      {showAddressDetails && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {/* Debug: Adres verisini konsola yazdır */}
                          {(() => {
                            console.log("Address Data:", selectedOrder.address);
                            return null;
                          })()}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {selectedOrder.address &&
                              Object.entries(selectedOrder.address).map(
                                ([key, value]) => {
                                  // İstenmeyen alanları filtrele
                                  if (
                                    key === "id" ||
                                    key === "userId" ||
                                    key === "createdAt" ||
                                    key === "updatedAt"
                                  ) {
                                    return null;
                                  }

                                  // Alan adlarını Türkçe'ye çevir
                                  const fieldLabels: { [key: string]: string } =
                                    {
                                      addressTitle: "Adres Başlığı",
                                      ulke: "Ülke",
                                      sehir: "Şehir",
                                      mahalle: "Mahalle",
                                      sokak: "Sokak",
                                      no: "No",
                                      postaKodu: "Posta Kodu",
                                      varsayilan: "Varsayılan Adres",
                                      tarif: "Adres Tarifi",
                                    };

                                  const label = fieldLabels[key] || key;
                                  let displayValue = value;

                                  // Boolean değerleri çevir
                                  if (key === "varsayilan") {
                                    displayValue = value ? "Evet" : "Hayır";
                                  }

                                  // Tarif alanı için özel görünüm
                                  if (key === "tarif" && value) {
                                    return (
                                      <div key={key} className="md:col-span-2">
                                        <span className="font-medium text-gray-700">
                                          {label}:
                                        </span>
                                        <p className="text-gray-600 mt-1 bg-white p-2 rounded border">
                                          {String(displayValue)}
                                        </p>
                                      </div>
                                    );
                                  }

                                  // Diğer alanlar için normal görünüm
                                  if (
                                    value !== null &&
                                    value !== undefined &&
                                    value !== ""
                                  ) {
                                    return (
                                      <div key={key}>
                                        <span className="font-medium text-gray-700">
                                          {label}:
                                        </span>
                                        <p className="text-gray-600">
                                          {String(displayValue)}
                                        </p>
                                      </div>
                                    );
                                  }

                                  return null;
                                }
                              )}
                          </div>

                          {/* Eğer hiç veri yoksa uyarı göster */}
                          {(!selectedOrder.address ||
                            Object.keys(selectedOrder.address)
                              .filter(
                                (key) =>
                                  ![
                                    "id",
                                    "userId",
                                    "createdAt",
                                    "updatedAt",
                                  ].includes(key)
                              )
                              .every((key) => !selectedOrder.address[key])) && (
                            <div className="text-center text-gray-500 py-4">
                              Adres bilgileri bulunamadı.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 my-4" />
                </>
              )}

              {/* Sipariş Ürünleri */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sipariş Ürünleri</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images &&
                        item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-product.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product?.name || "Ürün Adı Yok"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          SKU: {item.product?.sku || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Birim Fiyat: {item.price?.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">Adet</p>
                        <p className="font-semibold text-gray-900">
                          {item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500">Toplam</p>
                        <p className="font-bold text-gray-900">
                          {(item.price * item.quantity)?.toLocaleString(
                            "tr-TR"
                          )}{" "}
                          ₺
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2" />
                      <p>Ürün bilgisi bulunamadı</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
