import { AdminSidebar } from "@/components/shared/admin-sidebar";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 w-full">
        <AdminSidebar />
        <main className="flex-1 ml-0 md:ml-64 overflow-auto">
          <div className="container py-6 md:py-8 px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
