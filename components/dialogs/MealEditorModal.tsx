
import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import IconButton from '../IconButton';
import Tag from '../Tag';
import { LoggedMeal, AddedFood } from '../../types';
import { vibrate } from '../../utils/helpers';
import { XIcon, TrashIcon, CheckIcon, PencilIcon, MinusIcon, PlusIcon } from '../icons';
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
        setFoods(prev => {
            if (newPortions <= 0) return prev.filter(item => item.foodItem.id !== foodId);
            return prev.map(item => item.foodItem.id === foodId ? { ...item, portions: newPortions } : item);
        });
        setEditingItem(null);
    };

    const handleRemoveItem = (foodId: string) => {
        setFoods(prev => prev.filter(item => item.foodItem.id !== foodId));
    };

    const handleSave = () => {
        vibrate(10);
        const updatedMeal: LoggedMeal = {
            ...meal,
            name,
            foods,
            // Macros will be recalculated in reducer
        };
        onSave(updatedMeal);
        onClose();
    };

    return (
        <Modal onClose={onClose} className="max-w-md">
            <div className="p-6 max-h-[85vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Editar Comida</h3>
                    <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="ghost" />
                </div>

                {editingItem && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div onClick={e => e.stopPropagation()}>
                            <PortionEditorModal 
                                food={editingItem} 
                                onSave={(p) => handleUpdatePortion(editingItem.foodItem.id, p)} 
                                onClose={() => setEditingItem(null)} 
                            />
                        </div>
                    </div>
                )}

                <div className="mb-4 flex-shrink-0">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 block pl-1">Nombre</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-surface-hover border border-surface-border rounded-xl p-3 text-sm font-bold text-text-primary focus:border-brand-accent outline-none transition-colors"
                    />
                </div>

                <div className="flex-grow overflow-y-auto space-y-2 mb-4 pr-1">
                    {foods.length > 0 ? (
                        foods.map((item) => (
                            <div key={item.foodItem.id} className="bg-surface-bg p-3 rounded-xl flex items-center justify-between border border-surface-border">
                                <div className="flex-grow min-w-0 pr-3">
                                    <p className="font-bold text-text-primary truncate text-sm">{item.foodItem.name}</p>
                                    <p className="text-xs text-text-secondary mt-0.5 font-mono">
                                        {item.portions.toLocaleString(undefined, {maximumFractionDigits:1})} x {item.foodItem.standardPortion}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className="flex items-center bg-surface-hover rounded-lg p-0.5 border border-surface-border">
                                        <IconButton onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions - 0.5); }} variant="ghost" size="small" icon={MinusIcon} label="Menos" />
                                        <IconButton onClick={() => { vibrate(5); setEditingItem(item); }} variant="ghost" size="small" icon={PencilIcon} label="Editar" />
                                        <IconButton onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions + 0.5); }} variant="ghost" size="small" icon={PlusIcon} label="Más" />
                                    </div>
                                    <IconButton onClick={() => { vibrate(10); handleRemoveItem(item.foodItem.id); }} variant="destructive" size="medium" icon={TrashIcon} label="Eliminar" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-text-secondary text-xs py-8">No hay ingredientes.</p>
                    )}
                </div>

                <div className="flex flex-col gap-3 flex-shrink-0">
                    <Button onClick={handleSave} icon={CheckIcon} disabled={foods.length === 0} className="w-full">
                        Guardar Cambios
                    </Button>
                    {foods.length === 0 && (
                        <p className="text-[10px] text-red-400 text-center font-bold uppercase tracking-wider">La comida se eliminará si la guardas vacía.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MealEditorModal;
