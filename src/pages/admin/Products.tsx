
import React, { useState, useRef } from "react";
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
import { Edit, Plus, Trash2, Upload, ImagePlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "number") {
      setCurrentProduct({
        ...currentProduct,
        [name]: value === "" ? "" : parseFloat(value) || 0,
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
    if (!currentProduct.name || !currentProduct.description || !currentProduct.price) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Add new product
    addProduct({
      ...currentProduct,
      price: typeof currentProduct.price === 'string' 
        ? parseFloat(currentProduct.price as string) || 0 
        : currentProduct.price
    } as Omit<Product, "id">);
    
    // Reset form
    setCurrentProduct(emptyProduct);
    setIsAdding(false);
  };

  const handleEditProduct = () => {
    if (!currentProduct.name || !currentProduct.description || !currentProduct.price) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Update existing product
    updateProduct({
      ...currentProduct,
      price: typeof currentProduct.price === 'string' 
        ? parseFloat(currentProduct.price as string) || 0 
        : currentProduct.price
    } as Product);
    
    // Reset form
    setCurrentProduct(emptyProduct);
    setIsEditing(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        setIsUploading(false);
        return;
      }

      // Verificar tipo de arquivo
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error("Formato de arquivo não suportado. Use JPG, PNG, WEBP ou GIF");
        setIsUploading(false);
        return;
      }

      // Gerar nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `produtos/${fileName}`;

      // Upload para o storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Erro ao fazer upload: ${uploadError.message}`);
        setIsUploading(false);
        return;
      }

      // Obter a URL pública do arquivo
      const { data } = supabase.storage
        .from('imagens')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        setCurrentProduct({
          ...currentProduct,
          imageUrl: data.publicUrl
        });
        toast.success("Imagem carregada com sucesso!");
      }
    } catch (error: any) {
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Limpar o input file para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
                  step="0.01"
                  value={currentProduct.price === 0 ? "" : currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
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
                <Label htmlFor="imageUrl">Imagem do Produto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="flex-1"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={triggerFileInput} 
                    disabled={isUploading}
                    className="flex gap-2"
                  >
                    {isUploading ? "Enviando..." : "Galeria"}
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
                {currentProduct.imageUrl && (
                  <div className="mt-2 h-24 w-24 overflow-hidden rounded border">
                    <img 
                      src={currentProduct.imageUrl}
                      alt="Prévia da imagem"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
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
              <Button type="submit" onClick={handleAddProduct} disabled={isUploading}>
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
                  step="0.01"
                  value={currentProduct.price === 0 ? "" : currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
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
                <Label htmlFor="edit-imageUrl">Imagem do Produto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-imageUrl"
                    name="imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="flex-1"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={triggerFileInput} 
                    disabled={isUploading}
                    className="flex gap-2"
                  >
                    {isUploading ? "Enviando..." : "Galeria"}
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
                {currentProduct.imageUrl && (
                  <div className="mt-2 h-24 w-24 overflow-hidden rounded border">
                    <img 
                      src={currentProduct.imageUrl}
                      alt="Prévia da imagem"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
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
              <Button type="submit" onClick={handleEditProduct} disabled={isUploading}>
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
                    {product.imageUrl ? (
                      <div className="h-10 w-10 overflow-hidden rounded">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                        <Upload className="h-5 w-5 text-gray-400" />
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
                <TableCell colSpan={6} className="py-8 text-center text-gray-500">
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
