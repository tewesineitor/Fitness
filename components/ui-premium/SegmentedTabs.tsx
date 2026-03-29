import React from 'react';
import SquishyCard from './SquishyCard';
import { EyebrowText } from './Typography';

interface SegmentOption {
  label: string;
  value: string | number;
}

interface SegmentedTabsProps {
  label?: string;
  options: SegmentOption[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => (
  <SquishyCard padding="md">
    {label && <EyebrowText>{label}</EyebrowText>}

    <div className={`flex gap-2 ${label ? 'mt-4' : ''}`}>
      {options.map((option) => {
        const isActive = option.value === selectedValue;
        return (
          <button
            key={option.value}
            onPointerDown={() => onChange(option.value)}
            className={[
              'flex-1 py-4 rounded-[1.25rem] text-base font-black transition-all duration-150 active:scale-95 select-none',
              isActive
                ? 'bg-emerald-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </SquishyCard>
);

export default SegmentedTabs;
