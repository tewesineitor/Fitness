
import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts';
import { FoodItem } from '../../types';
import Button from '../../components/Button';
import { ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';
import { FoodItemEditor } from './FoodItemEditor';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { selectCustomFoodItems } from '../../selectors/nutritionSelectors';

const CustomFoodListView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const customFoodItems = selectCustomFoodItems(state);

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);
    const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);

    const handleOpenEditor = (food?: FoodItem) => {
        setFoodToEdit(food || null);
        setIsEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setFoodToEdit(null);
    };

    const handleDelete = () => {
        if (foodToDelete) {
            dispatch({ type: 'DELETE_CUSTOM_FOOD', payload: foodToDelete.id });
            setFoodToDelete(null);
        }
    };
    
    const foodByCategory = customFoodItems.reduce((acc, food) => {
        const category = food.category || 'Verduras';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(food);
        return acc;
    }, {} as Record<FoodItem['category'], FoodItem[]>);

    return (
        <div className="flex flex-col h-full animate-fade-in-up">
            {isEditorOpen && (
                <FoodItemEditor
                    existingFood={foodToEdit || undefined}
                    onClose={handleCloseEditor}
                />
            )}
            {foodToDelete && (
                <ConfirmationDialog
                    title="Eliminar Ingrediente"
                    message={`¿Estás seguro de que quieres eliminar "${foodToDelete.name}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setFoodToDelete(null)}
                />
            )}

            <header className="p-6 pb-4 flex-shrink-0">
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="mb-6 !p-0 [&_svg]:rotate-180 opacity-60 hover:opacity-100 transition-opacity">
                    Volver al Diario
                </Button>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Mis Ingredientes</h1>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">Gestiona tus alimentos personalizados</p>
                    </div>
                    <Button onClick={() => handleOpenEditor()} icon={PlusIcon} className="px-6">Añadir</Button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto px-6 pb-6">
                {customFoodItems.length > 0 ? (
                    <div className="space-y-8">
                        {Object.entries(foodByCategory).map(([category, foods]) => (
                            <div key={category}>
                                <h2 className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] mb-4 pl-1">{category}</h2>
                                <div className="space-y-3">
                                    {foods.map(food => (
                                        <div key={food.id} className="bg-surface-hover p-4 rounded-2xl flex items-center gap-4 border border-surface-border hover:border-brand-accent/30 transition-all group">
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="font-bold text-text-primary truncate tracking-tight">{food.name}</p>
                                                    {food.brand && (
                                                        <span className="text-[9px] font-bold uppercase tracking-widest bg-surface-bg border border-surface-border text-text-secondary px-2 py-0.5 rounded-lg flex-shrink-0 opacity-60">
                                                            {food.brand}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-medium text-text-secondary opacity-60">
                                                    <span className="font-bold">{food.standardPortion}</span>
                                                    <span className="w-1 h-1 rounded-full bg-surface-border"></span>
                                                    <div className="flex gap-2">
                                                        <span className="text-brand-protein">P: {food.macrosPerPortion.protein.toFixed(1)}g</span>
                                                        <span className="text-brand-carbs">C: {food.macrosPerPortion.carbs.toFixed(1)}g</span>
                                                        <span className="text-brand-fat">G: {food.macrosPerPortion.fat.toFixed(1)}g</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="secondary" size="small" icon={PencilIcon} className="!p-2.5 rounded-xl" onClick={() => handleOpenEditor(food)} />
                                                <Button variant="destructive" size="small" icon={TrashIcon} className="!p-2.5 rounded-xl" onClick={() => setFoodToDelete(food)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-hover rounded-3xl border border-dashed border-surface-border">
                        <div className="w-16 h-16 bg-surface-bg rounded-2xl flex items-center justify-center mx-auto mb-4 border border-surface-border">
                            <PlusIcon className="w-8 h-8 text-text-secondary opacity-20" />
                        </div>
                        <p className="text-text-primary font-bold uppercase tracking-widest text-xs">No hay ingredientes</p>
                        <p className="text-[11px] text-text-secondary mt-2 opacity-60">Usa el botón "Añadir" para crear tu primer ingrediente personalizado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomFoodListView;
