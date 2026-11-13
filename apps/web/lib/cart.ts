// apps/web/lib/cart.ts
import { store } from "@simplestack/store";
import type { CatalogueProduct } from "@/hooks/use-catalogue";

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const STORAGE_KEY = "shopfront.cart";

// Starts empty, on the server and on the client's first render alike.
// Step 5 explains why that matters more than it looks.
export const cartStore = store<CartLine[]>([]);

// Takes the catalogue shape, not the full Product from @repo/shared.
// The storefront never holds a full Product: the public endpoint publishes a
// narrower struct on purpose, and typing this against the admin model gives you
//   TS2739: Type 'CatalogueProduct' is missing the following properties
//   from type 'Product': stock, category_id, active, created_at, updated_at
export function addToCart(product: CatalogueProduct, quantity = 1) {
  cartStore.set((lines) => {
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) {
      return lines.map((l) =>
        l.productId === product.id
          ? { ...l, quantity: l.quantity + quantity }
          : l,
      );
    }
    return [
      ...lines,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        // The thumbnail, not the full image: a cart row draws it at about
        // sixty pixels.
        image: product.images?.[0]?.thumbnail_url ?? product.images?.[0]?.url,
        quantity,
      },
    ];
  });
}

export function setQuantity(productId: string, quantity: number) {
  cartStore.set((lines) =>
    quantity <= 0
      ? lines.filter((l) => l.productId !== productId)
      : lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
  );
}

export function removeFromCart(productId: string) {
  cartStore.set((lines) => lines.filter((l) => l.productId !== productId));
}

export function clearCart() {
  cartStore.set([]);
}

// Reads the saved cart and starts persisting. Call once, after mount.
//
// Returns an unsubscribe, so a fast refresh in development does not leave two
// subscriptions writing the same key.
export function hydrateCart(): () => void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) cartStore.set(JSON.parse(raw) as CartLine[]);
  } catch {
    // A corrupt or unreadable cart is not worth breaking the page over. The
    // customer gets an empty one and can carry on shopping, which is the
    // failure mode you want in a shop.
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return cartStore.subscribe((lines) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  });
}

// Derived values are plain functions, because they are plain functions.
export function subtotalOf(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function countOf(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
