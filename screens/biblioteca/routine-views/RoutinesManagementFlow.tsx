import React, { useState } from 'react';
import { RoutineTask } from '../../../types';
import Button from '../../../components/Button';
import { ChevronRightIcon, PlusIcon } from '../../../components/icons';
import WeeklyPlannerView from './WeeklyPlannerView';
import RoutineEditor from './RoutineEditor';
import RoutinesListView from './RoutinesListView';

const RoutinesManagementFlow: React.FC<{
    onBack: () => void;
    mode: 'routines' | 'planner';
    initialRoutine?: RoutineTask | 'new';
}> = ({ onBack, mode, initialRoutine }) => {
    const getInitialState = () => {
        if (initialRoutine === 'new') return null;
        if (initialRoutine) return initialRoutine;
        return undefined;
    };

    const [editingRoutine, setEditingRoutine] = useState<RoutineTask | null | undefined>(getInitialState());

    const handleBackFromEditor = () => {
        if (initialRoutine !== undefined) {
            onBack();
        } else {
            setEditingRoutine(undefined);
        }
    };

    if (editingRoutine !== undefined) {
        return <RoutineEditor onBack={handleBackFromEditor} existingRoutine={editingRoutine || undefined} />;
    }

    if (mode === 'planner') {
        return <WeeklyPlannerView onBack={onBack} />;
    }

    return (
        <div className="animate-fade-in-up">
            <header className="p-4 sm:p-6 pb-2 pt-6">
                <Button variant="tertiary" onClick={onBack} icon={ChevronRightIcon} className="mb-4 !p-0 [&_svg]:rotate-180 text-text-secondary hover:text-text-primary self-start">
                    Volver
                </Button>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight uppercase">
                            Mis Rutinas
                        </h1>
                    </div>
                    <Button onClick={() => setEditingRoutine(null)} variant="high-contrast" icon={PlusIcon} size="small" className="!py-2.5 !px-5 text-xs shadow-lg shadow-brand-accent/20">
                        Crear
                    </Button>
                </div>
            </header>

            <RoutinesListView onSelectRoutine={setEditingRoutine} />
        </div>
    );
};

export default RoutinesManagementFlow;
