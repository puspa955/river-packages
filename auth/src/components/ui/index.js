import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";

// ─── cn utility (mirrors core if not importing from @ankamala/core) ───────────
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// ─── Label ────────────────────────────────────────────────────────────────────
export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = React.forwardRef(
  ({ className, type = "text", error, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white",
        "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        error
          ? "border-red-400 focus-visible:ring-red-300 text-red-900"
          : "border-gray-300 focus-visible:ring-blue-400 focus-visible:border-blue-400",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ─── Button ───────────────────────────────────────────────────────────────────
const buttonVariants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-400",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400",
  ghost:
    "text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-blue-400",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium",
          "ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2",
          "disabled:pointer-events-none disabled:opacity-50 w-full",
          buttonVariants[variant] || buttonVariants.primary,
          sizeClasses[size] || sizeClasses.md,
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// ─── FormField ────────────────────────────────────────────────────────────────
export function FormField({ label, error, children, required, className }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── AuthCard ─────────────────────────────────────────────────────────────────
export function AuthCard({ title, subtitle, children, className, footer }) {
  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      {children}
      {footer && (
        <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
      )}
    </div>
  );
}

// ─── AlertBanner ──────────────────────────────────────────────────────────────
export function AlertBanner({ type = "error", message, className }) {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icons = {
    error: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    ),
    success: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ),
    info: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    ),
  };

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border p-3 text-sm",
        styles[type],
        className
      )}
    >
      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        {icons[type]}
      </svg>
      <span>{message}</span>
    </div>
  );
}