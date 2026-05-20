import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { productsQuery } from "~/queries/products";

export function meta() {
  return [{ title: "Products — yellowbirds Admin" }];
}

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useQuery(productsQuery);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.mainImageUrl ? (
                        <img src={p.mainImageUrl} alt={p.name} className="h-10 w-10 rounded-lg object-cover border" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg border bg-muted/40 flex items-center justify-center text-[10px] text-muted-foreground">IMG</div>
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.categoryName}</td>
                  <td className="px-4 py-3">${p.salePrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.productColor}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}`}>
                      <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No products yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
