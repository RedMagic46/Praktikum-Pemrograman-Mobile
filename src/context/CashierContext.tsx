import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Transaction, PaymentMethod, TransactionItem } from '../types/cashier';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  calculateSubtotal,
  calculateTax,
  calculateGrandTotal,
  calculateChange,
  generateInvoiceNumber,
  formatTransactionDate,
} from '../utils/cashierUtils';

interface CashierContextType {
  products: Product[];
  cart: CartItem[];
  lastTransaction: Transaction | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  completeCheckout: (paymentMethod: PaymentMethod, cashPaid: number) => Transaction;
  resetTransaction: () => void;
  // Fungsi Manajemen Inventory
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: number) => void;
  adjustStock: (productId: number, delta: number) => void;
}

const CashierContext = createContext<CashierContextType | undefined>(undefined);

interface CashierProviderProps {
  children: ReactNode;
}

export function CashierProvider({ children }: CashierProviderProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  /**
   * Custom function untuk menambah produk ke keranjang belanja
   */
  function addToCart(product: Product): void {
    if (product.stock <= 0) {
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        // Cek apakah quantity melebihi stok yang ada
        if (prevCart[existingIndex].quantity >= product.stock) {
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  }

  /**
   * Custom function untuk menghapus produk dari keranjang
   */
  function removeFromCart(productId: number): void {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }

  /**
   * Custom function untuk mengubah quantity item (+1 atau -1)
   */
  function updateQuantity(productId: number, delta: number): void {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            // Cegah menambah kuantitas melebihi batas stok produk
            if (delta > 0 && newQty > item.product.stock) {
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }

  /**
   * Mengosongkan keranjang belanja
   */
  function clearCart(): void {
    setCart([]);
  }

  /**
   * Menyelesaikan transaksi pembayaran kasir, memotong stok, dan mencatat struk
   */
  function completeCheckout(paymentMethod: PaymentMethod, cashPaid: number): Transaction {
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const grandTotal = calculateGrandTotal(subtotal, tax);
    const change = calculateChange(cashPaid, grandTotal);

    // Potong stok produk di katalog secara otomatis sesuai jumlah yang terjual
    setProducts((currentProducts) =>
      currentProducts.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          const newStock = Math.max(0, p.stock - cartMatch.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Konversi keranjang menjadi item transaksi
    const transactionItems: TransactionItem[] = cart.map((cartItem) => ({
      id: cartItem.product.id,
      name: cartItem.product.name,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      subtotal: cartItem.product.price * cartItem.quantity,
    }));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      date: formatTransactionDate(new Date()),
      items: transactionItems,
      subtotal,
      tax,
      total: grandTotal,
      paymentMethod,
      cashPaid,
      change,
      cashierName: 'Ahmad (Kasir 01)',
    };

    setLastTransaction(newTransaction);
    setCart([]); // Kosongkan keranjang setelah checkout sukses
    return newTransaction;
  }

  function resetTransaction(): void {
    setLastTransaction(null);
  }

  // ==========================================
  // FUNGSI MANAJEMEN INVENTORY & MENU
  // ==========================================

  /**
   * Menambahkan menu produk baru ke inventory
   */
  function addProduct(newProductData: Omit<Product, 'id'>): void {
    setProducts((currentProducts) => {
      const nextId =
        currentProducts.length > 0
          ? Math.max(...currentProducts.map((p) => p.id)) + 1
          : 1;

      const newProduct: Product = {
        ...newProductData,
        id: nextId,
      };

      return [newProduct, ...currentProducts];
    });
  }

  /**
   * Mengubah detail produk (nama, harga, kategori, stok, deskripsi)
   */
  function updateProduct(updatedProduct: Product): void {
    setProducts((currentProducts) =>
      currentProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    // Sinkronkan juga pada produk di keranjang jika ada
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === updatedProduct.id
          ? {
              ...item,
              product: updatedProduct,
              quantity: Math.min(item.quantity, updatedProduct.stock),
            }
          : item
      ).filter((item) => item.quantity > 0)
    );
  }

  /**
   * Menghapus produk dari inventory
   */
  function deleteProduct(productId: number): void {
    setProducts((currentProducts) =>
      currentProducts.filter((p) => p.id !== productId)
    );
    // Hapus juga dari keranjang jika sedang dimasukkan
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId)
    );
  }

  /**
   * Menyesuaikan stok produk secara cepat (+ atau -)
   */
  function adjustStock(productId: number, delta: number): void {
    setProducts((currentProducts) =>
      currentProducts.map((p) => {
        if (p.id === productId) {
          const updatedStock = Math.max(0, p.stock + delta);
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );
  }

  return (
    <CashierContext.Provider
      value={{
        products,
        cart,
        lastTransaction,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        completeCheckout,
        resetTransaction,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
      }}
    >
      {children}
    </CashierContext.Provider>
  );
}

export function useCashier(): CashierContextType {
  const context = useContext(CashierContext);
  if (!context) {
    throw new Error('useCashier must be used within a CashierProvider');
  }
  return context;
}
