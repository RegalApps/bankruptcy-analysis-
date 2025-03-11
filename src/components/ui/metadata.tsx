
import React from "react";
import { cn } from "@/lib/utils";

interface MetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: string; value: React.ReactNode }[];
  layout?: "grid" | "flex";
}

export function Metadata({
  items,
  layout = "grid",
  className,
  ...props
}: MetadataProps) {
  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4"
          : "flex flex-wrap gap-4",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-sm font-medium">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
