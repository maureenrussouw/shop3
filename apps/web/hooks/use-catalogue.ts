// apps/web/hooks/use-catalogue.ts
import { useQuery } from "@tanstack/react-query";

export interface CatalogueProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compare_at_price: number;
  // A JSON column, so a product created before the field existed has null
  // here, not an empty array. Every render site has to guard it.
  images: Array<{ url: string; name: string; thumbnail_url?: string }> | null;
}

interface Page<T> {
  data: T[];
  meta: { total: number; page: number; page_size: number; pages: number };
}

// NEXT_PUBLIC_API_URL is an ORIGIN, not a base path. The generated
// apps/web/lib/api.ts reads the same variable, and the CSP in next.config.ts is
// derived from it, so putting "/api/v1" in the value breaks both.
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

/**
 * One fetch for the whole public surface.
 *
 * Every hook below goes through it, so the key header, the base path and the
 * error handling are written once. The alternative is the same six lines copied
 * into five hooks, and a header that gets forgotten in the fifth.
 */
async function get<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const query = new URLSearchParams(params);
  // The publishable key, not a bearer token. There is no user here.
  const res = await fetch(`${API}/api/v1/public/${path}?${query}`, {
    headers: { "X-API-Key": KEY },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function useCatalogue(params: { page?: number; search?: string } = {}) {
  const query: Record<string, string> = {
    page: String(params.page ?? 1),
    page_size: "24",
  };
  if (params.search) query.search = params.search;

  return useQuery({
    queryKey: ["catalogue", query],
    queryFn: () => get<Page<CatalogueProduct>>("products", query),
  });
}
