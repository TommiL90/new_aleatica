import { cn } from "@/lib/utils";

interface PProps {
  children: React.ReactNode;
  className?: string;
}

export function P({ children, className }: PProps) {
  return (
    <p className={cn("not-first:mt-4 leading-7", className)}>{children}</p>
  );
}
