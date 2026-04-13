import type { HTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return <div className={`rounded-2xl bg-white dark:bg-gray-800 ${className}`.trim()} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={className} {...props} />;
}
