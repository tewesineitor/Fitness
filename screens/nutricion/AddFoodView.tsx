import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FoodItem, AddedFood, MealType } from '../../types';
import { AppContext } from '../../contexts';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import { FoodItemEditor } from './FoodItemEditor';
import { vibrate } from '../../utils/helpers';
import * as thunks from '../../thunks';
import BarcodeScannerView from './BarcodeScannerView';
import PlateSummary from '../../components/nutricion/PlateSummary';
import PortionEditorModal from '../../components/dialogs/PortionEditorModal';
import RawDataDebugModal from '../../components/dialogs/RawDataDebugModal';
import DataCorrectionModal from '../../components/dialogs/DataCorrectionModal';
import { selectDailyGoals } from '../../selectors/profileSelectors';
import { selectConsumedMacros } from '../../selectors/nutritionSelectors';
import type { OpenFoodFactsProductData } from '../../services/aiService';
import AddFoodHeader from './add-food/AddFoodHeader';
import AddFoodImageSourceModal from './add-food/AddFoodImageSourceModal';
import AddFoodProcessingOverlay from './add-food/AddFoodProcessingOverlay';
import FoodCatalogView from './add-food/FoodCatalogView';
import { useFoodCatalog } from './add-food/useFoodCatalog';
import type { FoodCategory, MainCategory, ProcessingState } from './add-food/addFoodTypes';

const AddFoodView: React.FC<{
  onBack: () => void;
  allFoodData: FoodItem[];
  initialFoods?: AddedFood[];
  initialMealName?: string;
}> = ({ onBack, allFoodData, initialFoods = [], initialMealName = '' }) => {
  const { state, dispatch } = useContext(AppContext)!;
  const dailyGoals = selectDailyGoals(state);
  const consumedMacros = selectConsumedMacros(state);

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

  useEffect(() => {
    setActiveSubFilter('TODOS');
  }, [activeFilterCategory]);

  const foodsToShow = useFoodCatalog({
    allFoodData,
    searchTerm,
    activeFilterCategory,
    activeSubFilter,
  });

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
        }
        return prevPlate.filter((_, index) => index !== existingIndex);
      }

      if (delta > 0) {
        return [...prevPlate, { foodItem: food, portions: delta }];
      }

      return prevPlate;
    });
  }, []);

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

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setFoodToEdit(null);
    setEditorCategory(undefined);
  };

  const handleDelete = () => {
    if (foodToDelete) {
      dispatch({ type: 'DELETE_CUSTOM_FOOD', payload: foodToDelete.id });
      setFoodToDelete(null);
    }
  };

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

  const handleCloseScanner = useCallback(() => {
    setIsScannerOpen(false);
  }, []);

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
      if (!base64ImageString) {
        setIsProcessingImage(false);
        setProcessingImageUrl(null);
        return;
      }

      const extractedData = await dispatch(thunks.extractNutritionDataThunk(base64ImageString, file.type));
      setIsProcessingImage(false);
      setProcessingImageUrl(null);

      if (extractedData) {
        const p = extractedData.protein_g || 0;
        const c = extractedData.carbs_g || 0;
        const f = extractedData.fat_g || 0;
        const kcal = p * 4 + c * 4 + f * 9;
        let rawWeight: number | undefined;

        if (extractedData.serving_size_string) {
          const match = extractedData.serving_size_string.match(/([\d.,]+)\s*g/);
          if (match) rawWeight = parseFloat(match[1].replace(',', '.'));
        }

        const tempFood: FoodItem = {
          id: `ai-temp-${Date.now()}`,
          name: '',
          category: 'Suplementos',
          standardPortion: extractedData.serving_size_string || '',
          rawWeightG: rawWeight,
          macrosPerPortion: { protein: p, carbs: c, fat: f, kcal },
          isUserCreated: true,
        };

        handleOpenEditor(undefined, tempFood);
      }

      if (event.target) event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = () => {
    dispatch(thunks.registerMealThunk(plate, mealName || selectedMealType || undefined, timing));
    onBack();
  };

  const handleClearPlate = () => {
    setPlate([]);
    setMealName('');
    setSelectedMealType('Desayuno');
    setTiming(undefined);
  };

  return (
    <div className="flex flex-col h-full w-full bg-transparent relative overflow-hidden">
      <AddFoodProcessingOverlay
        barcodeState={processingBarcodeState}
        imageProcessing={isProcessingImage}
        imagePreviewUrl={processingImageUrl}
      />

      {isEditorOpen && <FoodItemEditor category={editorCategory} existingFood={foodToEdit || undefined} onClose={handleCloseEditor} />}
      {foodToDelete && <ConfirmationDialog title="Eliminar Ingrediente" message={`¿Seguro que quieres eliminar "${foodToDelete.name}"?`} onConfirm={handleDelete} onCancel={() => setFoodToDelete(null)} />}
      {isScannerOpen && <BarcodeScannerView onScanSuccess={handleScanSuccess} onClose={handleCloseScanner} />}
      {portionEditorItem && <PortionEditorModal food={portionEditorItem} onSave={(p) => handleUpdateItemPortion(portionEditorItem.foodItem.id, p)} onClose={() => setPortionEditorItem(null)} />}
      {showImageSourceModal && (
        <AddFoodImageSourceModal
          open={showImageSourceModal}
          onClose={() => setShowImageSourceModal(false)}
          onSelectSource={handleSourceSelection}
        />
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

      <input type="file" ref={galleryInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />

      <AddFoodHeader
        onBack={onBack}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showAddOptions={showAddOptions}
        onToggleAddOptions={() => setShowAddOptions(prev => !prev)}
        onOpenManual={() => { vibrate(5); handleOpenEditor(); setShowAddOptions(false); }}
        onOpenImageSource={() => { vibrate(5); setShowImageSourceModal(true); setShowAddOptions(false); }}
        onOpenScanner={() => { vibrate(5); setIsScannerOpen(true); setShowAddOptions(false); }}
        activeFilterCategory={activeFilterCategory}
        onSelectMainCategory={(category) => {
          setActiveFilterCategory(category);
          setActiveSubFilter('TODOS');
        }}
        activeSubFilter={activeSubFilter}
        onSelectSubFilter={setActiveSubFilter}
      />

      <div className="flex-grow overflow-y-auto pb-40 w-full hide-scrollbar">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-[30px] space-y-4">
          <FoodCatalogView
            foodsToShow={foodsToShow}
            plateMap={plateMap}
            onItemQuantityChange={handleItemQuantityChange}
            onEditItemPortion={handleEditItemPortion}
            onOpenEditor={handleOpenEditor}
            onDeleteFood={(food) => setFoodToDelete(food)}
          />
        </div>
      </div>

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

export default AddFoodView;

