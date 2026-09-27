"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../utils/utils";

// Track (h-5 w-9, 2px border) and thumb (h-4 w-4, translate-x-4) are sized so
// the thumb exactly fills the track's inner height with no border-radius
// mismatch — the previous version's caller passed an invalid `h-4.5`
// utility (not a real Tailwind value), which silently no-opped and left a
// too-small thumb loose inside an oversized track. Colors default to the
// shared --filter-* theme variables so it matches the rest of the filter UI
// without every caller having to restate them.
const Switch = React.forwardRef(({ className, thumbStyle, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-[var(--filter-text-placeholder,#9ca3af)] data-[state=checked]:bg-[var(--filter-primary,#0e7490)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        thumbStyle
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
