"use client";

import LoginButton from "@/components/auth/LoginButton";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/25">
            <svg
              className="w-14 h-14 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Doca Woods
          </h1>
          <p className="text-slate-600 text-lg font-medium mb-2">
            El İşçiliği Ahşap Atölyesi
          </p>
          <p className="text-slate-500">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-white/20">
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Hoş Geldiniz
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Özel tasarım ahşap ürünlerimize erişim için Google hesabınızla
                giriş yapın
              </p>
            </div>

            {/* Login Button */}
            <div className="space-y-6">
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p className="leading-relaxed">
            Giriş yaparak{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
            >
              Kullanım Şartları
            </a>{" "}
            ve{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
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
