"use client";

import { useToastStore, ToastType } from "@/stores/toast";
import { StarIcon, CheckIcon, XIcon } from "./icons";

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckIcon size={14} />,
  info: <StarIcon size={14} filled />,
  warning: <StarIcon size={14} filled />,
  error: <XIcon size={14} />,
};

const colorMap: Record<ToastType, string> = {
  success: "bg-success/15 text-success border-success/30",
  info: "bg-accent/15 text-accent border-accent/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-error/15 text-error border-error/30",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium shadow-lg pointer-events-auto animate-toastIn ${colorMap[toast.type]}`}
          onClick={() => removeToast(toast.id)}
          role="status"
          aria-live="polite"
        >
          {iconMap[toast.type]}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
