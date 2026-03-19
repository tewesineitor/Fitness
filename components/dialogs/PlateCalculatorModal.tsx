
import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { XIcon, MinusIcon, PlusIcon } from '../icons';

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
        <Modal onClose={onClose} className="max-w-md !p-0 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex flex-col h-full overflow-hidden">
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-surface-border flex-shrink-0 flex justify-between items-center">
                    <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.2em]">Calculadora de Discos</h3>
                    <Button 
                        variant="tertiary" 
                        size="small" 
                        onClick={onClose} 
                        className="!p-0 text-text-secondary hover:text-white"
                        icon={XIcon}
                    />
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
                    {/* Visual Representation (The Barbell Sleeve) */}
                    <div className="h-40 bg-surface-bg border border-surface-border rounded-2xl mb-6 relative flex items-center justify-start px-4 overflow-hidden shadow-inner">
                        {/* The Bar Sleeve */}
                        <div className="absolute left-0 w-full h-4 bg-gray-600 z-0"></div>
                        <div className="absolute left-0 w-8 h-10 bg-gray-400 border-r border-gray-500 z-10 rounded-sm"></div> {/* Collar */}
                        
                        {/* Plates Stack */}
                        <div className="flex items-center gap-1 z-20 ml-8 relative">
                            {platesPerSide.map((p, i) => (
                                <div 
                                    key={i}
                                    className={`w-4 ${PLATE_HEIGHTS[p] || 'h-12'} ${PLATE_COLORS[p] || 'bg-gray-500'} rounded-sm border-r border-b shadow-lg flex items-center justify-center`}
                                    title={`${p}kg`}
                                >
                                    {/* Optional: Text inside plate if big enough, or just simple stripes */}
                                    <div className="w-full h-[90%] border-l border-white/20 opacity-50"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Result Text */}
                    <div className="text-center mb-8">
                        <p className="text-text-secondary text-xs uppercase tracking-widest mb-1">Por cada lado</p>
                        <p className="text-white font-mono text-lg font-bold">{plateText}</p>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Peso Total (kg)</label>
                            <div className="flex items-center gap-3">
                                <Button variant="secondary" onClick={() => setWeight(Math.max(barWeight, weight - 2.5))} className="w-12 h-12 !p-0 rounded-xl" icon={MinusIcon} />
                                <div className="flex-grow bg-surface-bg rounded-xl border border-surface-border p-3 text-center shadow-inner h-12 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white tracking-tight">{weight}</span>
                                </div>
                                <Button variant="secondary" onClick={() => setWeight(weight + 2.5)} className="w-12 h-12 !p-0 rounded-xl" icon={PlusIcon} />
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Peso de la Barra</label>
                            <div className="flex p-1 bg-surface-bg rounded-xl border border-surface-border gap-1">
                                {[20, 15, 10].map(w => (
                                    <button
                                        key={w}
                                        onClick={() => setBarWeight(w)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${barWeight === w ? 'bg-brand-accent text-white shadow-sm' : 'text-text-secondary hover:text-white hover:bg-surface-hover'}`}
                                    >
                                        {w}kg
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Fixed Footer (Optional, but good for consistency) */}
                <div className="p-6 pt-4 border-t border-surface-border flex-shrink-0">
                    <Button variant="secondary" onClick={onClose} className="w-full text-xs uppercase tracking-widest opacity-60 hover:opacity-100">
                        Cerrar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PlateCalculatorModal;
