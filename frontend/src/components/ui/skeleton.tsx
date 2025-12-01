import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  rows = 1,
  ...props
}: React.ComponentProps<"div"> & { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          data-slot="skeleton"
          className={cn("bg-accent animate-pulse rounded-md", className)}
          {...props}
        />
      ))}
    </>
  );
}

export { Skeleton };
