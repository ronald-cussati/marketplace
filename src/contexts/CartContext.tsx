"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Produto } from "@/types/database";

interface CartContextType {
  items: CartItem[];
  addItem: (produto: Produto, quantidade?: number) => boolean;
  removeItem: (produtoId: string) => void;
  updateQuantity: (produtoId: string, quantidade: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega do localStorage no mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feiralocal_carrinho");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Erro ao ler carrinho:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salva no localStorage quando mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("feiralocal_carrinho", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (produto: Produto, quantidade = 1): boolean => {
    let success = true;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.produto.id === produto.id);

      if (existingIndex > -1) {
        const item = prevItems[existingIndex];
        const novaQtd = item.quantidade + quantidade;

        if (novaQtd > produto.estoque_qtd) {
          success = false;
          return prevItems; // Não ultrapassa estoque
        }

        const newItems = [...prevItems];
        newItems[existingIndex] = { ...item, quantidade: novaQtd };
        return newItems;
      } else {
        if (quantidade > produto.estoque_qtd) {
          success = false;
          return prevItems;
        }
        return [...prevItems, { produto, quantidade }];
      }
    });

    return success;
  };

  const removeItem = (produtoId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.produto.id !== produtoId));
  };

  const updateQuantity = (produtoId: string, quantidade: number): boolean => {
    if (quantidade <= 0) {
      removeItem(produtoId);
      return true;
    }

    let success = true;
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.produto.id === produtoId) {
          if (quantidade > item.produto.estoque_qtd) {
            success = false;
            return item;
          }
          return { ...item, quantidade };
        }
        return item;
      })
    );
    return success;
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
  const subtotal = items.reduce((acc, item) => acc + item.quantidade * Number(item.produto.preco), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser utilizado dentro de um CartProvider");
  }
  return context;
}
