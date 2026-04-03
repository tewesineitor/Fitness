import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts';
import * as actions from '../actions';
import Button from '../components/Button';
import Input from '../components/Input';
import { dailyGoals as defaultGoals } from '../data-misc';
import { SparklesIcon, ChevronRightIcon, CheckIcon } from '../components/icons';

const OnboardingScreen: React.FC = () => {
    const { dispatch, showToast } = useContext(AppContext)!;
    
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    
    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');
    const [goals, setGoals] = useState(defaultGoals);

    const handleNext = () => {
        if (step === 1 && name.trim() === '') {
            showToast('Por favor, ingresa tu nombre.');
            return;
        }
        setStep(step + 1);
    };

    const handleFinish = () => {
        dispatch(actions.updateProfile({ name, goals, customMantra: '', bodyGoalWeightKg: null }));
        
        if (weight || waist || hips) {
            dispatch(actions.addMetricEntry({
                date: new Date().toISOString().split('T')[0],
                weight: weight ? parseFloat(weight) : undefined,
                waist: waist ? parseFloat(waist) : undefined,
                hips: hips ? parseFloat(hips) : undefined
            }));
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-surface-bg flex flex-col items-center justify-center p-6 animate-fade-in-up">
            <div className="w-full max-w-md bg-surface-hover/20 border border-surface-border rounded-sheet p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center border border-brand-accent/30 shadow-glow">
                        <SparklesIcon className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-black text-text-primary tracking-tighter">Bienvenido</h1>
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.2em]">Configuracion Inicial</p>
                    </div>
                </div>

                <div className="relative z-10">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary mb-2">Como te llamas?</h2>
                                <p className="text-sm text-text-secondary mb-4">Para personalizar tu experiencia.</p>
                                <Input 
                                    label="Nombre" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Ej. Fer"
                                    autoFocus
                                />
                            </div>
                            <Button onClick={handleNext} className="w-full" size="large" icon={ChevronRightIcon}>
                                Continuar
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary mb-2">Tus Medidas Iniciales</h2>
                                <p className="text-sm text-text-secondary mb-4">Opcional. Puedes agregarlas mas tarde.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="Peso (kg)" 
                                        type="number" 
                                        value={weight} 
                                        onChange={(e) => setWeight(e.target.value)} 
                                        placeholder="Ej. 75.5"
                                    />
                                    <Input 
                                        label="Cintura (cm)" 
                                        type="number" 
                                        value={waist} 
                                        onChange={(e) => setWaist(e.target.value)} 
                                        placeholder="Ej. 80"
                                    />
                                    <Input 
                                        label="Caderas (cm)" 
                                        type="number" 
                                        value={hips} 
                                        onChange={(e) => setHips(e.target.value)} 
                                        placeholder="Ej. 95"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                                    Atras
                                </Button>
                                <Button onClick={handleNext} className="flex-1" icon={ChevronRightIcon}>
                                    Continuar
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary mb-2">Tus Metas Diarias</h2>
                                <p className="text-sm text-text-secondary mb-4">Puedes ajustarlas en tu perfil en cualquier momento.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="Proteina (g)" 
                                        type="number" 
                                        value={goals.protein.toString()} 
                                        onChange={(e) => setGoals({...goals, protein: parseFloat(e.target.value) || 0})} 
                                    />
                                    <Input 
                                        label="Carbohidratos (g)" 
                                        type="number" 
                                        value={goals.carbs.toString()} 
                                        onChange={(e) => setGoals({...goals, carbs: parseFloat(e.target.value) || 0})} 
                                    />
                                    <Input 
                                        label="Grasas (g)" 
                                        type="number" 
                                        value={goals.fat.toString()} 
                                        onChange={(e) => setGoals({...goals, fat: parseFloat(e.target.value) || 0})} 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                                    Atras
                                </Button>
                                <Button onClick={handleFinish} className="flex-1" icon={CheckIcon}>
                                    Comenzar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-center gap-2 mt-8 relative z-10">
                    {[1, 2, 3].map(i => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                step === i ? 'bg-brand-accent w-6 shadow-glow' : 'bg-surface-border'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
