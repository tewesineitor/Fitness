import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import IconButton from '../IconButton';
import Input from '../Input';
import EmptyState from '../feedback/EmptyState';
import { AddedFood, LoggedMeal } from '../../types';
import { vibrate } from '../../utils/helpers';
import { BowlIcon, CheckIcon, PencilIcon, PlusIcon, TrashIcon, XIcon } from '../icons';
import PortionEditorModal from './PortionEditorModal';

interface MealEditorModalProps {
  meal: LoggedMeal;
  onSave: (updatedMeal: LoggedMeal) => void;
  onClose: () => void;
}

const MealEditorModal: React.FC<MealEditorModalProps> = ({ meal, onSave, onClose }) => {
  const [name, setName] = useState(meal.name || 'Comida');
  const [foods, setFoods] = useState<AddedFood[]>(meal.foods);
  const [editingItem, setEditingItem] = useState<AddedFood | null>(null);

  const handleUpdatePortion = (foodId: string, newPortions: number) => {
    setFoods((prev) => {
      if (newPortions <= 0) return prev.filter((item) => item.foodItem.id !== foodId);
      return prev.map((item) => (item.foodItem.id === foodId ? { ...item, portions: newPortions } : item));
    });
    setEditingItem(null);
  };

  const handleRemoveItem = (foodId: string) => {
    setFoods((prev) => prev.filter((item) => item.foodItem.id !== foodId));
  };

  const handleSave = () => {
    vibrate(10);
    onSave({
      ...meal,
      name,
      foods,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} className="max-w-2xl">
      <div className="flex max-h-[88vh] flex-col overflow-hidden">
        <div className="border-b border-surface-border px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">
                Editor de comida
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
                Ajusta ingredientes y porciones
              </h2>
            </div>
            <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="ghost" />
          </div>
        </div>

        {editingItem ? (
          <div className="fixed inset-0 z-[240] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
            <div onClick={(event) => event.stopPropagation()}>
              <PortionEditorModal
                food={editingItem}
                onSave={(portions) => handleUpdatePortion(editingItem.foodItem.id, portions)}
                onClose={() => setEditingItem(null)}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <Input
            id="meal-name"
            label="Nombre de la comida"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Cena de recuperacion"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-muted">
                  Ingredientes
                </p>
                <p className="text-sm text-text-secondary">
                  Edita porciones o elimina elementos antes de guardar.
                </p>
              </div>
              <span className="rounded-full border border-surface-border bg-surface-hover px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">
                {foods.length} items
              </span>
            </div>

            {foods.length > 0 ? (
              <div className="space-y-3">
                {foods.map((item) => (
                  <div
                    key={item.foodItem.id}
                    className="ui-surface--raised flex items-center justify-between gap-3 p-3 sm:p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold tracking-[-0.02em] text-text-primary">
                        {item.foodItem.name}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {item.portions.toLocaleString(undefined, { maximumFractionDigits: 1 })} x {item.foodItem.standardPortion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-[1rem] border border-surface-border bg-surface-hover/70 p-1">
                        <IconButton
                          onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions - 0.5); }}
                          variant="ghost"
                          size="small"
                          icon={TrashIcon}
                          label={`Reducir ${item.foodItem.name}`}
                          className="!h-8 !w-8"
                        />
                        <Button
                          onClick={() => { vibrate(5); setEditingItem(item); }}
                          variant="secondary"
                          size="small"
                          icon={PencilIcon}
                        >
                          Editar
                        </Button>
                        <IconButton
                          onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions + 0.5); }}
                          variant="ghost"
                          size="small"
                          icon={PlusIcon}
                          label={`Aumentar ${item.foodItem.name}`}
                          className="!h-8 !w-8"
                        />
                      </div>

                      <IconButton
                        onClick={() => { vibrate(10); handleRemoveItem(item.foodItem.id); }}
                        variant="destructive"
                        size="medium"
                        icon={TrashIcon}
                        label={`Eliminar ${item.foodItem.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<BowlIcon className="h-8 w-8" />}
                title="Sin ingredientes"
                description="Si guardas ahora, este registro se eliminará."
              />
            )}
          </div>
        </div>

        <div className="border-t border-surface-border px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <Button onClick={handleSave} icon={CheckIcon} disabled={foods.length === 0} className="w-full" size="large">
              Guardar cambios
            </Button>
            {foods.length === 0 ? (
              <p className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-danger">
                La comida se eliminará si confirmas vacía.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MealEditorModal;
