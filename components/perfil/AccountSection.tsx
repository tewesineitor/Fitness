import React from 'react';
import Button from '../Button';
import SectionHeader from '../legacy/SectionHeader';

export const AccountSection: React.FC<{
    onViewOnboarding: () => void;
    onSignOut: () => Promise<void> | void;
}> = ({ onViewOnboarding, onSignOut }) => {
    return (
        <section className="mb-12 mt-8">
            <SectionHeader title="Ajustes de Cuenta" dotClass="bg-text-secondary" />
            <div className="bg-surface-bg p-4 rounded-2xl border border-surface-border shadow-sm space-y-3">
                <Button
                    onClick={onViewOnboarding}
                    variant="secondary"
                    className="w-full text-text-primary"
                >
                    Ver onboarding
                </Button>
                <Button
                    onClick={onSignOut}
                    variant="destructive"
                    className="w-full"
                >
                    Cerrar sesion
                </Button>
            </div>
        </section>
    );
};
