export function P({ children }: { children: React.ReactNode }) {
  return <p className="not-first:mt-4 leading-7">{children}</p>;
}
