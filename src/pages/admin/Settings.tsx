
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useCoupon } from "@/context/CouponContext";
import { toast } from "sonner";
import { Save } from "lucide-react";
import BeginnersGuide from "@/components/settings/BeginnersGuide";
import StoreInfoSection from "@/components/settings/StoreInfoSection";
import DeliverySettingsSection from "@/components/settings/DeliverySettingsSection";
import MessagesSection from "@/components/settings/MessagesSection";
import SocialMediaSection from "@/components/settings/SocialMediaSection";
import CouponsSection from "@/components/settings/CouponsSection";
import { Coupon } from "@/types";

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const { coupons, updateCoupon, addCoupon, deleteCoupon } = useCoupon();
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
    customCakeMessage: settings.customCakeMessage || "",
    announcements: settings.announcements || [],
    instagram: settings.socialMedia?.instagram || "",
    whatsapp: settings.socialMedia?.whatsapp || ""
  });

  // Corrigindo o manipulador de eventos para tratar corretamente diferentes tipos de inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Verifica se é um campo numérico
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value) || 0,
      }));
    } else {
      // Para campos de texto normais
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAnnouncementAdd = () => {
    setFormData((prev) => ({
      ...prev,
      announcements: [...prev.announcements, ""]
    }));
  };

  const handleAnnouncementChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedAnnouncements = [...prev.announcements];
      updatedAnnouncements[index] = value;
      return {
        ...prev,
        announcements: updatedAnnouncements
      };
    });
  };

  const handleAnnouncementRemove = (index: number) => {
    setFormData((prev) => {
      const updatedAnnouncements = prev.announcements.filter((_, i) => i !== index);
      return {
        ...prev,
        announcements: updatedAnnouncements
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare socialMedia object
    const socialMedia = {
      instagram: formData.instagram,
      whatsapp: formData.whatsapp
    };
    
    // Filter out empty announcements
    const filteredAnnouncements = formData.announcements.filter(ann => ann.trim() !== "");
    
    // Update settings
    updateSettings({
      ...settings,
      storeName: formData.storeName,
      whatsappNumber: formData.whatsappNumber,
      deliveryFee: formData.deliveryFee,
      freeDeliveryThreshold: formData.freeDeliveryThreshold,
      welcomeMessage: formData.welcomeMessage,
      footerMessage: formData.footerMessage,
      customCakeMessage: formData.customCakeMessage,
      announcements: filteredAnnouncements,
      socialMedia
    });
    
    toast.success("Configurações salvas com sucesso!");
  };

  const handleCouponAdd = (coupon: Coupon) => {
    addCoupon(coupon);
    toast.success(`Cupom ${coupon.code} criado com sucesso!`);
  };

  const handleCouponUpdate = (coupon: Coupon) => {
    updateCoupon(coupon);
    toast.success(`Cupom ${coupon.code} atualizado com sucesso!`);
  };

  const handleCouponDelete = (code: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cupom ${code}?`)) {
      deleteCoupon(code);
      toast.success(`Cupom ${code} excluído com sucesso!`);
    }
  };

  return (
    <AdminLayout title="Configurações da Loja">
      <div className="space-y-6">
        <BeginnersGuide />

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <StoreInfoSection
              storeName={formData.storeName}
              whatsappNumber={formData.whatsappNumber}
              onInputChange={handleInputChange}
            />

            <DeliverySettingsSection
              deliveryFee={formData.deliveryFee}
              freeDeliveryThreshold={formData.freeDeliveryThreshold}
              onInputChange={handleInputChange}
            />

            <CouponsSection 
              coupons={coupons}
              onCouponAdd={handleCouponAdd}
              onCouponUpdate={handleCouponUpdate}
              onCouponDelete={handleCouponDelete}
            />

            <MessagesSection
              welcomeMessage={formData.welcomeMessage}
              footerMessage={formData.footerMessage}
              customCakeMessage={formData.customCakeMessage}
              announcements={formData.announcements}
              onInputChange={handleInputChange}
              onAnnouncementAdd={handleAnnouncementAdd}
              onAnnouncementChange={handleAnnouncementChange}
              onAnnouncementRemove={handleAnnouncementRemove}
            />

            <SocialMediaSection
              instagram={formData.instagram}
              whatsapp={formData.whatsapp}
              onInputChange={handleInputChange}
            />

            <Button type="submit" className="flex items-center gap-2 ml-auto">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
