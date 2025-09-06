import { MainHeader } from "@/components/header"; // Header component'inizi import edin

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
