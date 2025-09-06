"use client";

import Image from "next/image";
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import LoginButton from "@/components/auth/LoginButton";
import PendingOrdersNotification from "./PendingOrdersNotification";
import { useEffect } from "react";
import { userStore } from "@/stores/userStore";
import { useSession } from "next-auth/react";
import { ProductStatus } from "@/Enum";
import LoadingScreen from "./LoadingScreen"; // LoadingScreen'i import ettiğinizi varsayıyorum

const UserDashboard = () => {
  // DÜZELTME: Artık 'user' objesini ve diğer state'leri çekiyoruz.
  const { user, isLoading, error, fetchGetUser } = userStore();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // Sadece giriş yapılmışsa ve kullanıcı verisi henüz çekilmemişse veriyi çek
    if (sessionStatus === "authenticated" && !user) {
      fetchGetUser();
    }
  }, [sessionStatus, user, fetchGetUser]);

  // DÜZELTME: Dinamik hesaplamalar artık 'user.orders' üzerinden yapılıyor.
  const totalUserOrdersCount = user?.orders?.length || 0;
  const pendingUserOrdersCount =
    user?.orders?.filter(
      (order) =>
        order.status === ProductStatus.PENDING ||
        order.status === ProductStatus.PREPARING ||
        order.status === ProductStatus.APPROVED
    ).length || 0;

  // DÜZELTME: Adres sayısını da artık store'daki kullanıcı verisinden alıyoruz.
  const addressCount = user?.addresses?.length || 0;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Hata: {error}</div>;
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p>Lütfen giriş yapınız.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Kullanıcı"}
                  width={100}
                  height={100}
                  className="rounded-3xl shadow-2xl shadow-blue-500/25 ring-4 ring-white/50"
                />
              ) : (
                <div className="w-25 h-25 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 ring-4 ring-white/50">
                  {" "}
                  <UserIcon className="w-12 h-12 text-white" />{" "}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Hoş geldin, {user?.name?.split(" ")[0]}!
              </h1>
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start text-slate-600">
                  <EnvelopeIcon className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="font-medium">{user?.email}</span>
                </div>
                {/* DÜZELTME: Üye olma tarihi veritabanından gelmeli, session'dan değil. */}
                {user?.createdAt && (
                  <div className="flex items-center justify-center lg:justify-start text-slate-600">
                    <CalendarIcon className="w-5 h-5 mr-3 text-blue-500" />
                    <span>
                      Üye olma tarihi:{" "}
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-end space-y-4">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Pending Orders Notification */}
        {pendingUserOrdersCount > 0 && (
          <PendingOrdersNotification
            pendingOrdersCount={pendingUserOrdersCount}
          />
        )}

        {/* Stats & Actions Cards */}
        {/* Bu kartların içindeki değişkenler (totalUserOrdersCount vb.) zaten doğru şekilde güncellendi. */}
        {/* ... (Bu kısımlarda bir değişiklik yapmaya gerek yok) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBagIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {totalUserOrdersCount}
                </p>
                <p className="text-sm text-slate-600 font-medium">
                  Toplam Sipariş
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-500/10 p-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">
                  {pendingUserOrdersCount}
                </p>
                <p className="text-sm text-slate-600 font-medium">
                  Bekleyen Sipariş
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions - Artık dinamik veriyle çalışıyor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <button
            onClick={() => (window.location.href = "/hesabim/siparislerim")}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group w-full"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-blue-600">
                  {totalUserOrdersCount}
                </span>
                <span className="text-slate-500 font-medium">sipariş</span>
              </div>
              <ChevronRightIcon className="w-7 h-7 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-emerald-600">
                  {addressCount}
                </span>
                <span className="text-slate-500 font-medium">adres</span>
              </div>
              <ChevronRightIcon className="w-7 h-7 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
