
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Package2, ShoppingCart, Truck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { products } = useProducts();
  const { settings } = useStore();

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Produtos cadastrados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {settings.deliveryFee > 0
                  ? `R$ ${settings.deliveryFee.toFixed(2)}`
                  : "Grátis"}
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.freeDeliveryThreshold
                  ? `Grátis em pedidos acima de R$ ${settings.freeDeliveryThreshold.toFixed(
                      2
                    )}`
                  : "Configuração de entrega"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nome da Loja</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate">{settings.storeName}</div>
              <p className="text-xs text-muted-foreground">
                Configurações da loja
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
              <CardDescription>
                Gerencie sua loja online de forma rápida e fácil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Use este painel para adicionar produtos, configurar seu WhatsApp e
                personalizar as informações da sua loja.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full">
                    <Package2 className="mr-2 h-4 w-4" />
                    Gerenciar Produtos
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações da Loja
                  </Button>
                </Link>
              </div>
              <div className="rounded bg-yellow-50 p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Dica:</strong> Configure seu número de WhatsApp nas configurações
                  para que seus clientes possam finalizar os pedidos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
              <CardDescription>Ações populares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Visualizar Loja
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Adicionar Produto
                </Button>
              </Link>
              <Link to="/admin/settings">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Editar Número de WhatsApp
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
