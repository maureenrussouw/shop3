// apps/web/components/shop/product-grid-skeleton.tsx
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="mb-2 aspect-[3/2] w-full animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
        </div>
      ))}
      <span className="sr-only">Loading products</span>
    </div>
  );
}