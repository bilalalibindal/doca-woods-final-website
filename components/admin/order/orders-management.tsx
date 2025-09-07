"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { OrdersTable } from "./orders-table";
import { Search, Filter, RefreshCw, Package } from "lucide-react";
import { ProductStatus } from "@/Enum";

interface OrdersManagementProps {
  initialOrders: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  initialSearchParams: {
    search: string;
    status: string;
    sortBy: string;
    sortOrder: string;
  };
}

export default function OrdersManagement({
  initialOrders,
  totalCount,
  totalPages,
  currentPage,
  initialSearchParams,
}: OrdersManagementProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearchParams.search);
  const [status, setStatus] = useState(initialSearchParams.status);
  const [sortBy, setSortBy] = useState(initialSearchParams.sortBy);
  const [sortOrder, setSortOrder] = useState(initialSearchParams.sortOrder);

  const updateSearchParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParamsHook.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "desc") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/admin/orders?${params.toString()}`);
    });
  };

  const handleSearch = () => {
    updateSearchParams({
      search: search,
      page: "1", // Reset to first page on search
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateSearchParams({
      status: newStatus,
      page: "1", // Reset to first page on filter change
    });
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    updateSearchParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: "1", // Reset to first page on sort change
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({
      page: page.toString(),
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const getStatusBadge = (statusFilter: string) => {
    const statusMap = {
      all: { text: "Tümü", color: "bg-gray-100 text-gray-800" },
      [ProductStatus.PENDING]: {
        text: "Beklemede",
        color: "bg-yellow-100 text-yellow-800",
      },
      [ProductStatus.APPROVED]: {
        text: "Onaylandı",
        color: "bg-blue-100 text-blue-800",
      },
      [ProductStatus.PREPARING]: {
        text: "Hazırlanıyor",
        color: "bg-orange-100 text-orange-800",
      },
      [ProductStatus.SHIPPED]: {
        text: "Kargoda",
        color: "bg-purple-100 text-purple-800",
      },
      [ProductStatus.DELIVERED]: {
        text: "Teslim Edildi",
        color: "bg-green-100 text-green-800",
      },
      [ProductStatus.CANCELLED]: {
        text: "İptal Edildi",
        color: "bg-red-100 text-red-800",
      },
    };

    const current =
      statusMap[statusFilter as keyof typeof statusMap] || statusMap.all;
    return <Badge className={current.color}>{current.text}</Badge>;
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sipariş Yönetimi
              </h1>
              <p className="text-gray-600">
                Tüm siparişleri görüntüleyin ve yönetin
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`}
              />
              <span>Yenile</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Sipariş
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktif Sipariş
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  initialOrders.filter((order) =>
                    [
                      ProductStatus.PENDING,
                      ProductStatus.APPROVED,
                      ProductStatus.PREPARING,
                      ProductStatus.SHIPPED,
                    ].includes(order.status)
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  initialOrders.filter(
                    (order) => order.status === ProductStatus.DELIVERED
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                İptal Edilen
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  initialOrders.filter(
                    (order) => order.status === ProductStatus.CANCELLED
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtreler ve Arama</span>
            </CardTitle>
            <CardDescription>Siparişleri filtreleyin ve arayın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Sipariş ID, müşteri adı veya email ile ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value={ProductStatus.PENDING}>
                    Beklemede
                  </SelectItem>
                  <SelectItem value={ProductStatus.APPROVED}>
                    Onaylandı
                  </SelectItem>
                  <SelectItem value={ProductStatus.PREPARING}>
                    Hazırlanıyor
                  </SelectItem>
                  <SelectItem value={ProductStatus.SHIPPED}>Kargoda</SelectItem>
                  <SelectItem value={ProductStatus.DELIVERED}>
                    Teslim Edildi
                  </SelectItem>
                  <SelectItem value={ProductStatus.CANCELLED}>
                    İptal Edildi
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Options */}
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split("-");
                  handleSortChange(newSortBy, newSortOrder);
                }}
              >
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sıralama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">En Yeni</SelectItem>
                  <SelectItem value="createdAt-asc">En Eski</SelectItem>
                  <SelectItem value="totalPrice-desc">
                    Fiyat (Azalan)
                  </SelectItem>
                  <SelectItem value="totalPrice-asc">Fiyat (Artan)</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} disabled={isPending}>
                <Search className="w-4 h-4 mr-2" />
                Ara
              </Button>
            </div>

            {/* Active Filters */}
            {(search || status !== "all") && (
              <div className="flex items-center space-x-2 mt-4">
                <span className="text-sm text-gray-500">Aktif filtreler:</span>
                {search && (
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>Arama: {search}</span>
                    <button
                      onClick={() => {
                        setSearch("");
                        updateSearchParams({ search: "", page: "1" });
                      }}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {status !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>Durum: {getStatusBadge(status)}</span>
                    <button
                      onClick={() => {
                        setStatus("all");
                        updateSearchParams({ status: "all", page: "1" });
                      }}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Siparişler</CardTitle>
            <CardDescription>
              {totalCount > 0 ? (
                <span>
                  Toplam {totalCount.toLocaleString()} sipariş bulundu. Sayfa{" "}
                  {currentPage} / {totalPages}
                </span>
              ) : (
                "Henüz sipariş bulunmuyor."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable
              orders={initialOrders}
              onOrderUpdate={() => {
                startTransition(() => {
                  router.refresh();
                });
              }}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {generatePageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum as number)}
                        isActive={pageNum === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
