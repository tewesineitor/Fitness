
import React from 'react';
import { MacroNutrients } from '../types';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { CheckCircleIcon } from './icons';

// --- COMPACT CHECKPOINT BAR (For Widget) ---
const CompactArchitectBar: React.FC<{ 
    label: string; 
    current: number; 
    min: number;
    ideal: number;
    max: number;
    bgClass: string;
}> = ({ label, current, min, ideal, max, bgClass }) => {
    // Scaling: Max is 100%
    const progress = Math.min((current / max) * 100, 100);
    
    const minPos = (min / max) * 100;
    const idealPos = (ideal / max) * 100;

    const isOver = current > max;
    const isUnder = current < min;

    let barColor = "";
    if (isOver) barColor = "bg-danger"; 
    else if (isUnder) barColor = "bg-surface-border";
    else barColor = bgClass; // Solid color when in range

    return (
        <div className="flex flex-col w-full mb-3 last:mb-0 relative group">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest pl-1">{label}</span>
                <span className={`text-[9px] font-bold font-mono ${isOver ? 'text-danger' : 'text-text-primary'}`}>
                    {current.toFixed(0)} <span className="text-text-secondary opacity-60">/ {ideal}g</span>
                </span>
            </div>
            
            <div className="h-1.5 w-full bg-surface-hover rounded-full relative overflow-visible">
                {/* Marcadores */}
                <div className="absolute top-0 bottom-0 w-px bg-surface-border z-10" style={{ left: `${minPos}%` }}></div>
                <div className="absolute top-0 bottom-0 w-px bg-text-secondary/30 z-10" style={{ left: `${idealPos}%` }}></div>
                
                {/* Max Marker (Right Edge) */}
                <div className="absolute top-0 bottom-0 w-px bg-surface-border z-10 right-0"></div>

                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out relative z-0 ${barColor}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

// --- COMPACT PROTEIN BAR ---
const CompactProteinBar: React.FC<{ 
    current: number; 
    goal: number; 
}> = ({ current, goal }) => {
    // Goal is 100%
    const progress = Math.min((current / goal) * 100, 100);
    const isMet = current >= goal;
    
    return (
        <div className="flex flex-col w-full mb-3 last:mb-0 relative">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest pl-1 flex items-center gap-1">
                    Proteína {isMet && <CheckCircleIcon className="w-3 h-3 text-brand-protein" />}
                </span>
                <span className={`text-[9px] font-bold font-mono ${isMet ? 'text-brand-protein' : 'text-text-primary'}`}>
                    {current.toFixed(0)} <span className="text-text-secondary opacity-60">/ {goal}g</span>
                </span>
            </div>
            
            <div className="h-1.5 w-full bg-surface-hover rounded-full relative overflow-visible">
                {/* Goal Marker is effectively right edge */}
                <div className="absolute top-0 bottom-0 w-px bg-brand-protein z-10 right-0"></div>

                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out relative ${isMet ? 'bg-brand-protein' : 'bg-brand-protein/50'}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export const ProgressRings: React.FC<{ consumed: MacroNutrients; goals: MacroNutrients; }> = ({ consumed, goals }) => {
    const displayKcal = useAnimatedValue(consumed.kcal, 750);
    const kcalLimit = goals.kcal || 2000;
    const isOver = consumed.kcal > kcalLimit;
    const percentage = Math.min(consumed.kcal / kcalLimit, 1);

    const size = 110;
    const center = size / 2;
    const strokeWidth = 6;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - percentage * circumference;
    
    const ringColor = isOver ? "text-destructive" : "text-brand-accent"; 

    // Reglas dinamicas basadas en goals
    const fatRules = { min: (goals as any).fatMin || 55, ideal: goals.fat || 70, max: (goals as any).fatMax || 90 };
    const carbRules = { min: (goals as any).carbMin || 140, ideal: goals.carbs || 195, max: (goals as any).carbMax || 225 };
    const proteinGoal = goals.protein || 150;

    return (
        <div className="flex flex-row items-center gap-6 w-full">
            {/* Kcal Ring */}
            <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90 overflow-visible">
                    {/* Background Circle */}
                    <circle
                        cx={center} cy={center} r={radius}
                        stroke="currentColor" 
                        strokeWidth={strokeWidth} 
                        fill="transparent"
                        className="text-surface-hover"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={center} cy={center} r={radius}
                        stroke="currentColor" 
                        strokeWidth={strokeWidth} 
                        fill="transparent"
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${ringColor}`}
                    />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <span className={`text-2xl font-mono font-bold tracking-tighter ${isOver ? 'text-destructive' : 'text-text-primary'}`}>
                        {displayKcal.toFixed(0)}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">/ {kcalLimit}</span>
                </div>
            </div>

            {/* System Metrics */}
            <div className="flex-grow min-w-0 flex flex-col justify-center h-full py-1">
                <CompactProteinBar 
                    current={consumed.protein} 
                    goal={proteinGoal} 
                />
                <CompactArchitectBar 
                    label="Carbohidratos" 
                    current={consumed.carbs} 
                    min={carbRules.min}
                    ideal={carbRules.ideal}
                    max={carbRules.max}
                    bgClass="bg-brand-carbs"
                />
                <CompactArchitectBar 
                    label="Grasas" 
                    current={consumed.fat} 
                    min={fatRules.min}
                    ideal={fatRules.ideal}
                    max={fatRules.max}
                    bgClass="bg-brand-fat"
                />
            </div>
        </div>
    );
}

export default ProgressRings;
