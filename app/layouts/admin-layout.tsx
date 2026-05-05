import { Outlet, redirect } from "react-router";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { QueryProvider } from "~/components/providers/query-provider";
import { isAdmin } from "~/lib/auth";

export function clientLoader() {
  if (!isAdmin()) throw redirect("/login");
  return null;
}

export default function AdminLayout() {
  return (
    <QueryProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
