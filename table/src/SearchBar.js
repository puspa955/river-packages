import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-sm group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 text-sm border border-slate-300 rounded-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary-500/50"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
