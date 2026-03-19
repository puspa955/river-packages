const icon = (path) =>
  function DsfIcon({ size = 16, style, className = "" }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        className={className}
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };

export const ChevronDownIcon = icon(<polyline points="6 9 12 15 18 9" />);

export const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

export const XIcon = icon(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);

export const SlidersIcon = icon(
  <>
    <line x1="4"  y1="21" x2="4"  y2="14" />
    <line x1="4"  y1="10" x2="4"  y2="3"  />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8"  x2="12" y2="3"  />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3"  />
    <line x1="1"  y1="14" x2="7"  y2="14" />
    <line x1="9"  y1="8"  x2="15" y2="8"  />
    <line x1="17" y1="16" x2="23" y2="16" />
  </>
);

export const LoaderIcon = ({ size = 24, style, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      animation: "dsf-spin 0.75s linear infinite",
      ...style,
    }}
    className={className}
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);