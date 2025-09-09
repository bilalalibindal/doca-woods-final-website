"use client";

import LoginButton from "@/components/auth/LoginButton";
import { TreePine, ArrowRight } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <TreePine className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Doca Woods</h1>
          <p className="text-gray-600 text-lg">Ahşap Atölyesi</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 p-8">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Hoş Geldiniz
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Özel tasarım ahşap ürünlerimize erişim için
                <br />
                Google hesabınızla giriş yapın
              </p>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <LoginButton />
            </div>

            {/* Alternative Login Options */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Veya devam etmek için
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Ana sayfaya dön
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 max-w-sm mx-auto">
          <p>
            Giriş yaparak{" "}
            <a
              href="#"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
            >
              Kullanım Şartları
            </a>{" "}
            ve{" "}
            <a
              href="#"
              className="text-amber-600 hover:text-amber-700 underline underline-offset-2 transition-colors"
            >
              Gizlilik Politikası
            </a>
            'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
