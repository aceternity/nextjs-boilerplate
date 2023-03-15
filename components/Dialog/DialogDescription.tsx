import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cn from 'classnames';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", "dark:text-slate-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export default DialogDescription;
