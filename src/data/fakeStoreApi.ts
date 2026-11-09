/**
 * ============================================================================
 * IMPLEMENTASI MODUL 3 (KRITERIA 2): PRE-BUILT ASYNC FUNCTION & EXTERNAL API
 * ============================================================================
 * Definisi:
 * Pre-built Async Function adalah fungsi asynchronous bawaan yang disediakan
 * oleh environment JavaScript / Web API standard / runtime library.
 *
 * Contoh Pre-built Async Function yang digunakan:
 * 1. `fetch()`: Pre-built async function bawaan JavaScript global API untuk
 *    melakukan HTTP GET request ke web server / REST API secara asynchronous.
 * 2. `response.json()`: Pre-built async function bawaan dari objek Response
 *    untuk membaca aliran data (body stream) dan mem-parsingnya menjadi objek
 *    JavaScript secara asynchronous.
 * ============================================================================
 */

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const FAKE_STORE_USD_TO_IDR = 16000;

export function convertFakeStorePriceToIdr(priceInUsd: number): number {
  return Math.round(priceInUsd * FAKE_STORE_USD_TO_IDR);
}

function isFakeStoreProduct(value: unknown): value is FakeStoreProduct {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const product = value as Record<string, unknown>;
  const rating = product.rating;

  return (
    typeof product.id === 'number' &&
    Number.isInteger(product.id) &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.image === 'string' &&
    !!rating &&
    typeof rating === 'object' &&
    typeof (rating as Record<string, unknown>).rate === 'number' &&
    Number.isFinite((rating as Record<string, unknown>).rate) &&
    typeof (rating as Record<string, unknown>).count === 'number' &&
    Number.isFinite((rating as Record<string, unknown>).count)
  );
}

function isFakeStoreProductList(value: unknown): value is FakeStoreProduct[] {
  return Array.isArray(value) && value.every(isFakeStoreProduct);
}

/**
 * Mengambil data produk eksternal menggunakan Pre-built Async Function:
 * - `fetch()` (Pre-built Async Function untuk HTTP Network Request)
 * - `response.json()` (Pre-built Async Function untuk JSON stream parsing)
 */
export async function fetchFakeStoreProducts(): Promise<FakeStoreProduct[]> {
  // 1. Memanggil Pre-built Async Function: fetch()
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) {
    throw new Error(`Server mengembalikan status ${response.status}.`);
  }

  // 2. Memanggil Pre-built Async Function: response.json()
  const data: unknown = await response.json();
  if (!isFakeStoreProductList(data)) {
    throw new Error('Format data produk dari server tidak sesuai.');
  }

  return data;
}
