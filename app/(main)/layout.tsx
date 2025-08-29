import { MainHeader } from "@/components/header"; // Header component'inizi import edin

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="py-6">{children}</div>
      </main>
    </>
  );
}
