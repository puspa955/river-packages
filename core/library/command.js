"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "../utils/utils";

const CommandLibrary = CommandPrimitive;

const CommandList = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        "max-h-[340px] overflow-y-auto overflow-x-hidden scroll-smooth scroll-padding",
        className
      )}
      {...otherProps}
    />
  );
});
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandInput = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...otherProps}
    />
  );
});
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandItem = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center px-2 py-1.5 text-sm outline-none transition-colors duration-200 ",
        className
      )}
      {...otherProps}
    />
  );
});
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandGroup = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-0 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...otherProps}
    />
  );
});
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef((props, ref) => {
  const { className, ...otherProps } = props;
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-border", className)}
      {...otherProps}
    />
  );
});
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

const CommandDialog = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive.Dialog
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-start justify-center p-4 pt-[25vh] backdrop-blur-md",
      className
    )}
    {...props}
  >
    <div className="w-full max-w-md rounded-md bg-background shadow-lg">
      {props.children}
    </div>
  </CommandPrimitive.Dialog>
));
CommandDialog.displayName = CommandPrimitive.Dialog.displayName;

const CommandEmpty = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center p-4 text-sm text-muted-foreground",
      className
    )}
    {...props}
  >
    No results found.
  </div>
));
CommandEmpty.displayName = "CommandEmpty";

export {
  CommandLibrary,
  CommandList,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
  CommandEmpty,
};
