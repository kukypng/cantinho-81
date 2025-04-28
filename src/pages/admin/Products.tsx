
import React, { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/context/ProductContext";
import { Product } from "@/types";
import { Edit, Plus, Trash2, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  featured: false,
  category: "",
};

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | Omit<Product, "id">>(
    emptyProduct
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setCurrentProduct({
        ...currentProduct,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentProduct({
      ...currentProduct,
      featured: checked,
    });
  };

  const handleAddProduct = () => {
    if (!currentProduct.name || !currentProduct.description || currentProduct.price <= 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Add new product
    addProduct(currentProduct as Omit<Product, "id">);
    
    // Reset form
    setCurrentProduct(emptyProduct);
    setIsAdding(false);
  };

  const handleEditProduct = () => {
    if (!currentProduct.name || !currentProduct.description || currentProduct.price <= 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Update existing product
    updateProduct(currentProduct as Product);
    
    // Reset form
    setCurrentProduct(emptyProduct);
    setIsEditing(false);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteDialog(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const closeAndResetForm = () => {
    setCurrentProduct(emptyProduct);
    setIsAdding(false);
    setIsEditing(false);
  };

  return (
    <AdminLayout title="Gerenciar Produtos">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo produto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Produto*</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  placeholder="Descrição do produto"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">URL da Imagem*</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  placeholder="Categoria do produto"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={currentProduct.featured}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="featured" className="font-normal">
                  Produto em destaque
                </Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={closeAndResetForm}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleAddProduct}>
                Adicionar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
              <DialogDescription>
                Atualize os dados do produto.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome do Produto*</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Preço*</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição*</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  placeholder="Descrição do produto"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-imageUrl">URL da Imagem*</Label>
                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  value={currentProduct.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={currentProduct.category}
                  onChange={handleInputChange}
                  placeholder="Categoria do produto"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-featured"
                  checked={currentProduct.featured}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="edit-featured" className="font-normal">
                  Produto em destaque
                </Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={closeAndResetForm}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" onClick={handleEditProduct}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Excluir Produto</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="w-[100px]">Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imageUrl && (
                      <div className="h-10 w-10 overflow-hidden rounded">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category || "-"}</TableCell>
                  <TableCell className="text-right">
                    R$ {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {product.featured ? "Sim" : "Não"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteDialog(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum produto cadastrado. Adicione seu primeiro produto!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
