import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AddedFood, FoodItem, MealType } from '../../types';
import * as thunks from '../../thunks';
import type { OpenFoodFactsProductData } from '../../services/aiService';
import { AppContext } from '../../contexts';
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog';
import DataCorrectionModal from '../../components/dialogs/DataCorrectionModal';
import PortionEditorModal from '../../components/dialogs/PortionEditorModal';
import RawDataDebugModal from '../../components/dialogs/RawDataDebugModal';
import PlateSummary from '../../components/nutricion/PlateSummary';
import { selectConsumedMacros } from '../../selectors/nutritionSelectors';
import { selectDailyGoals } from '../../selectors/profileSelectors';
import { vibrate } from '../../utils/helpers';
import BarcodeScannerView from './BarcodeScannerView';
import { FoodItemEditor } from './FoodItemEditor';
import AddFoodHeader from './add-food/AddFoodHeader';
import AddFoodImageSourceModal from './add-food/AddFoodImageSourceModal';
import AddFoodProcessingOverlay from './add-food/AddFoodProcessingOverlay';
import type { FoodCategory, MainCategory, ProcessingState } from './add-food/addFoodTypes';
import FoodCatalogView from './add-food/FoodCatalogView';
import { useFoodCatalog } from './hooks/useFoodCatalog';

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

  const resultsCount = useMemo(() => {
    if (Array.isArray(foodsToShow)) return foodsToShow.length;
    return Object.values(foodsToShow).reduce((total, items) => total + items.length, 0);
  }, [foodsToShow]);

  const plateMap = useMemo(() => {
    const map = new Map<string, number>();
    plate.forEach((item) => map.set(item.foodItem.id, item.portions));
    return map;
  }, [plate]);

  const macros = useMemo(
    () =>
      plate.reduce(
        (acc, item) => {
          const itemMacros = item.foodItem?.macrosPerPortion;
          if (!itemMacros) return acc;
          acc.kcal += (itemMacros.kcal || 0) * item.portions;
          acc.protein += (itemMacros.protein || 0) * item.portions;
          acc.carbs += (itemMacros.carbs || 0) * item.portions;
          acc.fat += (itemMacros.fat || 0) * item.portions;
          return acc;
        },
        { kcal: 0, protein: 0, carbs: 0, fat: 0 }
      ),
    [plate]
  );

  const handleItemQuantityChange = useCallback((food: FoodItem, delta: number) => {
    setPlate((prevPlate) => {
      const existingIndex = prevPlate.findIndex((item) => item.foodItem.id === food.id);
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

  const handleUpdateItemPortion = useCallback(
    (foodId: string, newPortions: number) => {
      setPlate((prevPlate) => {
        if (newPortions <= 0) return prevPlate.filter((item) => item.foodItem.id !== foodId);

        const existingIndex = prevPlate.findIndex((item) => item.foodItem.id === foodId);
        if (existingIndex !== -1) {
          const newPlate = [...prevPlate];
          newPlate[existingIndex] = { ...newPlate[existingIndex], portions: newPortions };
          return newPlate;
        }

        const foodToAdd = allFoodData.find((food) => food.id === foodId);
        if (foodToAdd) return [...prevPlate, { foodItem: foodToAdd, portions: newPortions }];
        return prevPlate;
      });
      setPortionEditorItem(null);
    },
    [allFoodData]
  );

  const handleEditItemPortion = useCallback(
    (food: FoodItem) => {
      const itemInPlate = plate.find((item) => item.foodItem.id === food.id);
      setPortionEditorItem(itemInPlate || { foodItem: food, portions: 0 });
    },
    [plate]
  );

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

  const handleScanSuccess = useCallback(
    async (barcode: string) => {
      setIsScannerOpen(false);
      setProcessingBarcodeState('fetching');
      const productData = await dispatch(thunks.fetchProductByBarcodeThunk(barcode));
      setProcessingBarcodeState(null);

      if (productData) {
        setDebugData(productData);
      }
    },
    [dispatch]
  );

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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-bg-base">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-accent/10 via-brand-protein/5 to-transparent" />
      <div className="pointer-events-none absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-brand-carbs/8 blur-3xl" />

      <AddFoodProcessingOverlay
        barcodeState={processingBarcodeState}
        imageProcessing={isProcessingImage}
        imagePreviewUrl={processingImageUrl}
      />

      {isEditorOpen && <FoodItemEditor category={editorCategory} existingFood={foodToEdit || undefined} onClose={handleCloseEditor} />}
      {foodToDelete && (
        <ConfirmationDialog
          title="Eliminar ingrediente"
          message={`Seguro que quieres eliminar "${foodToDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setFoodToDelete(null)}
        />
      )}
      {isScannerOpen && <BarcodeScannerView onScanSuccess={handleScanSuccess} onClose={handleCloseScanner} />}
      {portionEditorItem && (
        <PortionEditorModal
          food={portionEditorItem}
          onSave={(portions) => handleUpdateItemPortion(portionEditorItem.foodItem.id, portions)}
          onClose={() => setPortionEditorItem(null)}
        />
      )}
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
        onOpenManual={() => {
          vibrate(5);
          handleOpenEditor();
        }}
        onOpenImageSource={() => {
          vibrate(5);
          setShowImageSourceModal(true);
        }}
        onOpenScanner={() => {
          vibrate(5);
          setIsScannerOpen(true);
        }}
        activeFilterCategory={activeFilterCategory}
        onSelectMainCategory={(category) => {
          setActiveFilterCategory(category);
          setActiveSubFilter('TODOS');
        }}
        activeSubFilter={activeSubFilter}
        onSelectSubFilter={setActiveSubFilter}
        plateCount={plate.length}
        totalKcal={macros.kcal}
        resultsCount={resultsCount}
      />

      <div className="relative z-10 flex-grow w-full overflow-y-auto pb-40 hide-scrollbar">
        <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pb-[30px] pt-5 sm:px-6">
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
          onTimingChange={(value) => setTiming((prev) => (prev === value ? undefined : value))}
        />
      )}
    </div>
  );
};

export default AddFoodView;
