import { useState } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";

export interface Ingredient {
  id: string;
  name: string;
  purchasePrice: number;
  packageSize: number;
  unit: string;
  pricePerUnit: number;
}

interface IngredientMasterProps {
  ingredients: Ingredient[];
  onAddIngredient: (
    ingredient: Omit<Ingredient, "id" | "pricePerUnit">,
  ) => void;
  onUpdateIngredient: (
    id: string,
    ingredient: Omit<Ingredient, "id" | "pricePerUnit">,
  ) => void;
  onDeleteIngredient: (id: string) => void;
}

const UNITS = ["gram", "kg", "ml", "liter", "pcs", "sdm", "sdt"];

export function IngredientMaster({
  ingredients,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
}: IngredientMasterProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    purchasePrice: "",
    packageSize: "",
    unit: "gram",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.purchasePrice || !formData.packageSize)
      return;

    const ingredientData = {
      name: formData.name,
      purchasePrice: parseFloat(formData.purchasePrice),
      packageSize: parseFloat(formData.packageSize),
      unit: formData.unit,
    };

    if (editingId) {
      onUpdateIngredient(editingId, ingredientData);
      setEditingId(null);
      setIsAdding(false);
    } else {
      onAddIngredient(ingredientData);
      setIsAdding(false);
    }

    setFormData({ name: "", purchasePrice: "", packageSize: "", unit: "gram" });
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setFormData({
      name: ingredient.name,
      purchasePrice: ingredient.purchasePrice.toString(),
      packageSize: ingredient.packageSize.toString(),
      unit: ingredient.unit,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", purchasePrice: "", packageSize: "", unit: "gram" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Master Data Bahan</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Tambah Bahan
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-slate-700 rounded-lg border border-slate-600 space-y-3"
        >
          <div>
            <label className="block mb-1 text-slate-200 font-medium">
              Nama Bahan
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Contoh: Tepung Terigu"
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-slate-100 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-200 font-medium">
              Harga Pembelian (Rp)
            </label>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData({ ...formData, purchasePrice: e.target.value })
              }
              placeholder="15000"
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 text-slate-100 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-200 font-medium">
              Ukuran Kemasan
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.packageSize}
                onChange={(e) =>
                  setFormData({ ...formData, packageSize: e.target.value })
                }
                placeholder="1000"
                className="flex-1 min-w-0 px-3 py-2 bg-slate-600 border border-slate-500 text-slate-100 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-24 shrink-0 px-2 py-2 bg-slate-600 border border-slate-500 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-lg transition-colors"
            >
              <X size={18} />
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <Check size={18} />
              {editingId ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {ingredients.length === 0 ? (
          <div className="text-center py-12 bg-slate-700 rounded-lg border border-dashed border-slate-600">
            <p className="text-slate-400">
              Belum ada bahan. Tambahkan bahan pertama Anda!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between p-4 bg-slate-700 border border-slate-600 rounded-lg hover:border-slate-500 hover:shadow-lg transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-slate-100">
                    {ingredient.name}
                  </h3>
                  <div className="text-sm text-slate-400 mt-1">
                    <p>
                      Harga: Rp{" "}
                      {ingredient.purchasePrice.toLocaleString("id-ID")} /{" "}
                      {ingredient.packageSize} {ingredient.unit}
                    </p>
                    <p className="text-emerald-400 font-medium">
                      Harga per {ingredient.unit}: Rp{" "}
                      {ingredient.pricePerUnit.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(ingredient)}
                    className="p-2 text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteIngredient(ingredient.id)}
                    className="p-2 text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
