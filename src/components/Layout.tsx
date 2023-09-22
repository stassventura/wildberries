import React, { createContext, useState, useContext, useEffect } from 'react';
import ProductPage from '../pages/ProductPage';
import Footer from './Footer';
import Header from './Header/index';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import BasketPage from '../pages/BasketPage';
import ReturnPage from '../pages/ReturnPage';
import ErrorPage from '../pages/ErrorPage';

export interface CartProduct {
  id: string;
  name: string;
  price: string; // Цена в формате строки
  oldPrice: string;
  image: string;
  category: string;
  baseOldPrice: string;
  basePrice: string;
  deliveryTerm: string;
  params: {
    [key: string]: string;
  };
  amount: number; // Добавляем это поле

}

export interface CartContextType {
  cart: CartProduct[];
  setCart: React.Dispatch<React.SetStateAction<CartProduct[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Используем функцию для инициализации состояния
  const [cart, setCart] = useState<CartProduct[]>(() => {
    // Пытаемся получить данные из localStorage
    const savedCart = localStorage.getItem('cart');
    // Если данные есть, парсим их и возвращаем. Иначе возвращаем пустой массив.
    return savedCart ? JSON.parse(savedCart) : [];
  });
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}


export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


const Layout = () => {
    
  return (
    <>
        <CartProvider>  
          <Router>
            <Header/>
              <Routes>
                <Route path='/catalog/:id/detail' element={<ProductPage/>}></Route>
                <Route path='/refund/:id' element={<ReturnPage/>}></Route>
                <Route path='/lk/basket' element={<BasketPage/>}></Route>
                <Route path='*' element={<ErrorPage/>}></Route>
              </Routes>
            <Footer/>
          </Router>
        </CartProvider>

    </>
  )
}

export default Layout
