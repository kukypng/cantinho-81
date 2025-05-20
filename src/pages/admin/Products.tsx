
import React, { useState, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts } from "@/context/ProductContext";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "@/components/products/ProductForm";
import ProductTable from "@/components/products/ProductTable";
import DeleteProductDialog from "@/components/products/DeleteProductDialog";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  featured: false,
  category: "",
  stock: 0,
  maxPurchaseQuantity: 5
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
        setCurrentProduct((prev) => ({
          ...prev,
          [name]: "",
        }));
      } else {
        // Validar se é um número válido
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue)) {
          setCurrentProduct((prev) => ({
            ...prev,
            [name]: numberValue,
          }));
        }
      }
    } else {
      setCurrentProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentProduct((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  const validateProduct = () => {
    if (!currentProduct.name?.trim()) {
      setInputError({field: "name", message: "Nome do produto é obrigatório"});
      return false;
    }
    
    // Convert to number first for proper validation
    const priceValue = typeof currentProduct.price === 'string' 
      ? parseFloat(currentProduct.price) 
      : currentProduct.price;
      
    // Check if price is valid using type-safe comparison
    if (
      priceValue === 0 || 
      isNaN(priceValue) || 
      (typeof currentProduct.price === 'string' && currentProduct.price === '')
    ) {
      setInputError({field: "price", message: "Preço deve ser maior que zero"});
      return false;
    }
    
    if (!currentProduct.description?.trim()) {
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
      ? parseFloat(currentProduct.price) || 0 
      : currentProduct.price;

    // Add new product
    addProduct({
      ...currentProduct,
      price,
      stock: currentProduct.stock || 0,
      maxPurchaseQuantity: currentProduct.maxPurchaseQuantity || 5
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
      ? parseFloat(currentProduct.price) || 0 
      : currentProduct.price;

    // Update existing product
    updateProduct({
      ...currentProduct,
      price,
      stock: currentProduct.stock || 0,
      maxPurchaseQuantity: currentProduct.maxPurchaseQuantity || 5
    } as Product);
    
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
    setInputError(null);
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
                Preencha os dados do novo produto. Os campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm 
              initialProduct={currentProduct}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
              inputError={inputError}
              isUploading={isUploading}
            />
            
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
            
            <ProductForm 
              initialProduct={currentProduct}
              onInputChange={handleInputChange}
              onCheckboxChange={handleCheckboxChange}
              inputError={inputError}
              isUploading={isUploading}
              isEditing={true}
            />
            
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

        <DeleteProductDialog 
          open={showDeleteDialog} 
          onOpenChange={setShowDeleteDialog}
          onConfirmDelete={handleDeleteProduct}
        />
      </div>

      <ProductTable 
        products={products} 
        onEdit={openEditDialog} 
        onDelete={openDeleteDialog} 
      />
    </AdminLayout>
  );
};

export default ProductsPage;
