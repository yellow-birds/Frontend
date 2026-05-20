import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { api } from "~/lib/api";
import { categoriesQuery, type CategoryResponse } from "~/queries/categories";
import { Button } from "~/components/ui/button";

export function meta() {
  return [{ title: "Categories — yellowbirds Admin" }];
}

interface CategoryForm {
  name: string;
  code: string;
}

const empty: CategoryForm = { name: "", code: "" };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery(categoriesQuery);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [form, setForm] = useState<CategoryForm>(empty);

  const { mutate: save, isPending: isSaving, error: saveError } = useMutation({
    mutationFn: (data: CategoryForm) => {
      const payload = { name: data.name.trim(), code: data.code.trim() };
      return editing
        ? api.put(`/api/categories/${editing.id}`, payload)
        : api.post("/api/categories", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
      setEditing(null);
      setForm(empty);
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  function openNew() {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  }

  function openEdit(cat: CategoryResponse) {
    setEditing(cat);
    setForm({ name: cat.name, code: cat.code });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save(form);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openNew} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editing ? "Edit Category" : "New Category"}</h2>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. T-shirts"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g. TSHIRTS"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={isSaving} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
                <Check className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditing(null); setForm(empty); }}>
                Cancel
              </Button>
            </div>
          </form>
          {saveError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {(saveError as { message: string }).message}
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{cat.code}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => { if (confirm(`Delete "${cat.name}"?`)) remove(cat.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    No categories yet. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
