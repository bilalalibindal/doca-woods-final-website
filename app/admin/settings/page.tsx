import React, { Suspense } from "react";
import { getSettings } from "@/lib/services";
import SettingsForm from "@/components/admin/settings-form";
import { LoadingSkeleton } from "@/components/ui/loading";

// Settings verilerini getiren async component
async function SettingsData() {
  const settings = await getSettings();
  return <SettingsForm initialSettings={settings} />;
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-6 py-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <SettingsData />
        </Suspense>
      </div>
    </div>
  );
}
