"use client";

import {
  PhoneIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface PendingOrdersNotificationProps {
  pendingOrdersCount: number;
}

const PendingOrdersNotification = ({
  pendingOrdersCount,
}: PendingOrdersNotificationProps) => {
  if (pendingOrdersCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
          <ExclamationTriangleIcon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-amber-900 text-lg mb-2 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            {pendingOrdersCount} Siparişiniz Onay Bekliyor
          </h3>

          <p className="text-amber-800 mb-4">
            Ödemenizi yapabilmek için lütfen bizimle iletişime geçin.
            Siparişleriniz onaylandıktan sonra hazırlık sürecine geçecektir.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+905551234567"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>0555 123 45 67</span>
            </a>

            <div className="text-sm text-amber-700">
              <p className="font-medium">Çalışma Saatleri:</p>
              <p>Pazartesi - Cumartesi: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersNotification;
