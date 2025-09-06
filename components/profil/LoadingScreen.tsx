"use client";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
          {/* Inner ring */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full animate-pulse"></div>
        </div>

        <div className="space-y-2">
          <p className="text-blue-600 font-semibold text-lg">Yükleniyor...</p>
          <p className="text-slate-500 text-sm">
            Hesap bilgileriniz kontrol ediliyor
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
