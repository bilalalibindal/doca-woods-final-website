import { TrashIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "react";

// Standart button elementinin tüm proplarını alabilmesi için ComponentProps kullanıyoruz.
type TrashButtonProps = ComponentProps<"button">;

const TrashButton = ({ className, ...props }: TrashButtonProps) => {
  return (
    <button
      {...props} // onClick, disabled gibi propları buraya aktarır
      className={`w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all flex items-center justify-center ${className}`}
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
};

export default TrashButton;
