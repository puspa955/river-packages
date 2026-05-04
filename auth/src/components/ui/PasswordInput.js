import React, { useState } from "react";

/**
 * PasswordInput
 *
 * A reusable password field with show/hide toggle.
 * Compatible with react-hook-form (forwarded ref + props spread).
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.error]
 * @param {boolean} [props.disabled]
 * @param {string} [props.placeholder]
 */
const PasswordInput = React.forwardRef(function PasswordInput(
  {
    className = "",
    error = false,
    disabled = false,
    placeholder = "Enter password",
    ...props
  },
  ref
) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full pr-10 px-3 py-2 border rounded-md outline-none
          transition
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          focus:ring-2 focus:ring-blue-500
          ${className}
        `}
        {...props}
      />

      {/* toggle button */}
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        disabled={disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-black"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
});

export default PasswordInput;