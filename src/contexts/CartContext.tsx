import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  seatTypeId: string;
  seatTypeName: string;
  quantity: number;
  pricePerTicket: number;
  totalPrice: number;
  eventDate: string;
  eventLocation: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemId = `${newItem.eventId}-${newItem.seatTypeId}-${Date.now()}`;
    const cartItem: CartItem = {
      ...newItem,
      id: itemId,
    };

    setItems(prevItems => {
      // Check if same event and seat type already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.eventId === newItem.eventId && item.seatTypeId === newItem.seatTypeId
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          totalPrice: (updatedItems[existingItemIndex].quantity + newItem.quantity) * newItem.pricePerTicket
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.pricePerTicket
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 