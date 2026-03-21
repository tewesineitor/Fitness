
import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import ChipButton from '../ChipButton';
import IconButton from '../IconButton';
import { XIcon, MinusIcon, PlusIcon } from '../icons';
import { vibrate } from '../../utils/helpers';

interface PlateCalculatorModalProps {
    targetWeight: number;
    onClose: () => void;
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const PLATE_COLORS: Record<number, string> = {
    25: 'bg-red-600 border-red-800',
    20: 'bg-blue-600 border-blue-800',
    15: 'bg-yellow-500 border-yellow-700',
    10: 'bg-green-600 border-green-800',
    5: 'bg-white border-gray-400',
    2.5: 'bg-black border-gray-600',
    1.25: 'bg-gray-400 border-gray-600',
};

const PLATE_HEIGHTS: Record<number, string> = {
    25: 'h-24',
    20: 'h-24',
    15: 'h-20',
    10: 'h-16',
    5: 'h-12',
    2.5: 'h-10',
    1.25: 'h-8',
};

const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({ targetWeight: initialWeight, onClose }) => {
    const [weight, setWeight] = useState(initialWeight || 20);
    const [barWeight, setBarWeight] = useState(20);
    
    // Calcular discos por lado
    const platesPerSide = React.useMemo(() => {
        let remaining = (weight - barWeight) / 2;
        if (remaining <= 0) return [];
        
        const plates: number[] = [];
        AVAILABLE_PLATES.forEach(plate => {
            while (remaining >= plate) {
                plates.push(plate);
                remaining -= plate;
            }
        });
        return plates;
    }, [weight, barWeight]);

    const plateText = platesPerSide.length > 0 
        ? platesPerSide.join(', ') 
        : 'Solo la barra';

    return (
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden flex flex-col max-h-[90vh] bg-surface-bg border border-surface-border rounded-[2rem] shadow-2xl animate-fade-in-up">
            <div className="flex flex-col h-full overflow-hidden">
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-surface-border flex-shrink-0 flex justify-between items-center bg-surface-bg/80 backdrop-blur-md z-10">
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] drop-shadow-sm flex items-center gap-2">Calculadora <span className="text-brand-accent">Discos</span></h3>
                    <IconButton 
                        variant="ghost" 
                        size="small" 
                        onClick={() => { vibrate(5); onClose(); }} 
                        icon={XIcon}
                        label="Cerrar"
                    />
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
                    {/* Visual Representation (The Barbell Sleeve) */}
                    <div className="h-40 bg-bg-base border border-surface-border rounded-[1.5rem] mb-6 relative flex items-center justify-start px-4 overflow-hidden shadow-inner">
                        {/* The Bar Sleeve */}
                        <div className="absolute left-0 w-full h-4 bg-gray-600 z-0"></div>
                        <div className="absolute left-0 w-8 h-10 bg-gray-400 border-r border-gray-500 z-10 rounded-sm shadow-md"></div> {/* Collar */}
                        
                        {/* Plates Stack */}
                        <div className="flex items-center gap-1 z-20 ml-8 relative animate-fade-in-up">
                            {platesPerSide.map((p, i) => (
                                <div 
                                    key={i}
                                    className={`w-4 ${PLATE_HEIGHTS[p] || 'h-12'} ${PLATE_COLORS[p] || 'bg-gray-500'} rounded-sm border-r border-b shadow-[4px_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center`}
                                    title={`${p}kg`}
                                    style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                                >
                                    {/* Optional: Text inside plate if big enough, or just simple stripes */}
                                    <div className="w-full h-[90%] border-l border-white/20 opacity-50"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result Text */}
                    <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Por cada lado</p>
                        <p className="text-brand-accent font-display text-2xl font-black uppercase tracking-tight drop-shadow-sm">{plateText}</p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block mb-2 pl-1">Peso Total (kg)</label>
                            <div className="flex items-center gap-3">
                                <IconButton 
                                    variant="secondary" 
                                    onClick={() => { vibrate(10); setWeight(Math.max(barWeight, weight - 2.5)); }} 
                                    className="w-14 h-14 !p-0 rounded-2xl" 
                                    icon={MinusIcon} 
                                    label="Menos"
                                />
                                <div className="flex-grow bg-bg-base rounded-2xl border border-surface-border p-3 text-center shadow-inner h-14 flex items-center justify-center">
                                    <span className="text-3xl font-heading font-black text-text-primary tracking-tighter">{weight}</span>
                                </div>
                                <IconButton 
                                    variant="secondary" 
                                    onClick={() => { vibrate(10); setWeight(weight + 2.5); }} 
                                    className="w-14 h-14 !p-0 rounded-2xl" 
                                    icon={PlusIcon} 
                                    label="Más"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] block mb-2 pl-1">Peso de la Barra</label>
                            <div className="flex p-1.5 bg-bg-base/80 backdrop-blur-sm rounded-[1.25rem] border border-surface-border gap-1.5 shadow-inner">
                                {[20, 15, 10].map(w => (
                                    <ChipButton
                                        key={w}
                                        onClick={() => { vibrate(5); setBarWeight(w); }}
                                        active={barWeight === w}
                                        tone="neutral"
                                        size="medium"
                                        className="flex-1 rounded-xl"
                                    >
                                        {w}k
                                    </ChipButton>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Fixed Footer */}
                <div className="p-6 pt-4 border-t border-surface-border flex-shrink-0 bg-surface-bg/80 z-10">
                    <Button 
                        variant="secondary" 
                        size="large"
                        onClick={() => { vibrate(10); onClose(); }} 
                        className="w-full"
                    >
                        Cerrar Calculadora
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlateCalculatorModal;
