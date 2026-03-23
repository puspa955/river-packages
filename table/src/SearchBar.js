import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full max-w-sm group">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
        style={{ color: 'var(--table-text-muted, #94a3b8)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 text-sm rounded-sm focus:outline-none transition-colors"
        style={{
          border: '1px solid var(--table-input-border, #cbd5e1)',
          backgroundColor: 'var(--table-bg, #ffffff)',
          color: 'var(--table-text-secondary, #334155)',
          '--tw-placeholder-color': 'var(--table-text-muted, #94a3b8)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--table-input-focus, rgba(99, 102, 241, 0.5))';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--table-input-border, #cbd5e1)';
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--table-text-muted, #94a3b8)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--table-text-secondary, #475569)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--table-text-muted, #94a3b8)';
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}