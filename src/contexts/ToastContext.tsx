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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none max-w-[calc(100vw-3rem)] sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs sm:text-sm font-semibold transition-all duration-300 transform animate-in slide-in-from-bottom-4 zoom-in-95 ${
              t.tipo === "success"
                ? "bg-slate-900/95 text-emerald-300 border-emerald-500/30 shadow-emerald-950/30"
                : t.tipo === "error"
                ? "bg-slate-900/95 text-red-300 border-red-500/30 shadow-red-950/30"
                : "bg-slate-900/95 text-amber-300 border-amber-500/30 shadow-amber-950/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.tipo === "success" && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />}
              {t.tipo === "error" && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />}
              {t.tipo === "info" && <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />}
              <span className="text-white font-medium leading-snug">{t.mensagem}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 text-white/50 hover:text-white p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
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
