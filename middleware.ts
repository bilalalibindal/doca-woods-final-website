import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Admin rotaları için kontrol
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Session kontrolü
        if (!token) {
          return false; // Middleware otomatik olarak login sayfasına yönlendirecek
        }

        // Role kontrolü
        if (token.role !== "ADMIN") {
          return false; // Yetkisiz erişim
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/profil?tab=login", // Özel login sayfası
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    // Diğer korumalı rotalar buraya eklenebilir
  ],
};
