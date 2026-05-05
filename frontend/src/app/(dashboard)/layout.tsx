import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 md:p-8 flex-1 overflow-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
