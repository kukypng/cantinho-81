
import React from "react";
import { BellRing, MapPin } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/context/StoreContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AnnouncementsSection: React.FC = () => {
  const { settings } = useStore();

  const hasMultipleAnnouncements = settings.announcements && settings.announcements.length > 1;
  const hasAnnouncements = settings.announcements && settings.announcements.length > 0;
  const showFreeDeliveryBanner = settings.showFreeDeliveryBanner && settings.freeDeliveryThreshold && settings.freeDeliveryThreshold > 0;

  return (
    <div className="mb-4 sm:mb-6 rounded-xl bg-gray-50 p-3 sm:p-4 space-y-3">
      {/* Anúncios principais */}
      {hasAnnouncements && (
        <div className="space-y-3">
          {hasMultipleAnnouncements ? (
            // Carousel para múltiplos anúncios
            <Carousel className="w-full">
              <CarouselContent>
                {settings.announcements!.map((announcement, index) => (
                  <CarouselItem key={index}>
                    <Alert className="bg-white border-store-pink/20 animate-fade-in hover-scale transition-all shadow-pop">
                      <BellRing className="h-4 w-4 text-store-pink animate-bounce-subtle" />
                      <AlertTitle className="text-store-pink font-medium">Aviso</AlertTitle>
                      <AlertDescription className="text-gray-700 text-sm">
                        {announcement}
                      </AlertDescription>
                    </Alert>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {settings.announcements!.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>
          ) : (
            // Anúncio único (comportamento atual)
            <Alert className="bg-white border-store-pink/20 animate-fade-in hover-scale transition-all shadow-pop">
              <BellRing className="h-4 w-4 text-store-pink animate-bounce-subtle" />
              <AlertTitle className="text-store-pink font-medium">Aviso</AlertTitle>
              <AlertDescription className="text-gray-700 text-sm">
                {settings.announcements![0]}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Banner de frete grátis - agora sempre abaixo dos anúncios quando ambos estão ativos */}
      {showFreeDeliveryBanner && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-store-yellow shadow-md animate-bounce-subtle">
            <MapPin className="h-4 w-4 text-store-pink" />
            {settings.freeDeliveryMessage || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsSection;
