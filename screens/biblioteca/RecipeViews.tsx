
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Recipe } from '../../types';
import { ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, SparklesIcon, PlateIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import { calculateMacros, vibrate } from '../../utils/helpers';
import Button from '../../components/Button';
import ChipButton from '../../components/ChipButton';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import RecipeEditorView from './recipes/RecipeEditorView';
import RecipeDetailView from './recipes/RecipeDetailView';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { generateRecipeThunk } from '../../thunks';
import Modal from '../../components/Modal';

const defaultRecipeImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

// --- SUB-COMPONENTS ---

const MacroPill: React.FC<{ label: string, value: number, colorClass: string }> = ({ label, value, colorClass }) => (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-surface-border bg-surface-bg/40 backdrop-blur-md`}>
        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></div>
        <span className="text-[9px] font-bold text-text-primary leading-none">{value.toFixed(0)}{label}</span>
    </div>
);

const RecipeGeneratorModal: React.FC<{
    onClose: () => void;
    onGenerated: (data: Omit<Recipe, 'id' | 'type' | 'imageUrl'>) => void;
}> = ({ onClose, onGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { dispatch } = useContext(AppContext)!;

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Describe tus ingredientes o antojo.');
            return;
        }
        setError(null);
        setIsLoading(true);
        const result = await dispatch(generateRecipeThunk(prompt));
        setIsLoading(false);

        if (result.success) {
            onGenerated(result.data);
        } else {
            if ('error' in result) setError(result.error);
        }
    };

    return (
        <Modal onClose={onClose} className="max-w-lg bg-surface-bg border border-surface-border">
            <div className="p-6">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-2xl flex items-center justify-center border border-brand-accent/30 shadow-[0_0_30px_rgba(var(--color-brand-accent-rgb),0.15)] animate-pulse">
                        <SparklesIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                </div>
                
                <h3 className="text-xl font-black text-center text-text-primary uppercase tracking-tight mb-2">Chef IA <span className="text-brand-accent">v2.0</span></h3>
                <p className="text-xs text-center text-text-secondary mb-6 max-w-xs mx-auto leading-relaxed">
                    Algoritmo de generación culinaria. Ingresa parámetros (ingredientes, tipo de dieta, antojo) para compilar una nueva receta.
                </p>
                
                <div className="relative group mb-6">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: Tengo pollo, arroz y aguacate. Quiero algo rápido y picante..."
                        className="w-full p-4 bg-surface-hover border border-surface-border rounded-xl focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 outline-none text-sm h-32 resize-none transition-all placeholder:text-surface-border font-medium text-text-primary"
                        disabled={isLoading}
                    />
                    {/* Corner accent */}
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-brand-accent/50"></div>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-[10px] font-bold uppercase tracking-wide text-center">{error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Button onClick={handleGenerate} variant="high-contrast" disabled={isLoading} icon={SparklesIcon} className="w-full shadow-lg shadow-brand-accent/10 py-4 text-xs font-black tracking-[0.2em]">
                        {isLoading ? 'PROCESANDO DATOS...' : 'GENERAR RECETA'}
                    </Button>
                    <Button variant="tertiary" size="small" onClick={onClose} disabled={isLoading} className="w-full py-2">
                        Cancelar Operación
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

// --- REDESIGNED CARD (MOBILE FIRST) ---
const RecipeCard: React.FC<{
    recipe: Recipe,
    onSelect: () => void,
    onEdit?: () => void,
    onDelete?: () => void,
}> = ({ recipe, onSelect, onEdit, onDelete }) => {
    const macros = useMemo(() => calculateMacros(recipe.foods), [recipe.foods]);
    const imageUrl = recipe.imageUrl || defaultRecipeImage;
    const isUserRecipe = !!onEdit;

    return (
        <div 
            onClick={onSelect} 
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer bg-surface-bg border border-surface-border active:scale-[0.98] transition-all duration-300 shadow-lg"
        >
            {/* Background Image */}
            <img 
                src={imageUrl} 
                alt={recipe.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" 
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-bg via-surface-bg/40 to-transparent opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60"></div>

            {/* Top Badge: Type */}
            <div className="absolute top-3 left-3">
                <Tag variant="overlay" size="sm">
                    {recipe.mealType || 'General'}
                </Tag>
            </div>

            {/* Action Buttons (User Recipes Only) */}
            {isUserRecipe && (
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <IconButton
                        onClick={(e) => { e.stopPropagation(); onEdit?.(); }} 
                        icon={PencilIcon}
                        label="Editar receta"
                        variant="secondary"
                        size="small"
                        className="bg-surface-bg/70 backdrop-blur-md"
                    />
                    <IconButton
                        onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
                        icon={TrashIcon}
                        label="Eliminar receta"
                        variant="destructive"
                        size="small"
                        className="bg-surface-bg/70 backdrop-blur-md"
                    />
                </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                <h4 className="font-black text-text-primary text-sm leading-tight line-clamp-2 uppercase tracking-tight drop-shadow-md">
                    {recipe.name}
                </h4>
                
                {/* Info Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <MacroPill label="P" value={macros.protein} colorClass="bg-brand-protein" />
                        <MacroPill label="C" value={macros.carbs} colorClass="bg-brand-carbs" />
                    </div>
                    <span className="text-lg font-black text-brand-accent font-heading tabular-nums drop-shadow-sm">
                        {macros.kcal.toFixed(0)} <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest -ml-1">Kcal</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

// --- LIST VIEW ---

interface RecipesListViewProps {
    onBack: () => void;
    onSelectRecipe: (recipe: Recipe) => void;
    onEditRecipe: (recipe: Recipe) => void;
    onCreateRecipe: () => void;
    onGenerateRecipe: () => void;
}

const RecipesListView: React.FC<RecipesListViewProps> = ({ onBack, onSelectRecipe, onEditRecipe, onCreateRecipe, onGenerateRecipe }) => {
    const [activeTab, setActiveTab] = useState<'plan' | 'user'>('plan');
    const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
    const { state, dispatch } = useContext(AppContext)!;

    const handleDeleteRecipe = () => {
        if (recipeToDelete) {
            dispatch({ type: 'DELETE_MY_RECIPE', payload: recipeToDelete.id });
            setRecipeToDelete(null);
        }
    };
    
    return (
        <div className="animate-fade-in-up">
            <div className="p-4 sm:p-6 space-y-6">
                {recipeToDelete && (
                    <ConfirmationDialog
                        title="Eliminar Archivo"
                        message={`¿Confirmar borrado permanente de "${recipeToDelete.name}"?`}
                        onConfirm={handleDeleteRecipe}
                        onCancel={() => setRecipeToDelete(null)}
                        confirmText="Eliminar"
                    />
                )}
                
                {/* Header */}
                <div className="pt-6">
                    <Button variant="ghost" onClick={onBack} icon={ChevronRightIcon} className="!px-0 hover:!bg-transparent [&_svg]:rotate-180 text-xs uppercase tracking-widest mb-4">
                        Volver
                    </Button>
                    
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tighter uppercase leading-none">
                                Base de <span className="text-brand-accent">Datos</span>
                            </h1>
                            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Archivo Culinario</p>
                        </div>

                        {/* Compact Action Bar */}
                        <div className="flex gap-2">
                            <IconButton
                                onClick={() => { vibrate(5); onGenerateRecipe(); }} 
                                icon={SparklesIcon}
                                label="Chef IA"
                                variant="outline"
                                size="large"
                            />
                            <IconButton
                                onClick={() => { vibrate(5); onCreateRecipe(); }} 
                                icon={PlusIcon}
                                label="Crear receta"
                                variant="primary"
                                size="large"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Tabs (Glass Pill Style) */}
                <div className="flex p-1 bg-surface-bg rounded-full border border-surface-border w-full gap-1">
                    <ChipButton onClick={() => setActiveTab('plan')} active={activeTab === 'plan'} tone="accent" size="medium" className="flex-1">
                        Del Plan
                    </ChipButton>
                    <ChipButton onClick={() => setActiveTab('user')} active={activeTab === 'user'} tone="accent" size="medium" className="flex-1">
                        Mis Recetas
                    </ChipButton>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {activeTab === 'plan' && state.nutrition.allRecipes.map((recipe, index) => (
                        <div key={recipe.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <RecipeCard recipe={recipe} onSelect={() => onSelectRecipe(recipe)} />
                        </div>
                    ))}
                      {activeTab === 'user' && (state.nutrition.myRecipes.length > 0 ? state.nutrition.myRecipes.map((recipe, index) => (
                        <div key={recipe.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <RecipeCard 
                                recipe={recipe} 
                                onSelect={() => onSelectRecipe(recipe)}
                                onEdit={() => onEditRecipe(recipe)} 
                                onDelete={() => setRecipeToDelete(recipe)}
                            />
                        </div>
                    )) : (
                        <div className="col-span-2 py-16 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-surface-border bg-surface-bg/20">
                            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4 border border-surface-border shadow-inner text-text-secondary/30">
                                <PlateIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Sin registros</p>
                            <p className="text-[9px] text-text-secondary/50 font-bold mt-1 uppercase tracking-widest max-w-[200px]">Tu base de datos personal está vacía. Crea una receta o usa la IA.</p>
                            <Button variant="tertiary" size="small" onClick={() => { vibrate(5); onCreateRecipe(); }} className="mt-6">Comenzar</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- MAIN FLOW COMPONENT ---

type RecipeView = 'list' | 'detail' | 'editor';

interface RecipeFlowProps {
    onBack: () => void;
    initialRecipeState?: Recipe | 'new' | 'ai-new' | null;
}

const RecipeFlow: React.FC<RecipeFlowProps> = ({ onBack, initialRecipeState }) => {
    const [view, setView] = useState<RecipeView>('list');
    const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const { dispatch } = useContext(AppContext)!;

    useEffect(() => {
        if (initialRecipeState) {
            if (initialRecipeState === 'new') {
                setActiveRecipe(null);
                setView('editor');
            } else if (initialRecipeState === 'ai-new') {
                setShowAIGenerator(true);
                setView('list');
            } else if (typeof initialRecipeState === 'object') {
                setActiveRecipe(initialRecipeState);
                setView('detail');
            }
        }
    }, [initialRecipeState]);

    useEffect(() => {
        return () => { dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true }); };
    }, [dispatch]);

    useEffect(() => {
        const isListView = view === 'list';
        dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: isListView });
    }, [view, dispatch]);

    const handleGeneratedRecipe = (data: Omit<Recipe, 'id' | 'type' | 'imageUrl'>) => {
        const tempRecipeForEditor: Recipe = {
            id: 'ai-generated',
            type: 'user',
            imageUrl: defaultRecipeImage,
            ...data,
        };
        setActiveRecipe(tempRecipeForEditor);
        setShowAIGenerator(false);
        setView('editor');
    };

    const renderContent = () => {
        switch (view) {
            case 'detail':
                return activeRecipe && <RecipeDetailView recipe={activeRecipe} onBack={() => setView('list')} onGoToEditor={() => setView('editor')} />;
            case 'editor':
                return <RecipeEditorView onBack={() => setView('list')} existingRecipe={activeRecipe || undefined} />;
            case 'list':
            default:
                return <RecipesListView
                    onBack={onBack}
                    onSelectRecipe={recipe => { setActiveRecipe(recipe); setView('detail'); }}
                    onEditRecipe={recipe => { setActiveRecipe(recipe); setView('editor'); }}
                    onCreateRecipe={() => { setActiveRecipe(null); setView('editor'); }}
                    onGenerateRecipe={() => setShowAIGenerator(true)}
                />;
        }
    };

    return (
        <div className="fixed inset-0 z-20 animate-fade-in-up">
            <div className="h-full w-full max-w-3xl mx-auto">
                {showAIGenerator && <RecipeGeneratorModal onClose={() => setShowAIGenerator(false)} onGenerated={handleGeneratedRecipe} />}
                {renderContent()}
            </div>
        </div>
    );
}

export default RecipeFlow;
