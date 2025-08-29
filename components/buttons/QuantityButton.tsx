// components/buttons/QuantityButton.tsx

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "react";

// 'type' prop'unu 'variant' olarak değiştiriyoruz.
interface QuantityButtonProps extends ComponentProps<"button"> {
  variant: "increment" | "decrement";
}

const QuantityButton = ({
  variant,
  className,
  ...props
}: QuantityButtonProps) => {
  // Logic de 'variant' kullanacak şekilde güncellendi.
  const Icon = variant === "increment" ? PlusIcon : MinusIcon;

  return (
    <button
      {...props}
      // Butonun kendi type'ını belirtmek her zaman iyi bir pratiktir.
      // Form içinde değilse 'button' olmalı ki formu submit etmesin.
      type="button"
      className={`w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center justify-center ${className}`}
    >
      <Icon className="w-4 h-4 text-slate-600" />
    </button>
  );
};

export default QuantityButton;
