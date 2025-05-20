
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/context/ProductContext";
import { useStore } from "@/context/StoreContext";
import { Package2, ShoppingCart, Truck, Settings, AlertTriangle, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { products } = useProducts();
  const { settings } = useStore();

  // Calculate product statistics
  const outOfStockCount = products.filter(p => p.stock !== undefined && p.stock <= 0).length;
  const lowStockCount = products.filter(p => p.stock !== undefined && p.stock > 0 && p.stock < 5).length;
  const inStockCount = products.filter(p => p.stock === undefined || p.stock > 0).length;
  const featuredProductsCount = products.filter(p => p.featured).length;

  // Find top products categories
  const categoriesCount = products.reduce((acc, product) => {
    if (product.category) {
      acc[product.category] = (acc[product.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoriesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stock Alert Card */}
        {outOfStockCount > 0 && (
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Alerta de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">
                Você tem <strong>{outOfStockCount}</strong> produto{outOfStockCount !== 1 ? 's' : ''} sem estoque.
                {lowStockCount > 0 && ` Além disso, ${lowStockCount} produto${lowStockCount !== 1 ? 's estão' : ' está'} com estoque baixo.`}
              </p>
              <Link to="/admin/products" className="mt-2 inline-block">
                <Button variant="destructive" size="sm" className="mt-2">
                  Gerenciar Estoque
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Em Estoque</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{inStockCount}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {outOfStockCount} esgotados
                </Badge>
                {lowStockCount > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {lowStockCount} baixo
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {settings.deliveryFee > 0 ? `R$ ${settings.deliveryFee.toFixed(2)}` : "Grátis"}
              </div>
              <p className="text-xs text-muted-foreground">
                {settings.freeDeliveryThreshold ? `Grátis em pedidos acima de R$ ${settings.freeDeliveryThreshold.toFixed(2)}` : "Configuração de entrega"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Destaque</CardTitle>
              <TrendingUp className="h-4 w-4 text-store-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredProductsCount}</div>
              <p className="text-xs text-muted-foreground">
                de {products.length} produtos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bem-vindo ao Painel Admin</CardTitle>
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
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>Resumo da loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Nome da Loja</h3>
                  <p className="text-lg font-semibold truncate">{settings.storeName}</p>
                </div>
                
                {topCategories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Principais Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {topCategories.map(([category, count]) => (
                        <Badge key={category} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          {category} ({count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Acesso Rápido</h3>
                  <div className="space-y-2">
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
                        Editar Configurações
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
