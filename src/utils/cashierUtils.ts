import { CartItem, Product, ProductCategory } from '../types/cashier';

export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function calculateSubtotal(cartItems: CartItem[]): number {
  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    subtotal += item.product.price * item.quantity;
  }
  return subtotal;
}

export function calculateTotalItems(cartItems: CartItem[]): number {
  let count = 0;
  for (let i = 0; i < cartItems.length; i++) {
    count += cartItems[i].quantity;
  }
  return count;
}

export function calculateTax(subtotal: number, taxRate: number = 0.11): number {
  return Math.round(subtotal * taxRate);
}

export function calculateGrandTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function calculateChange(cashPaid: number, grandTotal: number): number {
  if (cashPaid <= grandTotal) {
    return 0;
  }
  return cashPaid - grandTotal;
}

export function filterProducts(
  products: Product[],
  selectedCategory: ProductCategory,
  searchQuery: string
): Product[] {
  const query = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchCategory =
      selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      Boolean(product.external?.category.toLowerCase().includes(query));

    return matchCategory && matchSearch;
  });
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}

/**
 * Format tanggal dan waktu untuk struk transaksi
 */
export function formatTransactionDate(date: Date = new Date()): string {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}`;
}
