import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

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
  onAddIngredient: (ingredient: Omit<Ingredient, 'id' | 'pricePerUnit'>) => void;
  onUpdateIngredient: (id: string, ingredient: Omit<Ingredient, 'id' | 'pricePerUnit'>) => void;
  onDeleteIngredient: (id: string) => void;
}

const UNITS = ['gram', 'kg', 'ml', 'liter', 'pcs', 'sdm', 'sdt'];

export function IngredientMaster({ 
  ingredients, 
  onAddIngredient, 
  onUpdateIngredient, 
  onDeleteIngredient 
}: IngredientMasterProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    purchasePrice: '',
    packageSize: '',
    unit: 'gram'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchasePrice || !formData.packageSize) return;

    const ingredientData = {
      name: formData.name,
      purchasePrice: parseFloat(formData.purchasePrice),
      packageSize: parseFloat(formData.packageSize),
      unit: formData.unit
    };

    if (editingId) {
      onUpdateIngredient(editingId, ingredientData);
      setEditingId(null);
    } else {
      onAddIngredient(ingredientData);
      setIsAdding(false);
    }

    setFormData({ name: '', purchasePrice: '', packageSize: '', unit: 'gram' });
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setFormData({
      name: ingredient.name,
      purchasePrice: ingredient.purchasePrice.toString(),
      packageSize: ingredient.packageSize.toString(),
      unit: ingredient.unit
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', purchasePrice: '', packageSize: '', unit: 'gram' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2>Master Data Bahan</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Tambah Bahan
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg border-2 border-blue-200 space-y-3">
          <div>
            <label className="block mb-1">Nama Bahan</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Tepung Terigu"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Harga Pembelian (Rp)</label>
            <input
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              placeholder="15000"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Ukuran Kemasan</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.packageSize}
                onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                placeholder="1000"
                className="flex-1 min-w-0 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-24 shrink-0 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UNITS.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
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
              {editingId ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {ingredients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada bahan. Tambahkan bahan pertama Anda!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{ingredient.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>
                      Harga: Rp {ingredient.purchasePrice.toLocaleString('id-ID')} / {ingredient.packageSize} {ingredient.unit}
                    </p>
                    <p className="text-green-700 font-medium">
                      Harga per {ingredient.unit}: Rp {ingredient.pricePerUnit.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(ingredient)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteIngredient(ingredient.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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