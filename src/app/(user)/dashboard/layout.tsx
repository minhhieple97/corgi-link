import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <main className="flex-1 bg-background w-full">
        <div className="container max-w-7xl mx-auto py-4 lg:py-6 px-4 sm:px-6 lg:px-8 w-full">
          <div className="w-full max-w-full overflow-hidden">{children}</div>
        </div>
      </main>
    </div>
  );
}
