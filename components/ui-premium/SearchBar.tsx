import React, { useState } from 'react';

const SearchIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar ejercicio...',
  className = '',
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={[
        'relative group bg-surface-raised rounded-xl px-4 py-2.5 flex items-center gap-3',
        'transition-all duration-200 shadow-inner',
        'focus-within:bg-surface-bg focus-within:ring-1 focus-within:ring-brand-accent/40',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Search icon — cambia a brand-accent en focus */}
      <SearchIcon
        size={18}
        className={[
          'shrink-0 transition-colors duration-200',
          focused ? 'text-brand-accent' : 'text-text-muted',
        ].join(' ')}
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full"
      />

      {/* Clear button — solo visible cuando hay texto */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="shrink-0 text-text-muted hover:text-text-secondary transition-colors duration-150"
          aria-label="Limpiar búsqueda"
        >
          <XIcon size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
