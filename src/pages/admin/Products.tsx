
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
import { Edit, Plus, Trash2, Upload, ImagePlus, AlertCircle } from "lucide-react";
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
  const [inputError, setInputError] = useState<{field: string, message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Limpa o erro quando o usuário começa a digitar no campo com erro
    if (inputError?.field === name) {
      setInputError(null);
    }
    
    if (type === "number") {
      // Permite que o campo fique vazio (para que o usuário possa apagar tudo e começar de novo)
      if (value === "") {
        setCurrentProduct({
          ...currentProduct,
          [name]: "",
        });
      } else {
        // Validar se é um número válido
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
          setCurrentProduct({
            ...currentProduct,
            [name]: numberValue,
          });
        }
      }
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

  const validateProduct = () => {
    if (!currentProduct.name.trim()) {
      setInputError({field: "name", message: "Nome do produto é obrigatório"});
      return false;
    }
    
    // Fixed: Correctly handle different price types
    const priceValue = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price) 
      : currentProduct.price;
      
    // Check if price is valid
    if (
      priceValue === 0 || 
      isNaN(priceValue) || 
      (typeof currentProduct.price === 'string' && currentProduct.price.trim() === '')
    ) {
      setInputError({field: "price", message: "Preço deve ser maior que zero"});
      return false;
    }
    
    if (!currentProduct.description.trim()) {
      setInputError({field: "description", message: "Descrição do produto é obrigatória"});
      return false;
    }
    
    return true;
  };

  const handleAddProduct = () => {
    if (!validateProduct()) {
      return;
    }

    // Garante que price é um número
    const price = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price as string) || 0 
      : currentProduct.price;

    // Add new product
    addProduct({
      ...currentProduct,
      price
    } as Omit<Product, "id">);
    
    // Reset form
    setCurrentProduct(emptyProduct);
    setIsAdding(false);
  };

  const handleEditProduct = () => {
    if (!validateProduct()) {
      return;
    }

    // Garante que price é um número
    const price = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price as string) || 0 
      : currentProduct.price;

    // Update existing product
    updateProduct({
      ...currentProduct,
      price
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
    setInputError(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Renderiza o indicador de erro para os campos do formulário
  const renderErrorIndicator = (fieldName: string) => {
    if (inputError && inputError.field === fieldName) {
      return (
        <div className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {inputError.message}
        </div>
      );
    }
    return null;
  };

  // Componente de formulário para adicionar ou editar produtos
  const ProductForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor={isEditing ? "edit-name" : "name"} className="font-medium">
          Nome do Produto*
        </Label>
        <Input
          id={isEditing ? "edit-name" : "name"}
          name="name"
          value={currentProduct.name}
          onChange={handleInputChange}
          placeholder="Nome do produto"
          className={inputError?.field === "name" ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {renderErrorIndicator("name")}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEditing ? "edit-price" : "price"} className="font-medium">
          Preço*
        </Label>
        <Input
          id={isEditing ? "edit-price" : "price"}
          name="price"
          type="number"
          step="0.01"
          value={currentProduct.price === 0 ? "" : currentProduct.price}
          onChange={handleInputChange}
          placeholder="0.00"
          min="0"
          className={inputError?.field === "price" ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {renderErrorIndicator("price")}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEditing ? "edit-description" : "description"} className="font-medium">
          Descrição*
        </Label>
        <Textarea
          id={isEditing ? "edit-description" : "description"}
          name="description"
          value={currentProduct.description}
          onChange={handleInputChange}
          placeholder="Descrição do produto"
          className={inputError?.field === "description" ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {renderErrorIndicator("description")}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEditing ? "edit-imageUrl" : "imageUrl"} className="font-medium">
          Imagem do Produto
        </Label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              id={isEditing ? "edit-imageUrl" : "imageUrl"}
              name="imageUrl"
              value={currentProduct.imageUrl}
              onChange={handleInputChange}
              placeholder="URL da imagem (ou use o botão de Galeria)"
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
              className="flex gap-2 whitespace-nowrap"
            >
              {isUploading ? "Enviando..." : "Galeria"}
              <ImagePlus className="h-4 w-4" />
            </Button>
          </div>
          
          {currentProduct.imageUrl && (
            <div className="mt-2 h-32 w-32 overflow-hidden rounded border">
              <img 
                src={currentProduct.imageUrl}
                alt="Prévia da imagem"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor={isEditing ? "edit-category" : "category"} className="font-medium">
          Categoria
        </Label>
        <Input
          id={isEditing ? "edit-category" : "category"}
          name="category"
          value={currentProduct.category}
          onChange={handleInputChange}
          placeholder="Categoria do produto"
        />
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id={isEditing ? "edit-featured" : "featured"}
          checked={currentProduct.featured}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor={isEditing ? "edit-featured" : "featured"} className="font-normal">
          Produto em destaque
        </Label>
      </div>
    </div>
  );

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
                Preencha os dados do novo produto. Os campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm />
            
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
                Atualize os dados do produto. Os campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm isEditing={true} />
            
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
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e a imagem associada também será removida.
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

