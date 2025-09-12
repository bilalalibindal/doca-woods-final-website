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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { default as NextImage } from "next/image";
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
  Truck,
  Edit,
  Plus,
} from "lucide-react";
import { ProductStatus } from "@/Enum";
import {
  updateOrderStatusAction,
  updateOrderShippingTrackingUrlAction,
} from "@/lib/actions";
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
  const [trackingUrlInput, setTrackingUrlInput] = useState("");
  const [showTrackingUrlDialog, setShowTrackingUrlDialog] = useState(false);
  const [isUpdatingTrackingUrl, setIsUpdatingTrackingUrl] = useState(false);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    orderId: string;
    status: string;
  } | null>(null);
  const [statusConfirmationChecked, setStatusConfirmationChecked] =
    useState(false);

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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Önce confirmation dialog'unu göster
    setPendingStatusUpdate({ orderId, status: newStatus });
    setShowStatusConfirmation(true);
    setStatusConfirmationChecked(false);
  };

  const confirmStatusUpdate = async () => {
    if (!pendingStatusUpdate || !statusConfirmationChecked) {
      toast.error("Lütfen onay kutucuğunu işaretleyin!");
      return;
    }

    try {
      const result = await updateOrderStatusAction(
        pendingStatusUpdate.orderId,
        pendingStatusUpdate.status
      );

      if (result.success) {
        toast.success("Sipariş durumu başarıyla güncellendi!");

        // Modal açıkken durum güncellenirse modal'ı da güncelle
        if (selectedOrder && selectedOrder.id === pendingStatusUpdate.orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: pendingStatusUpdate.status,
          });
        }

        // Parent'a güncellemeyi bildir
        if (onOrderUpdate) {
          onOrderUpdate();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Sipariş durumu güncellenirken hata oluştu");
    } finally {
      setShowStatusConfirmation(false);
      setPendingStatusUpdate(null);
      setStatusConfirmationChecked(false);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setShowAddressDetails(false); // Modal açıldığında adres detaylarını kapat
    setTrackingUrlInput(order.shippingTrackingUrl || ""); // Mevcut tracking URL'yi input'a set et
  };

  const handleUpdateTrackingUrl = async () => {
    if (!selectedOrder || !trackingUrlInput.trim()) {
      toast.error("Kargo takip URL'si gerekli!");
      return;
    }

    // Onay dialog'u göster
    const confirmUpdate = window.confirm(
      `Kargo takip URL'sini "${trackingUrlInput}" olarak güncellemek istediğinizden emin misiniz?`
    );

    if (!confirmUpdate) return;

    setIsUpdatingTrackingUrl(true);
    try {
      const result = await updateOrderShippingTrackingUrlAction(
        selectedOrder.id,
        trackingUrlInput.trim()
      );

      if (result.success) {
        toast.success("Kargo takip URL'si başarıyla güncellendi!");
        setShowTrackingUrlDialog(false);

        // Modal içinde selectedOrder'ı güncelle
        const updatedOrder = {
          ...selectedOrder,
          shippingTrackingUrl: trackingUrlInput.trim(),
        };
        setSelectedOrder(updatedOrder);

        // Parent'a güncellemeyi bildir
        if (onOrderUpdate) {
          onOrderUpdate();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Tracking URL update error:", error);
      toast.error("Kargo takip URL'si güncellenirken hata oluştu!");
    } finally {
      setIsUpdatingTrackingUrl(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-center">
              Sipariş ID
            </TableHead>
            <TableHead className="font-semibold text-center">Müşteri</TableHead>
            <TableHead className="font-semibold text-center">Ürünler</TableHead>
            <TableHead className="font-semibold text-center">Durum</TableHead>
            <TableHead className="font-semibold text-center">Toplam</TableHead>
            <TableHead className="font-semibold text-center">Tarih</TableHead>
            <TableHead className="font-semibold text-center">
              Eylemler
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm">
                    {order.id.slice(-8)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {order.customer?.name || "İsim Yok"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.customer?.email || "Email Yok"}
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="text-sm">{order.items?.length || 0} ürün</div>
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusText(order.status)}
                </span>
              </TableCell>

              <TableCell className="font-semibold text-green-600 text-center">
                {order.totalPrice?.toLocaleString("tr-TR")} ₺
              </TableCell>

              <TableCell className="text-sm text-gray-500 text-center">
                <OrderDate dateString={order.createdAt} />
              </TableCell>

              <TableCell className="text-center">
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

              {/* Kargo Takip URL'si */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Kargo Takip</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Kargo Takip URL'si
                    </span>
                  </div>

                  {selectedOrder.shippingTrackingUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Mevcut URL:
                        </span>
                        <a
                          href={selectedOrder.shippingTrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline truncate max-w-md"
                        >
                          {selectedOrder.shippingTrackingUrl}
                        </a>
                      </div>
                      <Button
                        onClick={() => setShowTrackingUrlDialog(true)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        URL'yi Güncelle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Henüz kargo takip URL'si girilmemiş.
                      </p>
                      <Button
                        onClick={() => setShowTrackingUrlDialog(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        URL Ekle
                      </Button>
                    </div>
                  )}
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
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images &&
                        item.product.images.length > 0 ? (
                          <NextImage
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-product.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-500" />
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

      {/* Sipariş Durumu Onay Dialog */}
      <Dialog
        open={showStatusConfirmation}
        onOpenChange={setShowStatusConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sipariş Durumu Güncellemesi Onayı</DialogTitle>
            <DialogDescription>
              Sipariş #{pendingStatusUpdate?.orderId} için durumu{" "}
              <strong>
                {getStatusText(pendingStatusUpdate?.status || "")}
              </strong>{" "}
              olarak güncellemek istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="status-confirmation"
                checked={statusConfirmationChecked}
                onChange={(e) => setStatusConfirmationChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Label htmlFor="status-confirmation" className="text-sm">
                Bu değişikliği yapmak istediğimi onaylıyorum
              </Label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Uyarı:</strong> Bu işlem geri alınamaz. Müşteriye durum
                değişikliği hakkında email gönderilecektir.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusConfirmation(false);
                  setPendingStatusUpdate(null);
                  setStatusConfirmationChecked(false);
                }}
              >
                İptal
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={!statusConfirmationChecked}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Onayla ve Güncelle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kargo Takip URL'si Dialog */}
      <Dialog
        open={showTrackingUrlDialog}
        onOpenChange={setShowTrackingUrlDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kargo Takip URL'si Güncelle</DialogTitle>
            <DialogDescription>
              Sipariş #{selectedOrder?.id} için kargo takip URL'sini girin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tracking-url" className="text-sm font-medium">
                Kargo Takip URL'si
              </Label>
              <Input
                id="tracking-url"
                type="url"
                placeholder="https://kargo.sirketi.com/takip/ABC123..."
                value={trackingUrlInput}
                onChange={(e) => setTrackingUrlInput(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Geçerli bir URL girin (örn: https://...)
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTrackingUrlDialog(false)}
                disabled={isUpdatingTrackingUrl}
              >
                İptal
              </Button>
              <Button
                onClick={handleUpdateTrackingUrl}
                disabled={isUpdatingTrackingUrl || !trackingUrlInput.trim()}
              >
                {isUpdatingTrackingUrl ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Güncelleniyor...
                  </>
                ) : (
                  "Güncelle"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
