
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts';
import { NutritionMainView } from './nutricion/NutritionMainView';
import { AddFoodView } from './nutricion/AddFoodView';
import { selectCustomFoodItems } from '../selectors/nutritionSelectors';
import { selectMealBuilderInitialState } from '../selectors/uiSelectors';
import * as actions from '../actions';
import { AddedFood } from '../types';

const NutricionScreen: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)!;
    const [currentView, setCurrentView] = useState<'main' | 'add'>('main');
    const [initialFoods, setInitialFoods] = useState<AddedFood[]>([]);
    const [initialName, setInitialName] = useState<string>('');
    
    const customFoodItems = selectCustomFoodItems(state);
    const mealBuilderState = selectMealBuilderInitialState(state);
    
    // Effect to check for incoming meal builder data from Library
    useEffect(() => {
        if (mealBuilderState) {
            setInitialFoods(mealBuilderState.foods);
            setInitialName(mealBuilderState.mealName || '');
            setCurrentView('add');
            // Clear the state so it doesn't persist if we navigate away and back manually
            dispatch(actions.setMealBuilderState(null));
        }
    }, [mealBuilderState, dispatch]);

    const allFoods = state.nutrition.allFoods;
    const allFoodData = useMemo(() => [...allFoods, ...customFoodItems], [allFoods, customFoodItems]);
    
    useEffect(() => {
        dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: currentView === 'main' });
        // Cleanup on unmount
        return () => {
            dispatch({ type: 'SET_BOTTOM_NAV_VISIBLE', payload: true });
        };
    }, [currentView, dispatch]);

    if (currentView === 'add') {
        return (
            <AddFoodView 
                onBack={() => {
                    setCurrentView('main');
                    setInitialFoods([]); // Clear on exit
                    setInitialName('');
                }} 
                allFoodData={allFoodData}
                initialFoods={initialFoods}
                initialMealName={initialName}
            />
        );
    }

    return (
        <NutritionMainView onGoToAddFood={() => setCurrentView('add')} />
    );
};

export default NutricionScreen;
