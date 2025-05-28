
import React from "react";
import { BellRing, MapPin } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/context/StoreContext";

const AnnouncementsSection: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="mb-4 sm:mb-6 rounded-xl bg-gray-50 p-3 sm:p-4 space-y-3">
      {settings.announcements && settings.announcements.length > 0 ? (
        settings.announcements.map((announcement, index) => (
          <Alert key={index} className="bg-white border-store-pink/20 animate-fade-in hover-scale transition-all shadow-pop">
            <BellRing className="h-4 w-4 text-store-pink animate-bounce-subtle" />
            <AlertTitle className="text-store-pink font-medium">Aviso</AlertTitle>
            <AlertDescription className="text-gray-700 text-sm">
              {announcement}
            </AlertDescription>
          </Alert>
        ))
      ) : (
        settings.showFreeDeliveryBanner && settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0 && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-store-yellow shadow-md animate-bounce-subtle">
              <MapPin className="h-4 w-4 text-store-pink" />
              {settings.freeDeliveryMessage || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AnnouncementsSection;
