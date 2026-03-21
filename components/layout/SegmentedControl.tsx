import React from 'react';

export interface SegmentedControlItem<T extends string> {
  id: T;
  label: string;
  icon?: React.FC<{ className?: string }>;
  badge?: number | string;
}

interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div className={['ui-segmented-control w-full', className].filter(Boolean).join(' ')} role="tablist">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === value;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active ? 'true' : 'false'}
            onClick={() => onChange(item.id)}
            className="ui-segmented-control__item flex-1"
          >
            {Icon ? <Icon className="h-3.5 w-3.5 flex-shrink-0" /> : null}
            <span className="truncate">{item.label}</span>
            {item.badge !== undefined ? (
              <span className="ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-white/12 px-1.5 py-0.5 text-[9px] font-black tracking-[0.08em]">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
