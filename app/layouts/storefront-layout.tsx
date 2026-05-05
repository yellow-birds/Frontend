import { Outlet } from "react-router";
import { Navbar } from "~/components/storefront/navbar";
import { Footer } from "~/components/storefront/footer";
import { QueryProvider } from "~/components/providers/query-provider";
import { AuthHydrator } from "~/components/providers/auth-hydrator";

export default function StorefrontLayout() {
  return (
    <QueryProvider>
      <AuthHydrator />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryProvider>
  );
}
