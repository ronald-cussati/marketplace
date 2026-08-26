"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  mensagem: string;
  tipo: ToastType;
}

interface ToastContextType {
  toast: (mensagem: string, tipo?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (mensagem: string, tipo: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, mensagem, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 ${
              t.tipo === "success"
                ? "bg-primary-900/90 text-primary-50 border-primary-500/30"
                : t.tipo === "error"
                ? "bg-red-900/90 text-red-50 border-red-500/30"
                : "bg-slate-900/90 text-slate-50 border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {t.tipo === "success" && <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0" />}
              {t.tipo === "error" && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              {t.tipo === "info" && <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />}
              <span>{t.mensagem}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser utilizado dentro de um ToastProvider");
  }
  return context;
}
