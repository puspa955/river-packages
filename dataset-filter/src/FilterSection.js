import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FilterSection = ({ label, isNested = false, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const HeadingTag = isNested ? 'h4' : 'h3';
  const headingClass = isNested
    ? "text-xs font-medium text-gray-700 pb-2"
    : "text-[13px] font-semibold text-gray-800 tracking-wide uppercase pb-2";

  const containerClass = isNested ? "" : " mb-3 border-b border-gray-200";

  return (
    <div className={containerClass}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between group"
      >
        <HeadingTag className={headingClass}>{label}</HeadingTag>
        <ChevronDown className={`w-5 h-5 text-gray-600 hover:text-primary-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && <div className="mb-3 space-y-0.5">{children}</div>}
    </div>
  );
};
