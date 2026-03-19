
import React, { useState, useContext, useMemo } from 'react';
import { Recipe, FoodItem, AddedFood, MacroNutrients, MealType } from '../../../types';
import { AppContext } from '../../../contexts';
import * as actions from '../../../actions';
import { selectCustomFoodItems } from '../../../selectors/nutritionSelectors';
import { calculateMacros, vibrate } from '../../../utils/helpers';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import FloatingDock from '../../../components/FloatingDock';
import { ChevronRightIcon, PlusIcon, TrashIcon, SearchIcon, XIcon, CheckIcon, PlateIcon } from '../../../components/icons';

// --- SUB-COMPONENTS ---

const MacroHUD: React.FC<{ macros: MacroNutrients }> = ({ macros }) => (
    <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm mb-6">
        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 text-center">Resumen Nutricional</p>
        <div className="flex justify-between items-center px-2">
            <div className="text-center">
                <span className="block text-2xl font-black text-white tracking-tighter">{macros.kcal.toFixed(0)}</span>
                <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider">Kcal</span>
            </div>
            <div className="h-8 w-px bg-surface-border"></div>
            <div className="text-center">
                <span className="block text-lg font-bold text-brand-protein">{macros.protein.toFixed(0)}<span className="text-xs text-text-secondary">g</span></span>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Prot</span>
            </div>
            <div className="h-8 w-px bg-surface-border"></div>
            <div className="text-center">
                <span className="block text-lg font-bold text-brand-carbs">{macros.carbs.toFixed(0)}<span className="text-xs text-text-secondary">g</span></span>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Carb</span>
            </div>
            <div className="h-8 w-px bg-surface-border"></div>
            <div className="text-center">
                <span className="block text-lg font-bold text-brand-fat">{macros.fat.toFixed(0)}<span className="text-xs text-text-secondary">g</span></span>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Fat</span>
            </div>
        </div>
    </div>
);

const IngredientRow: React.FC<{ 
    item: AddedFood, 
    onUpdatePortion: (val: string) => void, 
    onRemove: () => void 
}> = ({ item, onUpdatePortion, onRemove }) => {
    const gramEquivalent = item.foodItem.rawWeightG 
        ? `~${(item.foodItem.rawWeightG * item.portions).toFixed(0)}g` 
        : item.foodItem.cookedWeightG 
            ? `~${(item.foodItem.cookedWeightG * item.portions).toFixed(0)}g` 
            : null;

    return (
        <div className="flex items-center justify-between p-3 bg-surface-bg border border-surface-border rounded-xl mb-2 group transition-all hover:border-brand-accent/30">
            <div className="flex-grow min-w-0 mr-3">
                <p className="font-bold text-sm text-text-primary truncate">{item.foodItem.name}</p>
                <p className="text-[10px] text-text-secondary font-mono mt-0.5">
                    1 x {item.foodItem.standardPortion} {gramEquivalent && `(${gramEquivalent})`}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                    <input
                        type="number"
                        step="0.1"
                        value={item.portions}
                        onChange={e => onUpdatePortion(e.target.value)}
                        className="w-12 py-1.5 text-center bg-transparent text-sm font-bold text-white outline-none focus:text-brand-accent transition-colors"
                    />
                </div>
                <Button 
                    variant="destructive"
                    size="small"
                    onClick={onRemove} 
                    className="!p-2 rounded-lg"
                    icon={TrashIcon}
                />
            </div>
        </div>
    );
};

const AddIngredientModal: React.FC<{
    allFoodData: FoodItem[];
    onSelect: (food: FoodItem) => void;
    onClose: () => void;
}> = ({ allFoodData, onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFoods = useMemo(() =>
        allFoodData.filter(food =>
            food.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 50),
        [allFoodData, searchTerm]
    );

    return (
        <Modal onClose={onClose} className="max-w-2xl h-[85vh] !p-0 flex flex-col bg-bg-base border border-surface-border rounded-[2rem] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-surface-border bg-surface-bg/90 backdrop-blur-md flex justify-between items-center z-10 flex-shrink-0">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Seleccionar Ingrediente</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-white transition-colors">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            
            {/* Search Bar (Fixed below header) */}
            <div className="p-5 bg-bg-base flex-shrink-0">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    <input
                        type="search"
                        placeholder="BUSCAR INGREDIENTE..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-surface-bg border border-surface-border rounded-2xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none text-sm font-bold text-white placeholder:text-white/20 transition-all uppercase tracking-wide"
                        autoFocus
                    />
                </div>
            </div>

            {/* List (Scrollable) */}
            <div className="flex-grow min-h-0 overflow-y-auto px-5 pb-5 space-y-3 bg-bg-base hide-scrollbar">
                {filteredFoods.length > 0 ? (
                    filteredFoods.map((food, index) => (
                    <button
                        key={food.id}
                        onClick={() => onSelect(food)}
                        className="w-full text-left p-3 bg-surface-bg border border-surface-border rounded-2xl flex items-center justify-between hover:border-brand-accent/30 hover:bg-surface-hover transition-all group active:scale-[0.98] animate-fade-in-up"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div>
                            <span className="block font-bold text-sm text-text-primary group-hover:text-white uppercase tracking-tight">{food.name}</span>
                            <span className="text-[10px] text-text-secondary font-mono tracking-wider">{food.standardPortion}</span>
                        </div>
                        <PlusIcon className="w-4 h-4 text-surface-border group-hover:text-brand-accent transition-colors" />
                    </button>
                ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 opacity-50">
                        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">No encontrado</p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">Intenta con otro término</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

// --- MAIN SCREEN ---

const RecipeEditorView: React.FC<{ onBack: () => void; existingRecipe?: Recipe; }> = ({ onBack, existingRecipe }) => {
    const { state, dispatch, showToast } = useContext(AppContext)!;
    
    const isEditingUserRecipe = !!existingRecipe && existingRecipe.type === 'user';
    const cameFromAi = existingRecipe?.id === 'ai-generated';

    const [name, setName] = useState(existingRecipe?.name || '');
    const [mealType, setMealType] = useState<MealType>(existingRecipe?.mealType || 'Almuerzo');
    const [foods, setFoods] = useState<AddedFood[]>(existingRecipe?.foods || []);
    const [preparation, setPreparation] = useState(existingRecipe?.preparation || '');
    const [isAddingIngredient, setIsAddingIngredient] = useState(false);

    const { customFoodItems, allFoods } = state.nutrition;
    const allFoodData = useMemo(() => {
        const foodMap = new Map<string, FoodItem>();
        allFoods.forEach(food => foodMap.set(food.id, food));
        customFoodItems.forEach(food => foodMap.set(food.id, food));
        return Array.from(foodMap.values());
    }, [allFoods, customFoodItems]);

    const macros = useMemo(() => calculateMacros(foods), [foods]);

    const handleAddIngredient = (foodItem: FoodItem) => {
        vibrate(5);
        setFoods(prev => [...prev, { foodItem, portions: 1 }]);
        setIsAddingIngredient(false);
    };

    const handleUpdatePortion = (foodId: string, newPortionStr: string) => {
        const newPortions = parseFloat(newPortionStr) || 0;
        setFoods(foods.map(f => f.foodItem.id === foodId ? { ...f, portions: newPortions } : f));
    };

    const handleRemoveIngredient = (foodId: string) => {
        vibrate(5);
        setFoods(foods.filter(f => f.foodItem.id !== foodId));
    };

    const handleSave = () => {
        vibrate(10);
        if (!name.trim()) { showToast("La receta necesita un nombre."); return; }
        if (foods.length === 0) { showToast("Añade al menos un ingrediente."); return; }
        
        const recipePayload: Omit<Recipe, 'id' | 'type'> & { isFavorite?: boolean } = {
            name,
            mealType,
            foods,
            preparation,
            imageUrl: existingRecipe?.imageUrl || '',
            isFavorite: existingRecipe?.isFavorite || false,
        };
        
        if (isEditingUserRecipe && !cameFromAi) {
            dispatch(actions.updateMyRecipe({ ...existingRecipe, ...recipePayload }));
        } else {
            dispatch(actions.addMyRecipe(recipePayload));
        }
        showToast("Receta guardada con éxito.");
        onBack();
    };
    
    return (
        <div className="h-full flex flex-col animate-fade-in-up overflow-hidden">
            {isAddingIngredient && <AddIngredientModal allFoodData={allFoodData} onSelect={handleAddIngredient} onClose={() => setIsAddingIngredient(false)} />}
            
            <header className="p-4 sm:p-6 flex-shrink-0 border-b border-surface-border bg-bg-base/80 backdrop-blur-md sticky top-0 z-20">
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="!p-0 [&_svg]:rotate-180 text-text-secondary hover:text-white mb-4 text-xs uppercase tracking-widest">
                    Volver
                </Button>
                <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight leading-none">
                    {isEditingUserRecipe && !cameFromAi ? 'Editar Receta' : 'Nueva Receta'}
                </h1>
            </header>
            
            <main className="flex-grow overflow-y-auto px-4 sm:px-6 pt-5 pb-32 space-y-6 hide-scrollbar">
                
                {/* Basic Info */}
                <div className="space-y-4">
                    <Input 
                        label="Nombre de la Receta" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="NOMBRE DE LA RECETA..." 
                    />
                    
                    <div className="group">
                        <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 block">Tipo de Comida</label>
                        <div className="relative">
                            <select 
                                value={mealType} 
                                onChange={e => setMealType(e.target.value as any)} 
                                className="w-full bg-surface-bg border border-surface-border rounded-xl p-4 text-sm font-bold text-white focus:border-brand-accent outline-none appearance-none uppercase transition-colors tracking-wide"
                            >
                                <option>Desayuno</option>
                                <option>Almuerzo</option>
                                <option>Cena</option>
                                <option>Colación</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronRightIcon className="w-4 h-4 text-text-secondary rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Macros */}
                <MacroHUD macros={macros} />
                
                {/* Ingredients */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-[9px] font-bold text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2">
                            <PlateIcon className="w-3 h-3" />
                            Ingredientes
                        </h3>
                        <span className="text-[9px] font-bold text-text-secondary">{foods.length} items</span>
                    </div>
                    
                    <div className="space-y-1 min-h-[100px]">
                        {foods.map((food) => (
                            <IngredientRow 
                                key={food.foodItem.id} 
                                item={food} 
                                onUpdatePortion={(val) => handleUpdatePortion(food.foodItem.id, val)}
                                onRemove={() => handleRemoveIngredient(food.foodItem.id)}
                            />
                        ))}
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsAddingIngredient(true)} 
                            icon={PlusIcon} 
                            className="w-full mt-4 !py-4 !border-dashed border-surface-border hover:border-brand-accent/50 !rounded-xl text-xs uppercase tracking-widest text-text-secondary hover:text-white"
                        >
                            Añadir Ingrediente
                        </Button>
                    </div>
                </div>
                
                {/* Prep */}
                <div className="group">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 block">Instrucciones</label>
                    <textarea 
                        value={preparation} 
                        onChange={e => setPreparation(e.target.value)} 
                        placeholder="Describe los pasos del proceso..." 
                        rows={6} 
                        className="w-full p-4 bg-surface-bg border border-surface-border rounded-xl focus:border-brand-accent outline-none text-sm font-medium text-white placeholder:text-white/20 resize-none leading-relaxed transition-colors tracking-wide"
                    />
                </div>
            </main>

            {/* Fixed Footer Button */}
            <FloatingDock>
                <Button onClick={handleSave} variant="high-contrast" size="large" className="w-full shadow-lg shadow-brand-accent/20 py-4 text-xs" icon={CheckIcon}>
                    GUARDAR CAMBIOS
                </Button>
            </FloatingDock>
        </div>
    );
};

export default RecipeEditorView;
