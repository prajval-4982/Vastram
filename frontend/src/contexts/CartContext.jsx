import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from API when user is authenticated
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      setItems(response.data.cart.items.map(item => ({
        id: item.service._id,
        name: item.service.name,
        price: item.price,
        quantity: item.quantity,
        category: item.service.category,
        processingTime: item.service.processingTime
      })));
    } catch (error) {
      console.error('Failed to load cart:', error);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (service) => {
    if (!user) {
      // Fallback to localStorage for non-authenticated users
      setItems(prev => {
        const existingItem = prev.find(item => item.id === service.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === service.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...service, quantity: 1 }];
      });
      return;
    }

    try {
      setError(null);
      const response = await cartAPI.addItem(service.id, 1);
      setItems(response.data.cart.items.map(item => ({
        id: item.service._id,
        name: item.service.name,
        price: item.price,
        quantity: item.quantity,
        category: item.service.category,
        processingTime: item.service.processingTime
      })));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setError('Failed to add item to cart');
    }
  };

  const removeItem = async (id) => {
    if (!user) {
      // Fallback to localStorage for non-authenticated users
      setItems(prev => prev.filter(item => item.id !== id));
      return;
    }

    try {
      setError(null);
      const response = await cartAPI.removeItem(id);
      setItems(response.data.cart.items.map(item => ({
        id: item.service._id,
        name: item.service.name,
        price: item.price,
        quantity: item.quantity,
        category: item.service.category,
        processingTime: item.service.processingTime
      })));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      setError('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!user) {
      // Fallback to localStorage for non-authenticated users
      if (quantity <= 0) {
        setItems(prev => prev.filter(item => item.id !== id));
        return;
      }
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      setError(null);
      const response = await cartAPI.updateItem(id, quantity);
      setItems(response.data.cart.items.map(item => ({
        id: item.service._id,
        name: item.service.name,
        price: item.price,
        quantity: item.quantity,
        category: item.service.category,
        processingTime: item.service.processingTime
      })));
    } catch (error) {
      console.error('Failed to update cart item:', error);
      setError('Failed to update cart item');
    }
  };

  const clearCart = async () => {
    if (!user) {
      // Fallback to localStorage for non-authenticated users
      setItems([]);
      return;
    }

    try {
      setError(null);
      await cartAPI.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError('Failed to clear cart');
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading,
      error,
      clearError,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
