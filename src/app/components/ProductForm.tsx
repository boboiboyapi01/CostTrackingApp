import { useState, useEffect } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import type { Ingredient } from "./IngredientMaster";
import type { Product, ProductIngredient } from "./ProductList";

interface ProductFormProps {
  ingredients: Ingredient[];
  product?: Product;
  onSave: (product: Omit<Product, "id" | "totalCost">) => void;
  onCancel: () => void;
}

const UNITS = ["gram", "kg", "ml", "liter", "pcs", "sdm", "sdt"];

export function ProductForm({
  ingredients,
  product,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [productName, setProductName] = useState(product?.name || "");
  const [productIngredients, setProductIngredients] = useState<
    ProductIngredient[]
  >(product?.ingredients || []);

  const handleAddIngredient = () => {
    if (ingredients.length === 0) {
      alert("Tambahkan bahan di Master Data terlebih dahulu!");
      return;
    }

    setProductIngredients([
      ...productIngredients,
      {
        ingredientId: ingredients[0].id,
        quantity: 0,
        unit: ingredients[0].unit,
      },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setProductIngredients(productIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof ProductIngredient,
    value: string | number
  ) => {
    const updated = [...productIngredients];

    if (field === "ingredientId") {
      const ingredient = ingredients.find((i) => i.id === value);

      updated[index] = {
        ...updated[index],
        ingredientId: value as string, // aman & eksplisit
        unit: ingredient?.unit || "gram",
      };
    } else if (field === "quantity") {
      updated[index] = {
        ...updated[index],
        quantity: Number(value),
      };
    } else if (field === "unit") {
      updated[index] = {
        ...updated[index],
        unit: value as string,
      };
    }

    setProductIngredients(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      alert("Nama produk harus diisi!");
      return;
    }

    if (productIngredients.length === 0) {
      alert("Tambahkan minimal satu bahan!");
      return;
    }

    // Validate all ingredients have quantity > 0
    const invalidIngredients = productIngredients.filter(
      (ing) => ing.quantity <= 0
    );
    if (invalidIngredients.length > 0) {
      alert("Jumlah bahan harus lebih dari 0!");
      return;
    }

    onSave({
      name: productName,
      ingredients: productIngredients,
    });
  };

  const calculateEstimatedCost = () => {
    return productIngredients.reduce((total, ing) => {
      const ingredient = ingredients.find((i) => i.id === ing.ingredientId);
      if (!ingredient) return total;

      const convertedQty = convertToBaseUnit(
        ing.quantity,
        ing.unit,
        ingredient.unit
      );
      const cost = convertedQty * ingredient.pricePerUnit;
      return total + cost;
    }, 0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-300 space-y-4"
    >
      <h3 className="font-medium text-lg">
        {product ? "Edit Produk" : "Tambah Produk Baru"}
      </h3>

      <div>
        <label className="block mb-1">Nama Produk</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Contoh: Kue Brownies"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block">Bahan yang Digunakan</label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} />
            Tambah Bahan
          </button>
        </div>

        {productIngredients.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">
              Belum ada bahan yang ditambahkan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {productIngredients.map((ing, index) => {
              const ingredient = ingredients.find(
                (i) => i.id === ing.ingredientId
              );
              const convertedQty = ingredient
                ? convertToBaseUnit(ing.quantity, ing.unit, ingredient.unit)
                : 0;
              const cost = ingredient
                ? convertedQty * ingredient.pricePerUnit
                : 0;

              return (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border space-y-2"
                >
                  <div className="flex gap-2">
                    <select
                      value={ing.ingredientId}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "ingredientId",
                          e.target.value
                        )
                      }
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {ingredients.map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm mb-1">Jumlah</label>
                      <input
                        type="number"
                        value={ing.quantity || ""}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="100"
                        step="0.01"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Satuan</label>
                      <select
                        value={ing.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, "unit", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {ing.quantity > 0 && ingredient && (
                    <div className="text-sm bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-gray-700">
                        Estimasi biaya:{" "}
                        <span className="font-medium text-green-700">
                          Rp {cost.toLocaleString("id-ID")}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {productIngredients.length > 0 && (
        <div className="p-4 bg-green-100 rounded-lg border-2 border-green-400">
          <p className="font-medium">
            Total Estimasi Modal:{" "}
            <span className="text-lg text-green-700">
              Rp {calculateEstimatedCost().toLocaleString("id-ID")}
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          <X size={18} />
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Check size={18} />
          {product ? "Update Produk" : "Simpan Produk"}
        </button>
      </div>
    </form>
  );
}

// Unit conversion helper
function convertToBaseUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string
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
