import React from 'react';
import { StatLabel } from './Typography';
import type { UseFlexibleMacrosReturn } from './useFlexibleMacros';
import type { FlexibleMacroTarget, FlexibleMacroConsumed } from './useFlexibleMacros';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NutritionMacroBarProps {
    /**
     * Progress ratios (0..1) + over-max flags from useFlexibleMacros.
     */
    proteinProgress: UseFlexibleMacrosReturn['proteinProgress'];
    carbProgress:    UseFlexibleMacrosReturn['carbProgress'];
    fatProgress:     UseFlexibleMacrosReturn['fatProgress'];
    isCarbOverMax:   UseFlexibleMacrosReturn['isCarbOverMax'];
    isFatOverMax:    UseFlexibleMacrosReturn['isFatOverMax'];

    /**
     * Raw consumed values in grams/numbers — for the HUD value label.
     */
    consumed: FlexibleMacroConsumed;
    /**
     * Targets — used to display "120g / 150g" right-side label.
     */
    target: FlexibleMacroTarget;

    className?: string;
}

// ── Canonical Macro Dialect (Design System SSOT) ──────────────────────────────
// Labels:  PROTEÍNA · CARBOS · GRASAS
// Tokens:  brand-protein · brand-carbs · brand-fat
// NO abbreviations PRO/CH/GRA. NO hardcoded emerald/rose/amber.

interface MacroConfig {
    label:      string;
    unit:       string;
    progressKey: keyof Pick<UseFlexibleMacrosReturn, 'proteinProgress' | 'carbProgress' | 'fatProgress'>;
    consumedKey: keyof FlexibleMacroConsumed;
    targetKey:  'protein' | 'carbIdeal' | 'fatIdeal';
    overKey:    keyof Pick<UseFlexibleMacrosReturn, 'isCarbOverMax' | 'isFatOverMax'> | null;
    barColor:   string;
    overColor:  string;
}

const MACRO_CONFIG: MacroConfig[] = [
    {
        label:       'PROTEÍNA',
        unit:        'g',
        progressKey: 'proteinProgress',
        consumedKey: 'protein',
        targetKey:   'protein',
        overKey:     null,
        barColor:    'bg-brand-protein',
        overColor:   'bg-brand-protein',
    },
    {
        label:       'CARBOS',
        unit:        'g',
        progressKey: 'carbProgress',
        consumedKey: 'carbs',
        targetKey:   'carbIdeal',
        overKey:     'isCarbOverMax',
        barColor:    'bg-brand-carbs',
        overColor:   'bg-danger',
    },
    {
        label:       'GRASAS',
        unit:        'g',
        progressKey: 'fatProgress',
        consumedKey: 'fat',
        targetKey:   'fatIdeal',
        overKey:     'isFatOverMax',
        barColor:    'bg-brand-fat',
        overColor:   'bg-danger',
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * NutritionMacroBar — UI_MANIFEST §NutritionMacroBar
 *
 * 3 HUD rows (label + track + value). Each row:
 *   ┌─────────────────────────────────────────────────┐
 *   │ PROTEÍNA                          120g / 150g   │
 *   │ ████████████░░░░░░░░░░░░░░░░░░░░░░             │
 *   └─────────────────────────────────────────────────┘
 *
 * Canonical colors via semantic tokens: brand-protein · brand-carbs · brand-fat.
 * No internal calculations — receives progress ratios from useFlexibleMacros.
 */
const NutritionMacroBar: React.FC<NutritionMacroBarProps> = ({
    proteinProgress,
    carbProgress,
    fatProgress,
    isCarbOverMax,
    isFatOverMax,
    consumed,
    target,
    className,
}) => {
    const progressValues = { proteinProgress, carbProgress, fatProgress };
    const overStates = { isCarbOverMax, isFatOverMax };

    return (
        <div className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
            {MACRO_CONFIG.map(({ label, unit, progressKey, consumedKey, targetKey, overKey, barColor, overColor }) => {
                const pct       = Math.min(progressValues[progressKey] * 100, 100);
                const isOver    = overKey ? overStates[overKey] : false;
                const activeColor = isOver ? overColor : barColor;
                const cVal      = Math.round(consumed[consumedKey] as number);
                const tVal      = Math.round(target[targetKey]  as number);

                return (
                    <div key={label} className="flex flex-col gap-1">
                        {/* HUD header row: label left, values right */}
                        <div className="flex justify-between items-end">
                            <StatLabel>{label}</StatLabel>
                            <span className={[
                                'tabular-nums text-xs leading-none',
                                isOver ? 'text-danger' : 'text-text-muted',
                            ].join(' ')}>
                                {cVal}{unit} / {tVal}{unit}
                            </span>
                        </div>

                        {/* Progress track */}
                        <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${activeColor} transition-all duration-700 ease-out`}
                                style={{ width: `${pct}%` }}
                                role="progressbar"
                                aria-valuenow={Math.round(pct)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={label}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NutritionMacroBar;
