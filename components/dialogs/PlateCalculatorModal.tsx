import React, { useMemo, useState } from 'react';
import Modal from '../Modal';
import ChipButton from '../ChipButton';
import DialogSectionCard from '../DialogSectionCard';
import IconButton from '../IconButton';
import StepperControl from '../StepperControl';
import Tag from '../Tag';
import { XIcon } from '../icons';
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

  const platesPerSide = useMemo(() => {
    let remaining = (weight - barWeight) / 2;
    if (remaining <= 0) return [];

    const plates: number[] = [];
    AVAILABLE_PLATES.forEach((plate) => {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    });
    return plates;
  }, [weight, barWeight]);

  return (
    <Modal onClose={onClose} className="max-w-md overflow-hidden !p-0">
      <div className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-protein/10" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Tag variant="status" tone="accent" size="sm">
                Load Math
              </Tag>
              <h3 className="mt-3 text-xl font-black uppercase tracking-[-0.04em] text-text-primary">Calculadora de discos</h3>
            </div>
            <IconButton onClick={() => { vibrate(5); onClose(); }} icon={XIcon} label="Cerrar" variant="secondary" size="small" />
          </div>

          <DialogSectionCard className="space-y-4 p-5">
            <div className="h-40 overflow-hidden rounded-[1.5rem] border border-surface-border bg-bg-base px-4">
              <div className="relative flex h-full items-center">
                <div className="absolute left-0 right-0 h-4 bg-gray-600" />
                <div className="absolute left-0 z-10 h-10 w-8 rounded-sm border-r border-gray-500 bg-gray-400 shadow-md" />
                <div className="relative z-20 ml-8 flex items-center gap-1">
                  {platesPerSide.length > 0 ? (
                    platesPerSide.map((plate, index) => (
                      <div
                        key={`${plate}-${index}`}
                        className={`w-4 rounded-sm border-r border-b shadow-[4px_0_10px_rgba(0,0,0,0.45)] ${PLATE_HEIGHTS[plate]} ${PLATE_COLORS[plate]}`}
                        title={`${plate}kg`}
                      />
                    ))
                  ) : (
                    <div className="rounded-full border border-surface-border bg-surface-bg px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-text-secondary">
                      Solo barra
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Por cada lado</p>
              <p className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-text-primary">
                {platesPerSide.length > 0 ? platesPerSide.join(' / ') : 'Solo la barra'}
              </p>
            </div>
          </DialogSectionCard>

          <DialogSectionCard className="space-y-4 p-5">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Peso total</p>
              <StepperControl
                value={weight.toFixed(1)}
                onDecrement={() => { vibrate(10); setWeight((value) => Math.max(barWeight, value - 2.5)); }}
                onIncrement={() => { vibrate(10); setWeight((value) => value + 2.5); }}
                decrementLabel="Reducir peso"
                incrementLabel="Aumentar peso"
                className="w-full justify-between bg-bg-base"
                valueClassName="text-lg"
              />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">Peso de la barra</p>
              <div className="flex gap-2">
                {[20, 15, 10].map((value) => (
                  <ChipButton
                    key={value}
                    onClick={() => { vibrate(5); setBarWeight(value); }}
                    active={barWeight === value}
                    tone="neutral"
                    size="medium"
                    className="flex-1"
                  >
                    {value} kg
                  </ChipButton>
                ))}
              </div>
            </div>
          </DialogSectionCard>
        </div>
      </div>
    </Modal>
  );
};

export default PlateCalculatorModal;
