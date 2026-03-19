
import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
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
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Editar Comida</h3>
                    <button onClick={() => { vibrate(5); onClose(); }} className="text-text-secondary hover:text-white"><XIcon className="w-5 h-5"/></button>
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
                        className="w-full bg-surface-hover border border-surface-border rounded-xl p-3 text-sm font-bold text-white focus:border-brand-accent outline-none transition-colors"
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
                                        <button onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions - 0.5); }} className="p-1.5 hover:bg-white/10 rounded-md text-text-secondary hover:text-brand-accent transition-colors"><MinusIcon className="w-3 h-3" /></button>
                                        <button onClick={() => { vibrate(5); setEditingItem(item); }} className="p-1.5 hover:bg-white/10 rounded-md text-text-secondary hover:text-brand-accent transition-colors"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={() => { vibrate(5); handleUpdatePortion(item.foodItem.id, item.portions + 0.5); }} className="p-1.5 hover:bg-white/10 rounded-md text-text-secondary hover:text-brand-accent transition-colors"><PlusIcon className="w-3 h-3" /></button>
                                    </div>
                                    <button onClick={() => { vibrate(10); handleRemoveItem(item.foodItem.id); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><TrashIcon className="w-4 h-4" /></button>
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
