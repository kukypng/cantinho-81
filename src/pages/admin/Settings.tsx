
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
    freeDeliveryEnabled: settings.freeDeliveryThreshold > 0,
    showFreeDeliveryNotice: settings.showFreeDeliveryNotice !== false,
    freeDeliveryNoticeText: settings.freeDeliveryNoticeText || `Entrega Grátis acima de R$ ${settings.freeDeliveryThreshold}`,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
    customCakeMessage: settings.customCakeMessage || "",
    announcements: settings.announcements || [],
    instagram: settings.socialMedia?.instagram || "",
    whatsapp: settings.socialMedia?.whatsapp || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAnnouncementAdd = () => {
    setFormData({
      ...formData,
      announcements: [...formData.announcements, ""]
    });
  };

  const handleAnnouncementChange = (index: number, value: string) => {
    const updatedAnnouncements = [...formData.announcements];
    updatedAnnouncements[index] = value;
    setFormData({
      ...formData,
      announcements: updatedAnnouncements
    });
  };

  const handleAnnouncementRemove = (index: number) => {
    const updatedAnnouncements = formData.announcements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      announcements: updatedAnnouncements
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
    
    // Set freeDeliveryThreshold to 0 if free delivery is disabled
    const freeDeliveryThreshold = formData.freeDeliveryEnabled ? formData.freeDeliveryThreshold : 0;
    
    // Update settings
    updateSettings({
      ...settings,
      storeName: formData.storeName,
      whatsappNumber: formData.whatsappNumber,
      deliveryFee: formData.deliveryFee,
      freeDeliveryThreshold: freeDeliveryThreshold,
      showFreeDeliveryNotice: formData.showFreeDeliveryNotice,
      freeDeliveryNoticeText: formData.freeDeliveryNoticeText,
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
              freeDeliveryEnabled={formData.freeDeliveryEnabled}
              onInputChange={handleInputChange}
              onToggleChange={handleToggleChange}
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
              freeDeliveryThreshold={formData.freeDeliveryThreshold}
              showFreeDeliveryNotice={formData.showFreeDeliveryNotice}
              freeDeliveryEnabled={formData.freeDeliveryEnabled}
              freeDeliveryNoticeText={formData.freeDeliveryNoticeText}
              onInputChange={handleInputChange}
              onAnnouncementAdd={handleAnnouncementAdd}
              onAnnouncementChange={handleAnnouncementChange}
              onAnnouncementRemove={handleAnnouncementRemove}
              onToggleChange={handleToggleChange}
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
