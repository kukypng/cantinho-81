
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { Save } from "lucide-react";
import BeginnersGuide from "@/components/settings/BeginnersGuide";
import StoreInfoSection from "@/components/settings/StoreInfoSection";
import DeliverySettingsSection from "@/components/settings/DeliverySettingsSection";
import MessagesSection from "@/components/settings/MessagesSection";
import SocialMediaSection from "@/components/settings/SocialMediaSection";

const Settings = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({
    storeName: settings.storeName,
    whatsappNumber: settings.whatsappNumber,
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 0,
    welcomeMessage: settings.welcomeMessage || "",
    footerMessage: settings.footerMessage || "",
    customCakeMessage: settings.customCakeMessage || "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare socialMedia object
    const socialMedia = {
      instagram: formData.instagram,
      whatsapp: formData.whatsapp
    };
    
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
      socialMedia
    });
    
    toast.success("Configurações salvas com sucesso!");
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

            <MessagesSection
              welcomeMessage={formData.welcomeMessage}
              footerMessage={formData.footerMessage}
              customCakeMessage={formData.customCakeMessage}
              onInputChange={handleInputChange}
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
