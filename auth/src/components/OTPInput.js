import React, { useRef, useState, useEffect } from "react";
import { cn } from "@ankamala/core";

/**
 * OTPInput
 *
 * A 6-digit OTP input rendered as individual boxes.
 * Uses an uncontrolled internal state; calls onChange with the
 * concatenated string whenever the value changes.
 *
 * @param {object}   props
 * @param {number}   [props.length=6]        - Number of OTP digits
 * @param {function} props.onChange           - (otp: string) => void  — called on every change
 * @param {function} [props.onComplete]       - (otp: string) => void  — called when all digits filled
 * @param {boolean}  [props.disabled=false]
 * @param {boolean}  [props.error=false]      - Triggers red border styling
 * @param {string}   [props.className]
 * @param {string}   [props.value]            - Controlled value (optional)
 */
function OTPInput({
  length = 6,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className,
  value: controlledValue,
}) {
  const [digits, setDigits] = useState(
    () =>
      (controlledValue || "")
        .slice(0, length)
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length)
  );
  const inputs = useRef([]);

  // Sync if controlled value changes externally
  useEffect(() => {
    if (controlledValue !== undefined) {
      const next = controlledValue
        .slice(0, length)
        .split("")
        .concat(Array(length).fill(""))
        .slice(0, length);
      setDigits(next);
    }
  }, [controlledValue, length]);

  const emitChange = (next) => {
    const otp = next.join("");
    if (typeof onChange === "function") onChange(otp);
    if (otp.length === length && !next.includes("") && typeof onComplete === "function") {
      onComplete(otp);
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1); // digits only, last char
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    emitChange(next);
    if (val && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (!digits[idx] && idx > 0) {
        inputs.current[idx - 1]?.focus();
      }
      const next = [...digits];
      next[idx] = "";
      setDigits(next);
      emitChange(next);
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = pasted.split("").concat(Array(length).fill("")).slice(0, length);
    setDigits(next);
    emitChange(next);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className={cn("flex items-center gap-2", className)} onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          disabled={disabled}
          className={cn(
            "w-11 h-12 rounded-lg border text-center text-lg font-semibold",
            "focus:outline-none focus:ring-2 transition-colors caret-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-400 focus:ring-red-300 text-red-800 bg-red-50"
              : "border-gray-300 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-900"
          )}
          aria-label={`OTP digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}

export default OTPInput;