import { useState } from "react";
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { ProductForm } from "./ProductForm";
import type { Ingredient } from "./IngredientMaster";

export interface ProductIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  ingredients: ProductIngredient[];
  totalCost: number;
}

interface ProductListProps {
  products: Product[];
  ingredients: Ingredient[];
  onAddProduct: (product: Omit<Product, "id" | "totalCost">) => void;
  onUpdateProduct: (
    id: string,
    product: Omit<Product, "id" | "totalCost">,
  ) => void;
  onDeleteProduct: (id: string) => void;
}

export function ProductList({
  products,
  ingredients,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleSave = (product: Omit<Product, "id" | "totalCost">) => {
    if (editingId) {
      onUpdateProduct(editingId, product);
      setEditingId(null);
    } else {
      onAddProduct(product);
    }
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const getIngredientName = (ingredientId: string) => {
    return ingredients.find((i) => i.id === ingredientId)?.name || "Unknown";
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const editingProduct = editingId
    ? products.find((p) => p.id === editingId)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daftar Produk</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Tambah Produk
          </button>
        )}
      </div>

      {isAdding && (
        <ProductForm
          ingredients={ingredients}
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <div className="space-y-2">
        {products.length === 0 && !isAdding ? (
          <div className="text-center py-12 bg-slate-700 rounded-lg border border-dashed border-slate-600">
            <p className="text-slate-400">
              Belum ada produk. Tambahkan produk pertama Anda!
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Pastikan Anda sudah menambahkan bahan di Master Data terlebih
              dahulu
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-700 border border-slate-600 rounded-lg overflow-hidden hover:border-slate-500 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-100">{product.name}</h3>
                  <p className="text-lg text-emerald-400 font-semibold mt-1">
                    Total Modal: Rp {product.totalCost.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-slate-400">
                    {product.ingredients.length} bahan digunakan
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="p-2 text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className="p-2 text-slate-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {expandedId === product.id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === product.id && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-600 bg-slate-700/50">
                  <h4 className="font-medium text-slate-200 mt-3 mb-2">
                    Detail Bahan:
                  </h4>
                  <div className="space-y-2">
                    {product.ingredients.map((ing, idx) => {
                      const ingredient = ingredients.find(
                        (i) => i.id === ing.ingredientId,
                      );
                      if (!ingredient) return null;

                      // Convert to base unit and calculate cost
                      const convertedQty = convertToBaseUnit(
                        ing.quantity,
                        ing.unit,
                        ingredient.unit,
                      );
                      const cost = convertedQty * ingredient.pricePerUnit;

                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 px-3 bg-slate-600 rounded border border-slate-500"
                        >
                          <div>
                            <p className="font-medium text-slate-100">
                              {getIngredientName(ing.ingredientId)}
                            </p>
                            <p className="text-sm text-slate-400">
                              {ing.quantity} {ing.unit}
                            </p>
                          </div>
                          <p className="font-semibold text-emerald-400">
                            Rp {cost.toLocaleString("id-ID")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Unit conversion helper
function convertToBaseUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string,
): number {
  // Conversion to grams (for weight)
  const weightConversions: { [key: string]: number } = {
    gram: 1,
    kg: 1000,
    ml: 1, // Assuming density ~ 1 for simplicity
    liter: 1000,
    sdm: 15, // 1 tablespoon ~ 15g
    sdt: 5, // 1 teaspoon ~ 5g
    pcs: 1,
  };

  const fromBase = weightConversions[fromUnit] || 1;
  const toBase = weightConversions[toUnit] || 1;

  // Convert to base unit (grams), then to target unit
  return (quantity * fromBase) / toBase;
}
