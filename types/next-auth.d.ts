// next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "./Enum"; // Enum dosyanızın yolunu doğru belirttiğinizden emin olun

declare module "next-auth" {
  /**
   * Client tarafında `useSession().data.user` ile erişilen session nesnesine
   * kendi alanlarımızı eklemek için kullanılır.
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"]; // Varsayılan alanları (name, email, image) koru
  }

  // Varsayılan User modeline de rolü ekleyebiliriz (opsiyonel ama iyi bir pratik)
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT callback'inde döndürülen token nesnesine
   * kendi alanlarımızı eklemek için kullanılır.
   */
  interface JWT {
    id: string;
    role: UserRole;
  }
}
