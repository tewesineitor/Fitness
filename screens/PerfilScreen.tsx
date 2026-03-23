import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts';
import { DailyGoals, Theme } from '../types';
import { ChevronRightIcon, UserCircleIcon, SparklesIcon, CheckIcon } from '../components/icons';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import SectionHeader from '../components/SectionHeader';
import * as actions from '../actions';

import { MacroSettings } from '../components/perfil/MacroSettings';
import { AccountSection } from '../components/perfil/AccountSection';
import { getSupabase } from '../services/supabaseClient';

// --- MAIN SCREEN ---
const PerfilScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { state, dispatch, showToast } = useContext(AppContext)!;

    const [name, setName] = useState('');
    const [customMantra, setCustomMantra] = useState('');
    const [goals, setGoals] = useState<DailyGoals>({
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    useEffect(() => {
        if (state.profile) {
            setName(state.profile.userName);
            setGoals(state.profile.dailyGoals);
            setCustomMantra(state.profile.customMantra || '');
        }
    }, [state.profile]);

    const handleSave = () => {
        if (!name.trim()) {
            showToast('El nombre de usuario es obligatorio');
            return;
        }
        dispatch(actions.updateProfile({ name, goals, customMantra }));
        showToast('Perfil actualizado correctamente');
        onClose();
    };

    const handleViewOnboarding = () => {
        onClose();
        dispatch(actions.updateProfile({ name: '', goals, customMantra }));
    };

    const handleSignOut = async () => {
        const supabase = getSupabase();
        if (supabase) {
            await supabase.auth.signOut();
        }
    };

    const updateTheme = (newTheme: Theme) => dispatch(actions.updateTheme(newTheme));

    return (
        <div className="h-full animate-scale-in flex flex-col bg-bg-base overflow-hidden">
            <header className="flex-shrink-0 px-4 sm:px-6 pt-6 pb-2 border-b border-surface-border/10 bg-surface-bg/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex justify-between items-center mb-2">
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={onClose}
                        icon={ChevronRightIcon}
                        className="[&_svg]:rotate-180"
                    >
                        Volver
                    </Button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight">
                    Mi <span className="text-brand-accent">Perfil</span>
                </h1>
            </header>

            <div className="flex-grow overflow-y-auto w-full px-4 sm:px-6 py-5 pb-32 space-y-5 hide-scrollbar">
                <section>
                    <SectionHeader title="Identidad" />
                    <Card variant="default" className="p-4 space-y-4">
                        <Input
                            label="Nombre de Usuario"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            icon={UserCircleIcon}
                        />

                        <div>
                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1.5 pl-1 opacity-70">
                                <SparklesIcon className="w-3 h-3 text-brand-accent" />
                                Mantra Personal
                            </label>
                            <textarea
                                value={customMantra}
                                onChange={(e) => setCustomMantra(e.target.value)}
                                placeholder="Escribe una frase que te inspire..."
                                rows={2}
                                className="w-full bg-surface-hover/40 border border-surface-border rounded-input p-4 text-sm text-text-primary font-medium focus:border-brand-accent outline-none transition-all placeholder:text-text-muted/60 resize-none font-mono leading-relaxed"
                            />
                        </div>
                    </Card>
                </section>

                <MacroSettings goals={goals} setGoals={setGoals} showToast={showToast} />

                <AccountSection
                    onViewOnboarding={handleViewOnboarding}
                    onSignOut={handleSignOut}
                />
            </div>

            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-surface-border/10 bg-surface-bg/80 backdrop-blur-md sticky bottom-0 z-20">
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="large"
                    className="w-full py-4 text-xs font-bold tracking-widest uppercase shadow-lg shadow-brand-accent/20"
                    icon={CheckIcon}
                >
                    GUARDAR CAMBIOS
                </Button>
            </div>
        </div>
    );
};

export default PerfilScreen;
