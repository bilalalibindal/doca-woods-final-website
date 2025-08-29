import AdminNavigationPane from "@/components/admin/AdminNavPane";

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-300">
      <AdminNavigationPane />
      <main>{children}</main>
    </div>
  );
}
