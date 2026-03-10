import { useState, useEffect } from "react";
import { ShoppingCart, Package } from "lucide-react";
import {
  IngredientMaster,
  type Ingredient,
} from "./components/IngredientMaster";
import { ProductList, type Product } from "./components/ProductList";
import { useLocalStorage } from "./hooks/useLocalStorage";

type Tab = "ingredients" | "products";

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage<Tab>(
    "cost-tracking:active-tab",
    "ingredients",
  );
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(
    "cost-tracking:ingredients:v1",
    [],
  );
  const [products, setProducts] = useLocalStorage<Product[]>(
    "cost-tracking:products:v1",
    [],
  );

  // Ingredient handlers
  const handleAddIngredient = (
    ingredient: Omit<Ingredient, "id" | "pricePerUnit">,
  ) => {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: Date.now().toString(),
      pricePerUnit: ingredient.purchasePrice / ingredient.packageSize,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleUpdateIngredient = (
    id: string,
    ingredient: Omit<Ingredient, "id" | "pricePerUnit">,
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id
          ? {
              ...ingredient,
              id,
              pricePerUnit: ingredient.purchasePrice / ingredient.packageSize,
            }
          : ing,
      ),
    );
  };

  const handleDeleteIngredient = (id: string) => {
    // Check if ingredient is used in any product
    const isUsed = products.some((p) =>
      p.ingredients.some((ing) => ing.ingredientId === id),
    );

    if (isUsed) {
      alert("Bahan ini digunakan dalam produk. Hapus produk terlebih dahulu!");
      return;
    }

    if (confirm("Yakin ingin menghapus bahan ini?")) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  // Product handlers
  const calculateProductCost = (productIngredients: Product["ingredients"]) => {
    return productIngredients.reduce((total, ing) => {
      const ingredient = ingredients.find((i) => i.id === ing.ingredientId);
      if (!ingredient) return total;

      const convertedQty = convertToBaseUnit(
        ing.quantity,
        ing.unit,
        ingredient.unit,
      );
      const cost = convertedQty * ingredient.pricePerUnit;
      return total + cost;
    }, 0);
  };

  const handleAddProduct = (product: Omit<Product, "id" | "totalCost">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      totalCost: calculateProductCost(product.ingredients),
    };
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (
    id: string,
    product: Omit<Product, "id" | "totalCost">,
  ) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...product,
              id,
              totalCost: calculateProductCost(product.ingredients),
            }
          : p,
      ),
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Auto-update product costs when ingredients change
  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const newTotalCost = calculateProductCost(product.ingredients);

        if (newTotalCost === product.totalCost) {
          return product; // No change in cost
        }

        return {
          ...product,
          totalCost: newTotalCost,
        };
      }),
    );
  }, [ingredients]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-center mb-2 text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Aplikasi Manajemen Modal Produksi
          </h1>
          <p className="text-center text-slate-400">
            Kelola biaya bahan dan hitung modal produk dengan mudah
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
              activeTab === "ingredients"
                ? "text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <Package size={20} />
            Master Data Bahan
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
              activeTab === "products"
                ? "text-emerald-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-500"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <ShoppingCart size={20} />
            Daftar Produk
            {products.length > 0 && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full ml-1">
                {products.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700">
          {activeTab === "ingredients" ? (
            <IngredientMaster
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onDeleteIngredient={handleDeleteIngredient}
            />
          ) : (
            <ProductList
              products={products}
              ingredients={ingredients}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>

        {/* Stats Footer */}
        {(ingredients.length > 0 || products.length > 0) && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-4 text-center border border-blue-700/50 hover:border-blue-600 transition-colors">
              <p className="text-sm text-slate-300">Total Bahan Terdaftar</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">
                {ingredients.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-lg p-4 text-center border border-emerald-700/50 hover:border-emerald-600 transition-colors">
              <p className="text-sm text-slate-300">Total Produk</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {products.length}
              </p>
            </div>
          </div>
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
  const weightConversions: { [key: string]: number } = {
    gram: 1,
    kg: 1000,
    ml: 1,
    liter: 1000,
    sdm: 15,
    sdt: 5,
    pcs: 1,
  };

  const fromBase = weightConversions[fromUnit] || 1;
  const toBase = weightConversions[toUnit] || 1;

  return (quantity * fromBase) / toBase;
}
