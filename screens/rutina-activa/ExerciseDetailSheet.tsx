
import React from 'react';
import { Exercise } from '../../types';
import Button from '../../components/Button';
import ExerciseImage from '../../components/ExerciseImage';
import { XIcon } from '../../components/icons';

interface ExerciseDetailSheetProps {
    exercise: Exercise;
    onClose: () => void;
}

const FormattedDescription: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-text-secondary whitespace-pre-wrap leading-relaxed font-medium text-sm">
        {text.split(/(\*\*.*?\*\*)/g).map((part, index) => 
            part.startsWith('**') 
                ? <strong key={index} className="font-black text-white block mt-6 mb-2 uppercase tracking-wider text-xs">{part.slice(2, -2)}</strong> 
                : <span key={index}>{part}</span>
        )}
    </div>
);

const ExerciseDetailSheet: React.FC<ExerciseDetailSheetProps> = ({ exercise, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-end justify-center animate-fade-in-up"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl max-h-[90vh] bg-bg-base border-t border-surface-border rounded-t-[2.5rem] flex flex-col shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle Area & Header */}
                <div className="w-full flex flex-col items-center pt-4 pb-2 flex-shrink-0 bg-bg-base z-10">
                     <div className="w-12 h-1.5 bg-surface-border rounded-full mb-4"></div>
                     <div className="w-full px-6 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Detalle de Técnica</span>
                        <button onClick={onClose} className="p-2 bg-surface-hover rounded-full hover:bg-surface-border text-white transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                     </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto px-6 pb-6 pt-2 hide-scrollbar">
                    <div className="w-full aspect-video bg-surface-bg rounded-3xl overflow-hidden mb-8 border border-surface-border shadow-sm relative group mt-4">
                         <ExerciseImage exercise={exercise} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-6">{exercise.name}</h2>
                    
                    <div className="p-6 bg-surface-bg rounded-3xl border border-surface-border shadow-sm">
                        <FormattedDescription text={exercise.description} />
                    </div>
                </div>
                
                <div className="p-6 flex-shrink-0 bg-bg-base border-t border-surface-border pb-safe">
                    <Button onClick={onClose} className="w-full py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-accent/20" size="large">
                        Volver al Entrenamiento
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetailSheet;
