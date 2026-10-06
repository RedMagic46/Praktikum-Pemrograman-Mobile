// Definisi tipe dan interface TypeScript untuk KasirKu (Sesuai Modul 1)

export type ProductCategory = 'Semua' | 'Makanan' | 'Minuman' | 'Snack' | 'Paket';

export type PaymentMethod = 'TUNAI' | 'QRIS' | 'DEBIT';

export interface Product {
  readonly id: number;
  name: string;
  price: number;
  category: ProductCategory;
  stock: number;
  description: string;
  iconName: string; // Nama icon dari Ionicons untuk representasi visual
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  date: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashPaid: number;
  change: number;
  cashierName: string;
}

export interface CategoryItem {
  id: string;
  name: ProductCategory;
  icon: string;
}
