// components/dashboard/AddressFormDialog.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Address } from "@/types";

interface AddressFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (
    formData: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  editingAddress: Address | null;
}

const emptyForm: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt"> = {
  addressTitle: "",
  ulke: "",
  sehir: "",
  mahalle: "",
  sokak: "",
  no: "",
  postaKodu: "",
  tarif: "",
  varsayilan: false,
};

export default function AddressFormDialog({
  isOpen,
  onOpenChange,
  onSave,
  editingAddress,
}: AddressFormDialogProps) {
  const [addressForm, setAddressForm] = useState(emptyForm);

  useEffect(() => {
    if (editingAddress) {
      setAddressForm(editingAddress);
    } else {
      setAddressForm(emptyForm);
    }
  }, [editingAddress, isOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setAddressForm((prev) => ({ ...prev, varsayilan: checked }));
  };

  const handleSaveClick = () => {
    onSave(addressForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            {editingAddress
              ? "Update your address information below."
              : "Add a new address to your account."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Form fields... (Copied from the original component) */}
          <div className="grid gap-2">
            <Label htmlFor="addressTitle">Address Title</Label>
            <Input
              id="addressTitle"
              value={addressForm.addressTitle}
              onChange={handleFormChange}
              placeholder="e.g., Home, Office"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ulke">Country</Label>
              <Input
                id="ulke"
                value={addressForm.ulke}
                onChange={handleFormChange}
                placeholder="Turkey"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sehir">City</Label>
              <Input
                id="sehir"
                value={addressForm.sehir}
                onChange={handleFormChange}
                placeholder="Istanbul"
              />
            </div>
          </div>
          {/* Add all other input fields here in the same pattern... */}
          <div className="flex items-center space-x-2">
            <Switch
              id="varsayilan"
              checked={addressForm.varsayilan}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="varsayilan">Set as default address</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
