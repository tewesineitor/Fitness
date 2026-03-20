
import React, { useState, useMemo, useContext, useCallback, useRef, useEffect } from 'react';
import { FoodItem, AddedFood, MealType } from '../../types';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import FloatingDock from '../../components/FloatingDock';
import { SearchIcon, ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, BarcodeIcon, ProteinShakeIcon, BowlIcon, MoleculeIcon, AppleIcon, CameraIcon, MinusIcon, PhotoIcon, BookOpenIcon, PlateIcon, XIcon, SparklesIcon } from '../../components/icons';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { FoodItemEditor } from './FoodItemEditor';
import { foodImageMap, defaultRecipeImage, vibrate } from '../../utils/helpers';
import * as thunks from '../../thunks';
import Modal from '../../components/Modal';
import BarcodeScannerView from './BarcodeScannerView';
import PlateSummary from '../../components/nutricion/PlateSummary';
import PortionEditorModal from '../../components/dialogs/PortionEditorModal';
import RawDataDebugModal from '../../components/dialogs/RawDataDebugModal';
import DataCorrectionModal from '../../components/dialogs/DataCorrectionModal';
import { selectDailyGoals } from '../../selectors/profileSelectors';
import { selectConsumedMacros } from '../../selectors/nutritionSelectors';
import type { OpenFoodFactsProductData } from '../../services/aiService';
import type { IconComponent } from '../../types';

// --- TYPES & CONSTANTS ---
type FoodCategory = FoodItem['category'];
type MainCategory = 'Todos' | 'Proteínas' | 'Carbohidratos' | 'Frutas y Verduras' | 'Grasas' | 'Preparados';
type ProcessingState = 'fetching' | 'analyzing' | null;

const filterCategories: { key: MainCategory; label: string; icon: IconComponent; activeColorClass: string }[] = [
    { key: 'Todos', label: 'Todos', icon: BookOpenIcon, activeColorClass: 'text-white bg-white/10' },
    { key: 'Proteínas', label: 'Proteínas', icon: ProteinShakeIcon, activeColorClass: 'text-brand-protein bg-brand-protein/10 border-brand-protein/20' },
    { key: 'Carbohidratos', label: 'Carbs', icon: BowlIcon, activeColorClass: 'text-brand-carbs bg-brand-carbs/10 border-brand-carbs/20' },
    { key: 'Frutas y Verduras', label: 'Verduras', icon: AppleIcon, activeColorClass: 'text-green-400 bg-green-400/10 border-green-400/20' },
    { key: 'Grasas', label: 'Grasas', icon: MoleculeIcon, activeColorClass: 'text-brand-fat bg-brand-fat/10 border-brand-fat/20' },
    { key: 'Preparados', label: 'Calle/Prep', icon: PlateIcon, activeColorClass: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20' },
];

// Mapping high-level tabs to specific categories
const categoryFilterMap: Record<string, FoodCategory[]> = {
    'Proteínas': [
        'Carnicería (Pollo)',
        'Carnicería (Res)',
        'Carnicería (Cerdo)',
        'Pescadería',
        'Huevo y Lácteos', 
        'Embutidos', 
        'Suplementos',
        'Enlatados'
    ],
    'Carbohidratos': [
        'Tortillas y Maíz',
        'Panadería',
        'Cereales y Tubérculos',
        'Legumbres',
        'Untables / Extras'
    ],
    'Frutas y Verduras': [
        'Frutas',
        'Verduras'
    ],
    'Grasas': [
        'Grasas y Aceites',
        'Semillas y Frutos Secos',
        'Condimentos y Salsas'
    ],
    'Preparados': [
        'Calle (Antojitos)',
        'Calle (Caldos)'
    ]
};

// Short labels for the chips
const subCategoryLabels: Record<string, string> = {
    'Carnicería (Pollo)': 'Pollo',
    'Carnicería (Res)': 'Res',
    'Carnicería (Cerdo)': 'Cerdo',
    'Calle (Antojitos)': 'Antojitos',
    'Calle (Caldos)': 'Caldos',
    'Pescadería': 'Pescado',
    'Enlatados': 'Enlatados',
    'Huevo y Lácteos': 'Lácteos',
    'Embutidos': 'Embutidos',
    'Panadería': 'Panadería',
    'Tortillas y Maíz': 'Maíz',
    'Cereales y Tubérculos': 'Cereales',
    'Frutas': 'Frutas',
    'Verduras': 'Verduras',
    'Legumbres': 'Legumbres',
    'Semillas y Frutos Secos': 'Semillas',
    'Grasas y Aceites': 'Grasas',
    'Condimentos y Salsas': 'Salsas',
    'Suplementos': 'Suplementos',
    'Untables / Extras': 'Untables'
};

// Helper to sort categories by priority
const getCategoryPriority = (category: string): number => {
    if (categoryFilterMap['Proteínas'].includes(category as FoodCategory)) return 1;
    if (categoryFilterMap['Carbohidratos'].includes(category as FoodCategory)) return 2;
    if (categoryFilterMap['Frutas y Verduras'].includes(category as FoodCategory)) return 3;
    if (categoryFilterMap['Grasas'].includes(category as FoodCategory)) return 4;
    if (categoryFilterMap['Preparados'].includes(category as FoodCategory)) return 5;
    return 6; // Otros
};


// --- SUB-COMPONENTS ---
const FoodItemCard: React.FC<{ food: FoodItem; quantity: number; onQuantityChange: (delta: number) => void; onEditPortion: () => void; onEditFood: () => void; onDeleteFood?: () => void; }> = React.memo(({ food, quantity, onQuantityChange, onEditPortion, onEditFood, onDeleteFood }) => {
    const calculatedMacros = useMemo(() => {
        const baseMacros = food?.macrosPerPortion;
        if (!baseMacros) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
        
        const displayQuantity = quantity > 0 ? quantity : 1;
        return {
            kcal: (baseMacros.kcal || 0) * displayQuantity,
            protein: (baseMacros.protein || 0) * displayQuantity,
            carbs: (baseMacros.carbs || 0) * displayQuantity,
            fat: (baseMacros.fat || 0) * displayQuantity,
        };
    }, [food?.macrosPerPortion, quantity]);

    if (!food) return null;

    const isSelected = quantity > 0;
    const displayQty = quantity > 0 ? quantity : 1;
    
    const basePortionLabel = food.standardPortion ? food.standardPortion.split('(')[0].trim() : '';

    return (
        <div 
            className={`group relative p-3 rounded-2xl transition-all duration-200 border ${
                isSelected 
                    ? 'bg-surface-hover border-brand-accent/40 shadow-sm' 
                    : 'bg-surface-bg border-surface-border/50 hover:border-surface-border'
            }`}
        >
            <div className="flex gap-4">
                {/* Image */}
                <div className="relative flex-shrink-0">
                    <img 
                        src={foodImageMap[food.id] || defaultRecipeImage} 
                        alt={food.name} 
                        className={`w-16 h-16 object-cover rounded-xl transition-all duration-300 ${isSelected ? 'scale-105' : 'opacity-80 group-hover:opacity-100'}`} 
                    />
                    {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-text-primary text-bg-base w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-surface-bg shadow-lg z-10">
                            {quantity % 1 === 0 ? quantity : quantity.toFixed(1)}
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                    {/* Header: Name & Brand */}
                    <div className="pr-16"> {/* Space for calories/actions */}
                        <p className={`font-bold text-[13px] uppercase tracking-tight line-clamp-1 ${isSelected ? 'text-brand-accent' : 'text-text-primary'}`}>
                            {food.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {food.brand && (
                                <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60 truncate max-w-[100px]">
                                    {food.brand}
                                </span>
                            )}
                            <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/40">•</span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary/60">{basePortionLabel}</span>
                        </div>
                    </div>

                    {/* Middle: Macros & Action */}
                    <div className="flex justify-between items-end mt-2">
                        {/* Macros */}
                        <div className="flex gap-2.5 text-[9px] font-bold font-mono">
                            <div className="flex flex-col">
                                <span className="text-brand-protein uppercase opacity-40 text-[7px] leading-none mb-0.5">Prot</span>
                                <span className="text-brand-protein">{calculatedMacros.protein.toFixed(1)}g</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-carbs uppercase opacity-40 text-[7px] leading-none mb-0.5">Carb</span>
                                <span className="text-brand-carbs">{calculatedMacros.carbs.toFixed(1)}g</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-brand-fat uppercase opacity-40 text-[7px] leading-none mb-0.5">Gras</span>
                                <span className="text-brand-fat">{calculatedMacros.fat.toFixed(1)}g</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isSelected ? (
                                <div className="flex items-center bg-surface-bg rounded-xl border border-surface-border shadow-sm overflow-hidden">
                                    <button onClick={() => { vibrate(5); onQuantityChange(-0.5); }} className="p-2 hover:bg-surface-hover text-text-secondary hover:text-brand-accent transition-colors border-r border-surface-border"><MinusIcon className="w-3 h-3" /></button>
                                    <button onClick={onEditPortion} className="px-3 text-center font-bold text-[11px] text-text-primary hover:text-brand-accent transition-colors font-mono">{quantity % 1 === 0 ? quantity : quantity.toFixed(1)}</button>
                                    <button onClick={() => { vibrate(5); onQuantityChange(0.5); }} className="p-2 hover:bg-surface-hover text-text-secondary hover:text-brand-accent transition-colors border-l border-surface-border"><PlusIcon className="w-3 h-3" /></button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { vibrate(5); onQuantityChange(1); }} 
                                    className="bg-surface-hover hover:bg-brand-accent text-brand-accent hover:text-surface-bg w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-surface-border shadow-sm active:scale-90"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-1.5 ml-0.5">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditFood(); }} 
                                    className="w-9 h-9 bg-surface-bg border border-surface-border rounded-xl flex items-center justify-center text-text-secondary hover:text-brand-accent hover:border-brand-accent/40 shadow-sm active:scale-90 transition-all"
                                >
                                    <PencilIcon className="w-4 h-4"/>
                                </button>
                                {onDeleteFood && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteFood(); }} 
                                        className="w-9 h-9 bg-surface-bg border border-surface-border rounded-xl flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-500/40 shadow-sm active:scale-90 transition-all"
                                    >
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calories Badge (Top Right) */}
            <div className="absolute top-3.5 right-4 text-right">
                <div className={`flex flex-col items-end leading-none ${isSelected ? 'text-brand-accent' : 'text-text-primary'}`}>
                    <span className="font-black text-sm font-mono tracking-tighter">
                        {calculatedMacros.kcal.toFixed(0)}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40">kcal</span>
                </div>
            </div>
        </div>
    );
});

const ProcessingModal: React.FC<{ state: ProcessingState }> = ({ state }) => {
    if (!state) return null;

    const message = state === 'fetching'
        ? "Buscando en la base de datos..."
        : "Analizando información con IA...";

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center items-center z-[200] animate-scale-in">
            <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-surface-border rounded-full flex items-center justify-center bg-surface-bg shadow-lg shadow-brand-accent/20">
                    <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse" />
                </div>
                {/* Omit the raw spin, keep it tactile/pulsing */}
                 <div className="absolute inset-0 rounded-full border border-brand-accent/30 animate-ping"></div>
            </div>
            <p className="font-black text-white text-lg tracking-tight uppercase px-4 text-center">{message}</p>
            <p className="text-text-secondary text-[10px] uppercase tracking-widest mt-2">{state === 'fetching' ? 'Conectando...' : 'Procesando vision...'}</p>
        </div>
    );
};

// --- MAIN VIEW ---

interface AddFoodViewProps {
    onBack: () => void;
    allFoodData: FoodItem[];
    initialFoods?: AddedFood[];
    initialMealName?: string;
}

export const AddFoodView: React.FC<AddFoodViewProps> = ({ onBack, allFoodData, initialFoods = [], initialMealName = '' }) => {
    const { state, dispatch } = useContext(AppContext)!;
    const dailyGoals = selectDailyGoals(state);
    const consumedMacros = selectConsumedMacros(state); // Added to get daily consumption
    const [plate, setPlate] = useState<AddedFood[]>(initialFoods);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [mealName, setMealName] = useState(initialMealName);
    const [selectedMealType, setSelectedMealType] = useState<MealType>('Desayuno');
    const [timing, setTiming] = useState<'pre-workout' | 'post-workout' | 'general' | undefined>(undefined);

    const [activeFilterCategory, setActiveFilterCategory] = useState<MainCategory>('Todos');
    const [activeSubFilter, setActiveSubFilter] = useState<FoodCategory | 'TODOS'>('TODOS');

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorCategory, setEditorCategory] = useState<FoodCategory | undefined>();
    const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);
    const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [portionEditorItem, setPortionEditorItem] = useState<AddedFood | null>(null);
    const [isProcessingImage, setIsProcessingImage] = useState(false);
    const [processingImageUrl, setProcessingImageUrl] = useState<string | null>(null);
    const [processingBarcodeState, setProcessingBarcodeState] = useState<ProcessingState>(null);
    const [showImageSourceModal, setShowImageSourceModal] = useState(false);
    const [debugData, setDebugData] = useState<OpenFoodFactsProductData | null>(null);
    const [foodForConfirmation, setFoodForConfirmation] = useState<FoodItem | null>(null);
    
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Scroll tracking
    const [showControls, setShowControls] = useState(true);
    const lastScrollY = useRef(0);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Reset sub-filter when main category changes
    useEffect(() => {
        setActiveSubFilter('TODOS');
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    }, [activeFilterCategory]);

    useEffect(() => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    }, [activeSubFilter]);

    // ... (foodsToShow, plateMap, macros logic remains same) ...
    const foodsToShow = useMemo(() => {
        let items = allFoodData;

        // 1. Filter by Search (Global Override)
        if (searchTerm) {
            return items.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // 2. Filter by Main Category
        if (activeFilterCategory !== 'Todos') {
            const subCategories = categoryFilterMap[activeFilterCategory];
            items = items.filter(food => subCategories.includes(food.category));
        }

        // 3. Filter by Sub Category (If specific chip selected)
        if (activeSubFilter !== 'TODOS') {
            items = items.filter(food => food.category === activeSubFilter);
        }

        // 4. Grouping Logic
        return items.reduce((acc: Record<string, FoodItem[]>, food) => {
            const subCategory = food.category;
            if (!acc[subCategory]) acc[subCategory] = [];
            acc[subCategory].push(food);
            return acc;
        }, {} as Record<string, FoodItem[]>);
    }, [allFoodData, activeFilterCategory, searchTerm, activeSubFilter]);

    const plateMap = useMemo(() => {
        const map = new Map<string, number>();
        plate.forEach(item => map.set(item.foodItem.id, item.portions));
        return map;
    }, [plate]);

    const macros = useMemo(() => plate.reduce((acc, item) => {
        const itemMacros = item.foodItem?.macrosPerPortion;
        if (!itemMacros) return acc;
        acc.kcal += (itemMacros.kcal || 0) * item.portions;
        acc.protein += (itemMacros.protein || 0) * item.portions;
        acc.carbs += (itemMacros.carbs || 0) * item.portions;
        acc.fat += (itemMacros.fat || 0) * item.portions;
        return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 }), [plate]);

    const handleItemQuantityChange = useCallback((food: FoodItem, delta: number) => {
        setPlate(prevPlate => {
            const existingIndex = prevPlate.findIndex(item => item.foodItem.id === food.id);
            if (existingIndex !== -1) {
                const newPortions = prevPlate[existingIndex].portions + delta;
                if (newPortions > 0) {
                    const newPlate = [...prevPlate];
                    newPlate[existingIndex] = { ...newPlate[existingIndex], portions: newPortions };
                    return newPlate;
                } else {
                    return prevPlate.filter((_, index) => index !== existingIndex);
                }
            } else if (delta > 0) {
                return [...prevPlate, { foodItem: food, portions: delta }];
            }
            return prevPlate;
        });
    }, []);

    // ... (other handlers remain same) ...
    const handleUpdateItemPortion = useCallback((foodId: string, newPortions: number) => {
         setPlate(prevPlate => {
            if (newPortions <= 0) return prevPlate.filter(item => item.foodItem.id !== foodId);
            const existingIndex = prevPlate.findIndex(item => item.foodItem.id === foodId);
            if (existingIndex !== -1) {
                const newPlate = [...prevPlate];
                newPlate[existingIndex] = { ...newPlate[existingIndex], portions: newPortions };
                return newPlate;
            }
             const foodToAdd = allFoodData.find(f => f.id === foodId);
             if (foodToAdd) return [...prevPlate, { foodItem: foodToAdd, portions: newPortions }];
            return prevPlate;
        });
        setPortionEditorItem(null);
    }, [allFoodData]);

    const handleEditItemPortion = useCallback((food: FoodItem) => {
        const itemInPlate = plate.find(p => p.foodItem.id === food.id);
        setPortionEditorItem(itemInPlate || { foodItem: food, portions: 0 });
    }, [plate]);

    const handleOpenEditor = useCallback((category?: FoodCategory, food?: FoodItem) => {
        setEditorCategory(category);
        setFoodToEdit(food || null);
        setIsEditorOpen(true);
    }, []);

    const handleCloseEditor = () => { setIsEditorOpen(false); setFoodToEdit(null); setEditorCategory(undefined); };
    const handleDelete = () => { if (foodToDelete) { dispatch({ type: 'DELETE_CUSTOM_FOOD', payload: foodToDelete.id }); setFoodToDelete(null); } };
    
    const handleScanSuccess = useCallback(async (barcode: string) => {
        setIsScannerOpen(false);
        setProcessingBarcodeState('fetching');
        const productData = await dispatch(thunks.fetchProductByBarcodeThunk(barcode));
        setProcessingBarcodeState(null);
        
        if (productData) {
            setDebugData(productData);
        }
    }, [dispatch]);
    
    const proceedWithAnalysis = async (productData: OpenFoodFactsProductData) => {
        setDebugData(null);
        setProcessingBarcodeState('analyzing');
        const result = await dispatch(thunks.processScannedProductThunk(productData));
        setProcessingBarcodeState(null);
        
        if (result.foodItem) {
            if (result.needsConfirmation) {
                setFoodForConfirmation(result.foodItem);
            } else {
                handleOpenEditor(result.foodItem.category, result.foodItem);
            }
        }
    };

    const handleCloseScanner = useCallback(() => { setIsScannerOpen(false); }, []);

    const handleSourceSelection = (source: 'camera' | 'gallery') => {
        setShowImageSourceModal(false);
        if (source === 'camera') cameraInputRef.current?.click();
        else galleryInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessingImage(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result as string;
            setProcessingImageUrl(result);
            const base64ImageString = result?.split(',')[1];
            if (!base64ImageString) { setIsProcessingImage(false); setProcessingImageUrl(null); return; }
            
            const extractedData = await dispatch(thunks.extractNutritionDataThunk(base64ImageString, file.type));
            setIsProcessingImage(false);
            setProcessingImageUrl(null);

            if (extractedData) {
                const p = extractedData.protein_g || 0, c = extractedData.carbs_g || 0, f = extractedData.fat_g || 0;
                const kcal = p * 4 + c * 4 + f * 9;
                let rawWeight: number | undefined;
                if (extractedData.serving_size_string) {
                    const match = extractedData.serving_size_string.match(/([\d.,]+)\s*g/);
                    if (match) rawWeight = parseFloat(match[1].replace(',', '.'));
                }
                const tempFood: FoodItem = {
                    id: `ai-temp-${Date.now()}`, name: '', category: 'Suplementos',
                    standardPortion: extractedData.serving_size_string || '',
                    rawWeightG: rawWeight,
                    macrosPerPortion: { protein: p, carbs: c, fat: f, kcal: kcal },
                    isUserCreated: true,
                };
                handleOpenEditor(undefined, tempFood);
            }
            if (event.target) event.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    const handleRegister = () => { dispatch(thunks.registerMealThunk(plate, mealName || selectedMealType || undefined, timing)); onBack(); };
    const handleClearPlate = () => { setPlate([]); setMealName(''); setSelectedMealType('Desayuno'); setTiming(undefined); };

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const currentScrollY = scrollContainerRef.current.scrollTop;
        const scrollThreshold = 50; // Increased threshold for stability

        if (currentScrollY <= 10) {
            setShowControls(true);
            lastScrollY.current = currentScrollY;
            return;
        }

        const diff = currentScrollY - lastScrollY.current;
        
        // Only toggle if difference is significant
        if (Math.abs(diff) > scrollThreshold) {
            if (diff > 0 && showControls) {
                setShowControls(false);
            } else if (diff < 0 && !showControls) {
                setShowControls(true);
            }
            lastScrollY.current = currentScrollY;
        }
    }, [showControls]);

    return (
        <div className="flex flex-col h-full w-full bg-transparent relative overflow-hidden">
            {/* --- Modals and Overlays --- */}
            <ProcessingModal state={processingBarcodeState} />
            {isProcessingImage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col justify-center items-center z-[100] animate-fade-in-up">
                    {processingImageUrl ? (
                        <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden border border-surface-border shadow-lg">
                            <img src={processingImageUrl} alt="Processing" className="w-full h-full object-cover opacity-50" />
                            <div className="absolute inset-0 border-2 border-brand-accent/30 rounded-2xl"></div>
                            {/* Laser Line */}
                            <div className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),1)] animate-scan-vertical"></div>
                        </div>
                    ) : (
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-t-brand-accent border-surface-border rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse" />
                            </div>
                        </div>
                    )}
                    <p className="font-bold text-white text-lg tracking-tight uppercase">Analizando Imagen</p>
                    <p className="text-white/60 text-xs mt-2 font-mono">La IA está leyendo los datos nutricionales...</p>
                </div>
            )}
            
            {isEditorOpen && <FoodItemEditor category={editorCategory} existingFood={foodToEdit || undefined} onClose={handleCloseEditor} />}
            {foodToDelete && <ConfirmationDialog title="Eliminar Ingrediente" message={`¿Seguro que quieres eliminar "${foodToDelete.name}"?`} onConfirm={handleDelete} onCancel={() => setFoodToDelete(null)} />}
            {isScannerOpen && <BarcodeScannerView onScanSuccess={handleScanSuccess} onClose={handleCloseScanner} />}
            {portionEditorItem && <PortionEditorModal food={portionEditorItem} onSave={(p) => handleUpdateItemPortion(portionEditorItem.foodItem.id, p)} onClose={() => setPortionEditorItem(null)} />}
            
            {showImageSourceModal && (
                <Modal onClose={() => setShowImageSourceModal(false)} className="max-w-sm">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Fuente de Imagen</h3>
                            <button onClick={() => setShowImageSourceModal(false)}><XIcon className="w-5 h-5 text-text-secondary hover:text-text-primary"/></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleSourceSelection('camera')}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-bg border border-surface-border hover:bg-surface-hover hover:border-brand-accent/30 transition-all group aspect-square active:scale-95"
                            >
                                <div className="p-4 rounded-full bg-surface-hover border border-surface-border mb-3 group-hover:scale-110 transition-transform">
                                    <CameraIcon className="w-8 h-8 text-brand-accent" />
                                </div>
                                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Cámara</span>
                            </button>

                            <button 
                                onClick={() => handleSourceSelection('gallery')}
                                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-bg border border-surface-border hover:bg-surface-hover hover:border-brand-accent/30 transition-all group aspect-square active:scale-95"
                            >
                                <div className="p-4 rounded-full bg-surface-hover border border-surface-border mb-3 group-hover:scale-110 transition-transform">
                                    <PhotoIcon className="w-8 h-8 text-brand-carbs" />
                                </div>
                                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Galería</span>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            
             {debugData && (
                <RawDataDebugModal 
                    data={debugData} 
                    onConfirm={() => proceedWithAnalysis(debugData)} 
                    onCancel={() => setDebugData(null)}
                />
            )}
            {foodForConfirmation && (
                <DataCorrectionModal
                    foodItem={foodForConfirmation}
                    onConfirm={() => {
                        handleOpenEditor(foodForConfirmation.category, foodForConfirmation);
                        setFoodForConfirmation(null);
                    }}
                    onCancel={() => setFoodForConfirmation(null)}
                />
            )}

            {/* --- Header (Fixed) --- */}
            <header className="flex-shrink-0 z-40">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-0 pt-2 sm:pt-4">
                    <div className="flex items-center justify-between mb-2 relative">
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className="p-2 bg-surface-hover rounded-xl text-text-secondary hover:text-text-primary transition-all border border-surface-border active:scale-95">
                                <ChevronRightIcon className="w-4 h-4 rotate-180" />
                            </button>
                            <h1 className="text-lg sm:text-xl font-black text-text-primary uppercase tracking-tight leading-none ml-[15px]">Añadir Comida</h1>
                        </div>

                        <div className="relative">
                            <button 
                                onClick={() => setShowAddOptions(!showAddOptions)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${showAddOptions ? 'bg-brand-accent text-surface-bg border-brand-accent' : 'bg-surface-hover text-text-primary border-surface-border'}`}
                            >
                                <PlusIcon className={`w-5 h-5 transition-transform duration-300 ${showAddOptions ? 'rotate-45' : ''}`} />
                            </button>

                            {/* Dropdown Menu - Fully Opaque */}
                            {showAddOptions && (
                                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-900 border border-surface-border rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                    <button 
                                        onClick={() => { vibrate(5); handleOpenEditor(); setShowAddOptions(false); }}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4 text-brand-accent" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Manual</span>
                                    </button>
                                    <button 
                                        onClick={() => { vibrate(5); setShowImageSourceModal(true); setShowAddOptions(false); }}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <CameraIcon className="w-4 h-4 text-brand-accent" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Foto IA</span>
                                    </button>
                                    <button 
                                        onClick={() => { vibrate(5); setIsScannerOpen(true); setShowAddOptions(false); }}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <BarcodeIcon className="w-4 h-4 text-brand-accent" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Escáner</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Search and Categories */}
                    <div className="relative mb-1">
                        <input 
                            type="search" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="BUSCAR ALIMENTO..." 
                            className="w-full h-[40px] pl-12 pr-4 bg-surface-hover border border-surface-border rounded-xl focus:border-brand-accent outline-none text-[14.5px] font-bold text-text-primary placeholder:text-text-secondary/30 transition-all uppercase tracking-wide shadow-sm" 
                        />
                        <input type="file" ref={galleryInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>

                    {!searchTerm && (
                        <div className="flex flex-col gap-2 pt-[10px] pb-0">
                            {/* Level 1: Main Categories */}
                            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                                {filterCategories.map(({ key, label, icon: Icon, activeColorClass }) => {
                                    const isActive = activeFilterCategory === key;
                                    return (
                                        <button 
                                            key={key} 
                                            onClick={() => {
                                                setActiveFilterCategory(key);
                                                setActiveSubFilter('TODOS');
                                            }} 
                                            className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 min-w-[4.5rem] h-14 flex-shrink-0 transition-all duration-200 border active:scale-95 shadow-sm ${ 
                                                isActive 
                                                    ? `bg-text-primary border-text-primary ${activeColorClass} !text-bg-base` 
                                                    : 'bg-surface-bg text-text-secondary border-surface-border hover:bg-surface-hover hover:border-surface-border/80' 
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-surface-bg' : 'opacity-60'}`} />
                                            <span className={`text-[8px] font-bold leading-tight uppercase tracking-widest ${isActive ? 'text-surface-bg' : 'opacity-60'}`}> {label} </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Level 2: Sub-Filters (Contextual Chips) */}
                            {activeFilterCategory !== 'Todos' && (
                                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar animate-fade-in-up py-2">
                                    <button
                                        onClick={() => setActiveSubFilter('TODOS')}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                                            activeSubFilter === 'TODOS' 
                                                ? 'bg-brand-accent text-surface-bg border-brand-accent' 
                                                : 'bg-surface-hover text-text-secondary border-surface-border hover:text-text-primary hover:border-text-primary/30'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    
                                    {categoryFilterMap[activeFilterCategory]?.map((subCat) => {
                                        const isActive = activeSubFilter === subCat;
                                        
                                        return (
                                            <button
                                                key={subCat}
                                                onClick={() => setActiveSubFilter(subCat)}
                                                className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                                                    isActive 
                                                        ? 'bg-brand-accent text-surface-bg border-brand-accent' 
                                                        : 'bg-surface-hover text-text-secondary border-surface-border hover:text-text-primary hover:border-text-primary/30'
                                                }`}
                                            >
                                                {subCategoryLabels[subCat] || subCat}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
            
            {/* --- Main Content (Scrollable) --- */}
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow overflow-y-auto pb-40 w-full hide-scrollbar"
            >
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-[30px] space-y-4">
                    {Array.isArray(foodsToShow) ? ( // Search results OR Sub-filtered view (Flat List)
                        <div className="space-y-3">
                            {foodsToShow.map(food => <FoodItemCard key={food.id} food={food} quantity={plateMap.get(food.id) || 0} onQuantityChange={(d) => handleItemQuantityChange(food, d)} onEditPortion={() => handleEditItemPortion(food)} onEditFood={() => handleOpenEditor(food.category, food)} onDeleteFood={food.isUserCreated ? () => setFoodToDelete(food) : undefined} />)}
                        </div>
                    ) : ( // Category grouped view (Default "Todos" or Parent Category "Todo")
                        Object.entries(foodsToShow)
                            .sort(([catA], [catB]) => {
                                    const priorityA = getCategoryPriority(catA);
                                    const priorityB = getCategoryPriority(catB);
                                    if (priorityA !== priorityB) return priorityA - priorityB;
                                    return catA.localeCompare(catB);
                            })
                            .map(([category, foods]) => (
                            <div key={category} className="mb-8 last:mb-0">
                                <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.25em] mb-4 pl-1 sticky top-0 bg-bg-base py-4 z-10 border-b border-surface-border">{category}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {(foods as FoodItem[]).map(food => <FoodItemCard key={food.id} food={food} quantity={plateMap.get(food.id) || 0} onQuantityChange={(d) => handleItemQuantityChange(food, d)} onEditPortion={() => handleEditItemPortion(food)} onEditFood={() => handleOpenEditor(food.category, food)} onDeleteFood={food.isUserCreated ? () => setFoodToDelete(food) : undefined} />)}
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Empty State Handle */}
                    {((Array.isArray(foodsToShow) && foodsToShow.length === 0) || (!Array.isArray(foodsToShow) && Object.keys(foodsToShow).length === 0)) && (
                        <div className="text-center py-20 text-text-secondary">
                            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-border opacity-50">
                                <BookOpenIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40">No se encontraron resultados</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Plate Summary (Fixed at bottom) --- */}
            {plate.length > 0 && (
                <PlateSummary 
                    plate={plate} 
                    macros={macros} 
                    mealName={mealName} 
                    onMealNameChange={setMealName} 
                    onRegister={handleRegister} 
                    onClear={handleClearPlate} 
                    selectedMealType={selectedMealType} 
                    onSelectMealType={setSelectedMealType} 
                    onUpdateItemPortion={handleUpdateItemPortion} 
                    onEditItemPortion={(item) => setPortionEditorItem(item)} 
                    dailyGoals={dailyGoals}
                    consumedMacros={consumedMacros}
                    timing={timing}
                    onTimingChange={(t) => setTiming(prev => prev === t ? undefined : t)}
                />
            )}
        </div>
    );
};
