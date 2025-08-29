"use client";

import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { SortOption } from "@/types/productTypes";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "new", label: "En Yeni" },
  { value: "price_asc", label: "Fiyat (Artan)" },
  { value: "price_desc", label: "Fiyat (Azalan)" },
  { value: "name_asc", label: "İsim (A-Z)" },
  { value: "name_desc", label: "İsim (Z-A)" },
];

export default function ProductSort({ value, onChange }: ProductSortProps) {
  const selected =
    SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Sırala:</span>
      <Listbox value={value} onChange={onChange}>
        <div className="relative min-w-[200px]">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-amber-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus-visible:border-amber-600 focus-visible:ring-1 focus-visible:ring-amber-600">
            <span className="block truncate text-gray-800">
              {selected.label}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-amber-200 bg-white py-1 text-sm shadow-lg focus:outline-none">
              {SORT_OPTIONS.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-50 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={opt.value}
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          isSelected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {opt.label}
                      </span>
                      {isSelected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-700">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
