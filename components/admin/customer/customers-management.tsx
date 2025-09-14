"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  Filter,
  RefreshCw,
} from "lucide-react";
import { getUsersForAdmin, getCustomersStats } from "@/lib/services";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
    addresses: number;
  };
}

interface CustomersManagementProps {
  initialUsers: User[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  initialSearchParams: {
    search: string;
    sortBy: string;
    sortOrder: string;
  };
}

const CustomersManagement: React.FC<CustomersManagementProps> = ({
  initialUsers,
  totalCount,
  totalPages,
  currentPage,
  initialSearchParams,
}) => {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    dailyVisitors: 0,
    monthlyVisitors: 0,
  });

  // Search and filter states
  const [search, setSearch] = useState(initialSearchParams.search || "");
  const [sortBy, setSortBy] = useState(
    initialSearchParams.sortBy || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState(
    initialSearchParams.sortOrder || "desc"
  );

  // Load customers stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getCustomersStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error loading customer stats:", error);
      }
    };
    loadStats();
  }, []);

  // URL değiştiğinde veriyi dinamik olarak güncelle
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const currentParams = new URLSearchParams(searchParamsHook.toString());
        const page = parseInt(currentParams.get("page") || "1");
        const searchParam = currentParams.get("search") || "";
        const sortByParam = currentParams.get("sortBy") || "createdAt";
        const sortOrderParam =
          (currentParams.get("sortOrder") as "asc" | "desc") || "desc";

        const customersData = await getUsersForAdmin(
          page,
          20,
          searchParam,
          sortByParam,
          sortOrderParam
        );

        setUsers(customersData.users);
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    };

    loadCustomers();
  }, [searchParamsHook]); // searchParamsHook değiştiğinde veriyi yeniden çek

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
      // Sayfa yeniden yüklenmeden URL'yi güncelle
      router.replace(`/admin/customers?${params.toString()}`, {
        scroll: false, // Scroll pozisyonunu koru
      });
    });
  };

  const handleSearch = () => {
    if (search.trim()) {
      updateSearchParams({
        search: search.trim(),
        page: "1", // Reset to first page on search
      });
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearch(value);
    // Eğer arama kutusu boşaltılırsa arama filtresini kaldır
    if (!value.trim()) {
      updateSearchParams({
        search: "",
        page: "1",
      });
    }
  };

  const handleSort = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    updateSearchParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: "1",
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({
      page: page.toString(),
    });
  };

  const clearFilters = () => {
    setSearch("");
    updateSearchParams({
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: "1",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastLoginStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt)
      return { text: "Bulunamadı", color: "bg-gray-100 text-gray-800" };

    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return { text: "Bugün aktif", color: "bg-green-100 text-green-800" };
    } else if (diffInHours < 168) {
      // 7 gün
      return { text: "Bu hafta aktif", color: "bg-blue-100 text-blue-800" };
    } else if (diffInHours < 720) {
      // 30 gün
      return { text: "Bu ay aktif", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return {
        text: "Uzun süredir aktif değil",
        color: "bg-red-100 text-red-800",
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Müşteriler</h1>
            <p className="text-gray-600">Müşteri yönetimi ve analizi</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Müşteri
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCustomers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Kayıtlı kullanıcı sayısı
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Günlük Ziyaretçi
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.dailyVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Son 24 saatte aktif</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aylık Ziyaretçi
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.monthlyVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Son 30 günde aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Arama ve Filtreleme
          </CardTitle>
          <CardDescription>
            Müşterileri ad, email veya telefon numarasına göre arayabilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Müşteri adı, email veya telefon ara..."
                  value={search}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isPending}>
                {isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Aranıyor..." : "Ara"}
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Müşteri Listesi</CardTitle>
              <CardDescription>
                Toplam {totalCount.toLocaleString()} müşteri bulundu
              </CardDescription>
            </div>
            <Badge variant="secondary">
              Sayfa {currentPage} / {totalPages}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Müşteri Adı
                      {sortBy === "name" && (
                        <span className="text-xs">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>İletişim</TableHead>
                  <TableHead>Son Giriş</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Kayıt Tarihi
                      {sortBy === "createdAt" && (
                        <span className="text-xs">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const loginStatus = getLastLoginStatus(
                    user.lastLoginAt?.toISOString() || null
                  );
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-800">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>

                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            {user.phone ? (
                              <>
                                <Phone className="w-3 h-3" /> {user.phone}
                              </>
                            ) : (
                              <>
                                <Phone className="w-3 h-3" /> Telefon numarası
                                yok
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={loginStatus.color}>
                          {loginStatus.text}
                        </Badge>
                        {user.lastLoginAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(user.lastLoginAt.toISOString())}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {formatDate(user.createdAt.toISOString())}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-gray-700">
                Toplam {totalCount.toLocaleString()} müşteri
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Önceki
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersManagement;
