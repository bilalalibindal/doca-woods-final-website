// authOptions.ts

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { UserRole } from "@/Enum";
import { sendMail } from "@/lib/email-sender";

export const authOptions: NextAuthOptions = {
  // AÇIKLAMA: Session stratejisini ve süresini burada belirtiyoruz.
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 saat (saniye cinsinden)
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // DEĞİŞTİ: signIn callback'i artık veritabanı işlemi yapmıyor.
    // Görevi sadece Google'dan gelen girişlere izin vermek.
    async signIn({ account }) {
      if (account?.provider === "google") {
        return true; // Google ile yapılan tüm girişlere izin ver.
      }
      return false; // Diğer tüm girişleri reddet.
    },

    // DEĞİŞTİ: Tüm veritabanı ve token mantığı artık burada.
    async jwt({ token, user, account }) {
      // Bu blok sadece kullanıcı İLK KEZ giriş yaptığında çalışır.
      if (account && user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (dbUser) {
            // Eğer kullanıcı varsa, token'a veritabanındaki bilgilerini ekle
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.role = dbUser.role; // Rol bilgisini de ekleyelim!
          } else {
            // Eğer kullanıcı yoksa, veritabanına yeni kullanıcıyı oluştur
            const newUser = await prisma.user.create({
              data: {
                name: user.name!,
                email: user.email!,
                role: UserRole.USER,
              },
            });
            // Yeni kullanıcının bilgilerini token'a ekle
            token.id = newUser.id;
            token.name = newUser.name;
            token.role = newUser.role;
            // Yeni kullanıcı için hoşgeldiniz emaili gönder
            await sendMail(
              newUser.email,
              newUser.name,
              "Hoşgeldiniz",
              "welcome"
            );
          }
        } catch (error) {
          console.error("JWT callback veritabanı hatası:", error);
          // Hata durumunda token'a bir hata bilgisi ekleyebilir veya boş döndürebilirsiniz.
        }
      }

      // Sonraki tüm isteklerde, bu zenginleştirilmiş token geri döndürülür.
      return token;
    },

    // DEĞİŞTİ: session callback'i artık çok daha basit.
    // Görevi sadece token'daki bilgileri session'a kopyalamak.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        // Rol bilgisini de session'a ekleyelim ki client tarafında kullanabilelim.
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};
