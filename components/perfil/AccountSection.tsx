import React from 'react';
import { DailyGoals } from '../../types';
import Button from '../Button';
import SectionHeader from '../SectionHeader';
import { getSupabase } from '../../services/supabaseClient';

export const AccountSection: React.FC<{
    onClose: () => void;
    dispatch: any;
    name: string;
    goals: DailyGoals;
    customMantra: string;
}> = ({ onClose, dispatch, name, goals, customMantra }) => {
    return (
        <section className="mb-12 mt-8">
            <SectionHeader title="Ajustes de Cuenta" dotClass="bg-text-secondary" />
            <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm space-y-3">
                <Button 
                    onClick={() => {
                        onClose();
                        dispatch({ type: 'UPDATE_PROFILE', payload: { name: '', goals, customMantra } });
                    }} 
                    variant="secondary" 
                    className="w-full text-text-primary"
                >
                    Ver Onboarding
                </Button>
                <Button 
                    onClick={async () => {
                        const supabase = getSupabase();
                        if (supabase) await supabase.auth.signOut();
                    }} 
                    variant="destructive"
                    className="w-full"
                >
                    Cerrar Sesión
                </Button>
            </div>
        </section>
    );
};
