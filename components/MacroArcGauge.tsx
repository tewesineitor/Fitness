import React from 'react';
import { useAnimatedValue } from '../hooks/useAnimatedValue';

interface MacroArcGaugeProps {
    /** 0–100 percentage of goal met (will be clamped) */
    pct: number;
    /** Macro value text to display in the center */
    value: number | string;
    /** Unit string (g, kcal, etc.) */
    unit?: string;
    /** Label below value */
    label?: string;
    /** Whether the goal has been exceeded */
    isOver?: boolean;
    /** Tailwind stroke color class (e.g. 'stroke-brand-protein') */
    strokeClass: string;
    /** Tailwind text color class for the value */
    textClass: string;
    /** Size in px */
    size?: number;
    /** Stroke width in px (default 5) */
    strokeWidth?: number;
}

/**
 * MacroArcGauge — Obsidian Protocol v2.0
 *
 * Animated SVG arc gauge for macro tracking.
 * Animates on first render via useAnimatedValue hook (spring-ish easing).
 *
 * Usage:
 *   <MacroArcGauge pct={72} value={108} unit="g" label="Proteína"
 *     strokeClass="stroke-brand-protein" textClass="text-brand-protein" />
 */
const MacroArcGauge: React.FC<MacroArcGaugeProps> = ({
    pct,
    value,
    unit = 'g',
    label,
    isOver = false,
    strokeClass,
    textClass,
    size = 80,
    strokeWidth = 6,
}) => {
    const animatedPct = useAnimatedValue(Math.min(Math.max(pct, 0), 100));

    const r = (size / 2) - strokeWidth;
    const cx = size / 2;
    const cy = size / 2;

    // Full arc: 240° sweep from -210° to +30° (left-bottom to right-bottom)
    const startAngle = -210;
    const sweepAngle = 240;

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const describeArc = (fraction: number) => {
        const angle = startAngle + sweepAngle * fraction;
        const startX = cx + r * Math.cos(toRad(startAngle));
        const startY = cy + r * Math.sin(toRad(startAngle));
        const endX   = cx + r * Math.cos(toRad(angle));
        const endY   = cy + r * Math.sin(toRad(angle));
        const largeArc = sweepAngle * fraction > 180 ? 1 : 0;
        return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
    };

    const trackPath = describeArc(1);
    const fillPath  = describeArc(animatedPct / 100);

    const dangerClass = isOver ? 'stroke-danger' : strokeClass;
    const dangerText  = isOver ? 'text-danger'   : textClass;

    return (
        <div className="flex flex-col items-center gap-1" style={{ width: size }}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-[0deg]">
                    {/* Track */}
                    <path
                        d={trackPath}
                        fill="none"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="stroke-surface-hover"
                    />
                    {/* Fill */}
                    <path
                        d={fillPath}
                        fill="none"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className={`transition-all duration-700 ${dangerClass}`}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-mono font-black leading-none ${dangerText}`} style={{ fontSize: size * 0.18 }}>
                        {typeof value === 'number' ? Math.round(value) : value}
                    </span>
                    {unit && (
                        <span className="text-text-muted font-bold uppercase leading-none" style={{ fontSize: size * 0.1 }}>
                            {unit}
                        </span>
                    )}
                </div>
            </div>
            {label && (
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary text-center leading-none">
                    {label}
                </span>
            )}
        </div>
    );
};

export default MacroArcGauge;
