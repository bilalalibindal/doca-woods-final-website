"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeftOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function LoginButton() {
  const { data: session, status } = useSession();
  console.log("Session", session);
  console.log("Status", status);
  // Eğer session bilgisi yükleniyorsa
  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="hidden sm:block">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Eğer kullanıcı giriş yapmışsa
  if (status === "authenticated") {
    console.log("Session", session);
    console.log("Status", status);
    return (
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <div className="relative">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "Kullanıcı"}
              width={40}
              height={40}
              className="rounded-full border-2 border-amber-200 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden sm:block flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {session.user?.name?.split(" ")[0] || "Kullanıcı"}
          </p>
          <p className="text-xs text-gray-600">
            {session.user?.email?.length! > 20
              ? `${session.user?.email?.substring(0, 20)}...`
              : session.user?.email}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 border border-amber-200 hover:border-amber-300"
          title="Çıkış Yap"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Çıkış</span>
        </button>
      </div>
    );
  }

  // Eğer kullanıcı giriş yapmamışsa
  return (
    <button
      onClick={() => signIn("google")}
      className="group w-full flex items-center justify-center gap-4 px-6 py-4 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl transition-all duration-300 font-semibold text-gray-700 hover:text-amber-700 shadow-sm hover:shadow-lg hover:shadow-amber-500/10"
    >
      {/* Google Icon */}
      <svg
        className="w-5 h-5 group-hover:scale-110 transition-transform"
        viewBox="0 0 24 24"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>

      <span className="text-base">Google ile Giriş Yap</span>
    </button>
  );
}
