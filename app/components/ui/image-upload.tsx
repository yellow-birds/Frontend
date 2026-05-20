import { useRef, useState } from "react";
import { ImagePlus, LinkIcon, X, Upload, AlertCircle } from "lucide-react";

interface Props {
  value: string;       // actual URL stored in the form (never base64)
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: Props) {
  const [tab, setTab] = useState<"drop" | "url">("drop");
  const [dragging, setDragging] = useState(false);
  // localPreview holds a temporary blob/base64 preview — never sent to the API
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = value || localPreview;

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    // Do NOT call onChange — file can't be sent to the API directly
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleUrlApply() {
    const url = urlInput.trim();
    onChange(url);
    setLocalPreview(null);
  }

  function clear() {
    onChange("");
    setLocalPreview(null);
    setUrlInput("");
  }

  if (preview) {
    const isLocalOnly = !!localPreview && !value;
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <img src={preview} alt="Product preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 h-7 w-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        {isLocalOnly && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-800">Local preview only — enter a URL to save</p>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlApply())}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-colors"
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setTab("drop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "drop" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="h-3.5 w-3.5" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            tab === "url" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" /> Paste URL
        </button>
      </div>

      {tab === "drop" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? "border-yellow-400 bg-yellow-50"
              : "border-gray-200 bg-gray-50 hover:border-yellow-400 hover:bg-yellow-50/50"
          }`}
        >
          <ImagePlus className={`h-8 w-8 ${dragging ? "text-yellow-500" : "text-gray-300"}`} />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">
              {dragging ? "Drop it!" : "Drag & drop to preview"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — then paste the hosted URL</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlApply())}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            disabled={!urlInput.trim()}
            className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black text-sm font-bold transition-colors"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
