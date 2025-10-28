import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn, Spinner } from "../utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-700 text-primary-50 shadow hover:bg-primary-800",
        danger: "bg-red-700 text-red-50 shadow-sm hover:bg-red-800",
        outline: "border border-input shadow-sm hover:bg-gray-100",
        secondary:
          "bg-secondary-700 text-secondary-50 shadow-sm hover:bg-secondary-800",
        ghost: "hover:bg-primary-50",
        link: "text-primary-800 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(
  (
    { className, variant, size, asChild = false, loading = false, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const buttonContent = asChild ? (
      <span className="inline-flex items-center">
        {loading && (
          <Spinner className="mr-2 h-4 w-4 animate-spin text-current" />
        )}
        {children}
      </span>
    ) : (
      <>
        {loading && (
          <Spinner className="mr-2 h-4 w-4 animate-spin text-current" />
        )}
        {children}
      </>
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        title={props.title}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };