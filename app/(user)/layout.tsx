// Header component import'u kaldırıldı - kullanılmıyor
import { Toaster } from "sonner";

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
      <Toaster
        toastOptions={{
          duration: 2000,
        }}
        position="bottom-right"
        expand={true}
        closeButton
      />
    </>
  );
}
