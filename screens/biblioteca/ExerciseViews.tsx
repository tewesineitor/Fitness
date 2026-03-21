
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { exercises as allExercisesData } from '../../data';
import { Exercise, DesgloseFuerza, ExerciseLibraryCategory } from '../../types';
import { ChevronRightIcon, StrengthIcon, StarIcon, CalendarIcon, BookOpenIcon, ChartBarIcon, SparklesIcon, ArrowUpIcon, TshirtIcon, PostureIcon, UserCircleIcon, FireIcon, YogaIcon, SearchIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import Button from '../../components/Button';
import ChipButton from '../../components/ChipButton';
import Tag from '../../components/Tag';

// --- SHARED & UTILITY COMPONENTS ---

const SimpleMarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
  
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={index} className="font-bold text-brand-accent uppercase text-xs tracking-wider block mt-4 mb-1">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
};

const ExerciseCardImage: React.FC<{ exercise: Exercise; className?: string; }> = ({ exercise, className }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [exercise.gifUrl]);

    if (!exercise.gifUrl || hasError) {
        return (
            <div className={`${className} bg-black/20 flex items-center justify-center`}>
                <StrengthIcon className="w-1/2 h-1/2 text-white/10" />
            </div>
        );
    }

    return (
        <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className={`${className} object-cover grayscale opacity-80`}
            onError={() => setHasError(true)}
            key={exercise.gifUrl}
        />
    );
};

const getMusclesWorked = (description: string): string | null => {
    const match = description.match(/\*\*Músculos trabajados:\*\*\s*(.*?)(?=\n\n|$)/);
    return match ? match[1].trim().replace(/\.$/, '') : null;
};

const useParsedDescription = (description: string) => {
    return useMemo(() => {
        let recommendationKey: string | null = null;
        let processedDescription = description || '';

        const recommendationMatch = processedDescription.match(/\[RECOMMENDATIONS:(.*?)\]/);
        if (recommendationMatch) {
            recommendationKey = recommendationMatch[1];
            processedDescription = processedDescription.replace(recommendationMatch[0], '').trim();
        }

        const sections: Record<string, string> = {};
        const regex = /\*\*(.*?):\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/g;
        let match;
        let hasMatches = false;
        while ((match = regex.exec(processedDescription)) !== null) {
            hasMatches = true;
            sections[match[1].toLowerCase().trim()] = match[2].trim();
        }

        if (!hasMatches && processedDescription.trim().length > 0) {
            sections['descripción'] = processedDescription.trim();
        }

        return { sections, recommendationKey };
    }, [description]);
};


// --- RECOMMENDATION ENGINE ---
const recommendationMap: Record<string, string[]> = {
    'test-dorsiflexion-tobillo': ['alfabeto-tobillo', 'circulos-tobillo', 'estiramiento-gemelos', 'estiramiento-soleo', 'elevaciones-talon', 'banda-tobillo-4-direcciones'],
    'test-flexion-tronco': ['postura-gato-vaca', 'rodillas-al-pecho', 'torsion-tronco-supina', 'estiramiento-isquios-supino'],
    'test-flexion-hombro-pared': ['rotacion-toracica-cuadrupedia', 'estiramiento-pectorales-puerta', 'angeles-pared', 'retracciones-escapulares'],
    'test-cierre-espalda': ['estiramiento-pectorales-puerta', 'retracciones-escapulares', 'rotacion-toracica-cuadrupedia']
};

const RecommendationSection: React.FC<{
    recommendationKey: string;
    onSelectExercise: (ex: Exercise) => void;
}> = ({ recommendationKey, onSelectExercise }) => {
    const { state } = useContext(AppContext)!;
    const allExercises = state.workout.allExercises;
    const recommendedIds = recommendationMap[recommendationKey] || [];
    const recommendedExercises = recommendedIds.map(id => allExercises[id]).filter(Boolean);

    if (recommendedExercises.length === 0) return null;

    return (
        <div className="border border-surface-border bg-surface-bg p-4 mt-6 animate-fade-in-up">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4"/>
                Protocolo Correctivo
            </h3>
            <div className="space-y-1">
                {recommendedExercises.map(ex => (
                    <button key={ex.id} onClick={() => onSelectExercise(ex)} className="w-full text-left p-2 border-b border-surface-border/30 flex items-center gap-3 hover:bg-surface-hover transition-colors group">
                        <ChevronRightIcon className="w-3 h-3 text-brand-accent group-hover:translate-x-1 transition-transform" />
                        <p className="font-bold text-xs uppercase text-text-primary">{ex.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- DETAIL VIEW ---

const MuscleTags: React.FC<{ description: string }> = ({ description }) => {
    const muscles = getMusclesWorked(description);
    if (!muscles) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {muscles.split(',').map(muscle => (
                <Tag key={muscle.trim()} variant="status" size="sm">
                    {muscle.trim()}
                </Tag>
            ))}
        </div>
    );
};

const CollapsibleSection: React.FC<{
    title: string;
    icon: React.FC<{ className?: string }>;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ title, icon: Icon, isOpen, onClick, children }) => {
    return (
        <div className="border-b border-surface-border">
            <button onClick={onClick} className="w-full flex justify-between items-center py-4 text-left group hover:bg-surface-hover/50 active:scale-[0.99] px-2 transition-all">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-3">
                    <Icon className="w-4 h-4 text-text-secondary group-hover:text-brand-accent transition-colors" />
                    {title}
                </h3>
                <ChevronRightIcon className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-accent' : 'rotate-0'}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden bg-surface-bg">
                    <div className="p-4 text-text-secondary text-sm leading-relaxed whitespace-pre-wrap font-mono">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExerciseDetailView: React.FC<{ exercise: Exercise, onBack: () => void, onSelectExercise: (ex: Exercise) => void }> = ({ exercise, onBack, onSelectExercise }) => {
    const { state } = useContext(AppContext)!;
    const { sections: parsedDescription, recommendationKey } = useParsedDescription(exercise.description);
    const [openSection, setOpenSection] = useState<string | null>(null);
    
    useEffect(() => {
        const firstSectionKey = Object.keys(parsedDescription)[0] || null;
        setOpenSection(firstSectionKey);
    }, [parsedDescription]);

    const progressionData = useMemo(() => {
        if(exercise.category !== 'fuerza') return null;
        const pr = state.progress.progressTracker.personalRecords[exercise.id];
        const relevantSessions = state.workout.historialDeSesiones
            .filter(s => s.desglose_ejercicios.some(e => 'exerciseId' in e && e.exerciseId === exercise.id))
            .sort((a, b) => new Date(b.fecha_completado).getTime() - new Date(a.fecha_completado).getTime());

        const lastPerformances = relevantSessions.slice(0, 5).map(session => {
            const exerciseLog = session.desglose_ejercicios.find(e => 'exerciseId' in e && e.exerciseId === exercise.id) as DesgloseFuerza | undefined;
            if (!exerciseLog || !exerciseLog.sets || exerciseLog.sets.length === 0) return null;
            const bestSet = [...exerciseLog.sets].sort((a, b) => (b.weight * (1 + b.reps / 30)) - (a.weight * (1 + a.reps / 30)))[0];
            return { date: new Date(session.fecha_completado), bestSet: `${bestSet.weight}kg x ${bestSet.reps} reps` };
        }).filter((p): p is { date: Date; bestSet: string } => p !== null);

        const lastSession = lastPerformances.length > 0 ? lastPerformances[0] : null;

        return { pr, lastPerformances, lastSession };
    }, [state.workout.historialDeSesiones, state.progress.progressTracker.personalRecords, exercise.id, exercise.category]);
    
    return (
        <div className="animate-fade-in-up">
            <header className="fixed top-0 left-0 right-0 z-20 p-4 max-w-3xl mx-auto">
                <Button variant="secondary" onClick={onBack} icon={ChevronRightIcon} size="small" className="bg-surface-bg/80 backdrop-blur-sm [&_svg]:rotate-180">
                    Volver
                </Button>
            </header>

            <div className="relative w-full aspect-video bg-surface-bg border-b border-surface-border">
                <ExerciseCardImage exercise={exercise} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(var(--color-surface-bg-rgb),1)_100%)]"></div>
                <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-2xl sm:text-4xl font-black text-text-primary uppercase tracking-tight leading-none mb-2">
                        {exercise.name}
                    </h1>
                    <MuscleTags description={exercise.description} />
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-8 pb-6">
                {progressionData && (
                    <div className="grid grid-cols-2 border border-surface-border bg-surface-bg rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
                        <div className="p-4 text-center border-r border-surface-border hover:bg-surface-hover/50 transition-colors cursor-default">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                <SparklesIcon className="w-3 h-3 text-brand-accent"/> Récord (e1RM)
                            </p>
                            <p className="font-black text-2xl text-text-primary">{progressionData.pr ? `${progressionData.pr.weight.toFixed(1)}` : '-'}<span className="text-xs text-brand-accent ml-1">KG</span></p>
                        </div>
                        <div className="p-4 text-center hover:bg-surface-hover/50 transition-colors cursor-default">
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                                <ChartBarIcon className="w-3 h-3 text-text-secondary"/> Último Reg.
                            </p>
                            <p className="font-bold text-sm text-text-primary">{progressionData.lastSession ? progressionData.lastSession.bestSet : '-'}</p>
                            <p className="text-[10px] font-mono text-text-secondary mt-1">{progressionData.lastSession ? progressionData.lastSession.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'N/A'}</p>
                        </div>
                    </div>
                )}
                
                <div className="border-t border-surface-border">
                    {Object.keys(parsedDescription).length > 0 && (
                        <div>
                            {Object.entries(parsedDescription).map(([key, content]) => {
                                let title = key.charAt(0).toUpperCase() + key.slice(1);
                                let Icon = BookOpenIcon;
                                if (key === 'técnica' || key === 'objetivo') { title = "Técnica"; Icon = BookOpenIcon; }
                                else if (key === 'puntos clave') { title = "Puntos Críticos"; Icon = SparklesIcon; }
                                else if (key === 'progresiones') { title = "Progresiones"; Icon = ArrowUpIcon; }
                                else if (key.startsWith('músculos')) { return null; }
                                else if (key.startsWith('resultados')) { title = "Análisis"; Icon = SparklesIcon; }
                                else if (key === 'descripción') { title = "Descripción General"; Icon = BookOpenIcon; }

                                return (
                                    <CollapsibleSection
                                        key={key}
                                        title={title}
                                        icon={Icon}
                                        isOpen={openSection === key}
                                        onClick={() => setOpenSection(openSection === key ? null : key)}
                                    >
                                        <SimpleMarkdownRenderer text={content} />
                                    </CollapsibleSection>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {recommendationKey && <RecommendationSection recommendationKey={recommendationKey} onSelectExercise={onSelectExercise} />}
            </div>
        </div>
    );
};

// --- LIST ITEM CARD ---

const SimpleExerciseCard: React.FC<{ exercise: Exercise; onSelect: () => void }> = ({ exercise, onSelect }) => {
    return (
        <button
            onClick={onSelect}
            className="w-full text-left p-3 bg-surface-bg rounded-xl flex items-center gap-4 hover:bg-surface-hover/80 transition-all duration-300 group border border-surface-border hover:border-brand-accent/30 mb-2 relative overflow-hidden shadow-sm active:scale-[0.98]"
        >
            <div className="flex-shrink-0 w-12 h-12 bg-surface-hover border border-surface-border rounded-lg overflow-hidden shadow-inner group-hover:border-brand-accent/20 transition-colors">
                <ExerciseCardImage exercise={exercise} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex-grow min-w-0 z-10">
                <h4 className="font-bold text-xs text-text-primary uppercase tracking-tight group-hover:text-brand-accent transition-colors truncate leading-tight">
                    {exercise.name}
                </h4>
                <div className="flex flex-wrap gap-1 mt-1">
                     <Tag variant="status" size="sm" className="!h-6 !px-2">
                        {getMusclesWorked(exercise.description)?.split(',')[0] || 'GENERAL'}
                     </Tag>
                </div>
            </div>
            <div className="p-1.5 rounded-full bg-surface-bg text-text-secondary group-hover:text-bg-base group-hover:bg-brand-accent transition-all duration-300 transform group-hover:translate-x-1">
                <ChevronRightIcon className="w-3 h-3" />
            </div>
            
            {/* Hover Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors pointer-events-none opacity-0 group-hover:opacity-100"></div>
        </button>
    );
};

// --- VIEWS & FLOW ---

const FilterButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <ChipButton onClick={onClick} active={isActive} tone="accent" size="small">
        {label}
    </ChipButton>
);

const StrengthLibraryView: React.FC<{ onSelectExercise: (ex: Exercise) => void, onBack: () => void }> = ({ onSelectExercise, onBack }) => {
    const { state } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeMuscleGroup, setActiveMuscleGroup] = useState<string | 'Todos'>('Todos');
    const [equipmentFilter, setEquipmentFilter] = useState<'Todos' | 'Corporal' | 'Equipo'>('Todos');
    
    const userExercises = state.workout.userExercises || [];
    
    const muscleGroups = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
    const muscleGroupKeywords: { [key: string]: string[] } = { 'Pecho': ['Pectoral'], 'Espalda': ['Dorsal', 'Romboides', 'Trapecio'], 'Piernas': ['Cuádriceps', 'Glúteos', 'Isquiotibiales'], 'Hombros': ['Deltoides'], 'Brazos': ['Bíceps', 'Tríceps'], 'Core': ['Core', 'Serrato', 'abdominal'] };

    const strengthExercises = useMemo(() => {
        const defaultEx = Object.values(allExercisesData).filter(ex => ex.category === 'fuerza');
        const userEx = userExercises.filter(ex => ex.category === 'fuerza');
        return [...defaultEx, ...userEx].sort((a, b) => a.name.localeCompare(b.name));
    }, [userExercises]);
    
    const filteredExercises = useMemo(() => strengthExercises.filter(ex => {
        if (!ex.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
        if (equipmentFilter === 'Corporal' && !ex.isBodyweight) return false;
        if (equipmentFilter === 'Equipo' && ex.isBodyweight) return false;

        if (activeMuscleGroup === 'Todos') return true;
        const muscles = getMusclesWorked(ex.description);
        return muscles && (muscleGroupKeywords[activeMuscleGroup] ?? []).some(keyword => muscles.toLowerCase().includes(keyword.toLowerCase()));
    }), [searchTerm, activeMuscleGroup, equipmentFilter, strengthExercises]);

    return (
        <div className="p-4 sm:p-6">
            <div>
                <Button variant="ghost" onClick={onBack} icon={ChevronRightIcon} className="mb-4 !px-0 hover:!bg-transparent [&_svg]:rotate-180">
                    Volver
                </Button>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-6">Ejercicios: Fuerza</h1>
                
                <div className="relative mb-4 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    <input 
                        type="search" 
                        placeholder="BUSCAR EJERCICIO..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full pl-11 p-4 bg-surface-hover/50 border border-surface-border focus:border-brand-accent/50 focus:bg-surface-hover outline-none text-xs font-bold uppercase tracking-widest text-text-primary rounded-2xl transition-all shadow-inner placeholder:text-text-secondary/50" 
                    />
                </div>
                
                <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
                    {(['Todos', 'Corporal', 'Equipo'] as const).map(filter => (
                        <FilterButton key={filter} label={filter} isActive={equipmentFilter === filter} onClick={() => setEquipmentFilter(filter)} />
                    ))}
                </div>

                <div className="flex gap-4 overflow-x-auto hide-scrollbar border-b border-surface-border pb-4 mb-2">
                    {muscleGroups.map(group => (
                        <ChipButton
                            key={group}
                            onClick={() => setActiveMuscleGroup(group)}
                            active={activeMuscleGroup === group}
                            tone="accent"
                            size="small"
                            className="flex-shrink-0"
                        >
                            {group}
                        </ChipButton>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                {filteredExercises.map((ex, i) => <SimpleExerciseCard key={ex.id} exercise={ex} onSelect={() => onSelectExercise(ex)} />)} 
                {filteredExercises.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50">
                        <div className="w-16 h-16 bg-surface-hover/60 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">No encontrado</p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">Intenta con otro término</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ExerciseListByCategoryView: React.FC<{ category: Exclude<ExerciseLibraryCategory, 'fuerza'>, onSelectExercise: (ex: Exercise) => void, onBack: () => void }> = ({ category, onSelectExercise, onBack }) => {
    const { state } = useContext(AppContext)!;
    const [searchTerm, setSearchTerm] = useState('');
    const categoryNameMap = { yoga: 'Yoga', postura: 'Corrección Postural', calentamiento: 'Calentamiento Dinámico', estiramiento: 'Estiramientos', movilidad: 'Movilidad' };
    const userExercises = state.workout.userExercises || [];

    const exercisesForCategory = useMemo(() => {
        const defaultEx = Object.values(allExercisesData).filter(ex => ex.category === category);
        const userEx = userExercises.filter(ex => ex.category === category);
        return [...defaultEx, ...userEx]
            .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [category, userExercises, searchTerm]);

    const { testExercises, correctionExercises } = useMemo(() => {
        if (category === 'postura') {
            const tests = exercisesForCategory.filter(ex => ex.name.toLowerCase().includes('test'));
            const corrections = exercisesForCategory.filter(ex => !ex.name.toLowerCase().includes('test'));
            return { testExercises: tests, correctionExercises: corrections };
        }
        return { testExercises: [], correctionExercises: exercisesForCategory };
    }, [exercisesForCategory, category]);

    return (
        <div className="p-4 sm:p-6 pb-6">
            <div>
                <Button variant="ghost" onClick={onBack} icon={ChevronRightIcon} className="mb-4 !px-0 hover:!bg-transparent [&_svg]:rotate-180">
                    Volver
                </Button>
                <h1 className="text-3xl font-black uppercase tracking-tight mb-6">Ejercicios: {categoryNameMap[category]}</h1>
                
                <div className="relative mb-6 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-text-secondary group-focus-within:text-brand-accent" />
                    </div>
                    <input type="search" placeholder="BUSCAR..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 p-3 bg-surface-hover border border-surface-border focus:border-brand-accent outline-none text-xs font-mono uppercase text-text-primary rounded-xl transition-colors" />
                </div>
            </div>
            
            <div className="space-y-8 mt-6">
                {testExercises.length > 0 && (
                    <div className="bg-surface-bg rounded-2xl overflow-hidden border border-surface-border shadow-sm">
                        <h2 className="text-xs font-bold text-brand-accent bg-surface-hover p-3 border-b border-surface-border uppercase tracking-widest">Protocolos de Evaluación</h2>
                        <div className="p-2">
                            {testExercises.map((ex) => (
                                <SimpleExerciseCard key={ex.id} exercise={ex} onSelect={() => onSelectExercise(ex)} />
                            ))}
                        </div>
                    </div>
                )}

                {correctionExercises.length > 0 && (
                     <div className="bg-surface-bg rounded-2xl overflow-hidden border border-surface-border shadow-sm">
                        <h2 className="text-xs font-bold text-text-secondary bg-surface-hover p-3 border-b border-surface-border uppercase tracking-widest">
                            {testExercises.length > 0 ? 'Protocolos Correctivos' : 'Ejercicios'}
                        </h2>
                        <div className="p-2">
                            {correctionExercises.map((ex) => (
                                <SimpleExerciseCard key={ex.id} exercise={ex} onSelect={() => onSelectExercise(ex)} />
                            ))}
                        </div>
                    </div>
                )}
                
                {testExercises.length === 0 && correctionExercises.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 opacity-50">
                        <div className="w-16 h-16 bg-surface-hover/60 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-text-secondary" />
                        </div>
                        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">No encontrado</p>
                        <p className="text-[10px] text-text-secondary/60 mt-1">Intenta con otro término</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN FLOW COMPONENT ---

type Category = ExerciseLibraryCategory;
interface ExerciseFlowProps { onBack: () => void; category?: Category | null; initialExercise?: Exercise; }

const ExerciseFlow: React.FC<ExerciseFlowProps> = ({ onBack, category, initialExercise }) => {
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(initialExercise || null);
    const [isDirectLink] = useState(!!initialExercise);

    const handleDetailBack = () => {
        if (isDirectLink) {
            onBack();
        } else {
            setSelectedExercise(null);
        }
    };

    if (selectedExercise) {
        return <ExerciseDetailView exercise={selectedExercise} onBack={handleDetailBack} onSelectExercise={setSelectedExercise} />;
    }
    
    if (category === 'fuerza') {
        return <StrengthLibraryView onSelectExercise={ex => setSelectedExercise(ex)} onBack={onBack} />;
    }

    if (category) {
        return <ExerciseListByCategoryView category={category} onSelectExercise={ex => setSelectedExercise(ex)} onBack={onBack} />;
    }

    return null;
};

export default ExerciseFlow;
