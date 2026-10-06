import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './screens/DashboardScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import HistoryScreen from './screens/HistoryScreen';
import InventoryScreen from './screens/InventoryScreen';
import AddMenuScreen from './screens/AddMenuScreen';
import EditMenuScreen from './screens/EditMenuScreen';
import initialProducts from './data/products';

const Stack = createStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#050505',
    text: '#FFFFFF',
  },
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState(initialProducts);

  function addProduct(product) {
    setProducts((currentProducts) => [
      ...currentProducts,
      { ...product, id: Math.max(0, ...currentProducts.map((item) => item.id)) + 1 },
    ]);
  }

  function updateProduct(updatedProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === updatedProduct.id
          ? {
              ...item,
              name: updatedProduct.name,
              price: updatedProduct.price,
              category: updatedProduct.category,
            }
          : item
      )
    );
  }

  function deleteProduct(productId) {
    setProducts((currentProducts) =>
      currentProducts.filter((item) => item.id !== productId)
    );
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  function addTransaction(newTransaction) {
    setTransactions([...transactions, newTransaction]);
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#050505', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
          headerTintColor: '#CCFF00',
          headerTitleStyle: { fontWeight: '900', letterSpacing: 1 },
          cardStyle: { backgroundColor: '#050505' }
        }}
      >
        <Stack.Screen name="Dashboard" options={{ title: 'KASIRKU.' }}>
          {(props) => <DashboardScreen {...props} transactions={transactions} />}
        </Stack.Screen>
        
        <Stack.Screen name="Produk" options={{ title: 'PRODUK' }}>
          {(props) => <ProductScreen {...props} products={products} cart={cart} setCart={setCart} />}
        </Stack.Screen>

        <Stack.Screen name="Inventory" options={{ title: 'INVENTORY' }}>
          {(props) => <InventoryScreen {...props} products={products} />}
        </Stack.Screen>

        <Stack.Screen name="Tambah Menu" options={{ title: 'TAMBAH MENU' }}>
          {(props) => <AddMenuScreen {...props} addProduct={addProduct} />}
        </Stack.Screen>

        <Stack.Screen name="Edit Menu" options={{ title: 'EDIT MENU' }}>
          {(props) => (
            <EditMenuScreen
              {...props}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Keranjang" options={{ title: 'KERANJANG' }}>
          {(props) => <CartScreen {...props} cart={cart} setCart={setCart} />}
        </Stack.Screen>
        
        <Stack.Screen name="Checkout" options={{ title: 'CHECKOUT' }}>
          {(props) => <CheckoutScreen {...props} cart={cart} setCart={setCart} addTransaction={addTransaction} />}
        </Stack.Screen>
        
        <Stack.Screen name="Struk" options={{ title: 'RECEIPT', headerLeft: () => null }}>
          {(props) => <ReceiptScreen {...props} />}
        </Stack.Screen>
        
        <Stack.Screen name="Riwayat" options={{ title: 'HISTORY' }}>
          {(props) => <HistoryScreen {...props} transactions={transactions} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
