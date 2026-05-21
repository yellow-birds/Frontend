import { Outlet, redirect } from "react-router";
import { Toaster } from "sonner";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { QueryProvider } from "~/components/providers/query-provider";
import { getToken, isAdmin } from "~/lib/auth";

export function clientLoader() {
  if (!getToken()) throw redirect("/login");
  if (!isAdmin()) throw redirect("/merchandise");
  return null;
}

export default function AdminLayout() {
  return (
    <QueryProvider>
      <Toaster position="top-right" richColors closeButton />
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
