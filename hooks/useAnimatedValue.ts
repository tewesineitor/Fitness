import { useState, useEffect, useRef } from 'react';

export const useAnimatedValue = (endValue: number, duration = 750) => {
    const [currentValue, setCurrentValue] = useState(endValue);
    const frameRef = useRef<number | null>(null);
    const startValueRef = useRef(endValue);
    const startTimeRef = useRef<number | null>(null);
    
    useEffect(() => {
        startValueRef.current = currentValue;
        startTimeRef.current = null; // Reset start time for new animation

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out function for smoother animation
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const newValue = Math.round(startValueRef.current + (endValue - startValueRef.current) * easeOutProgress);
            
            setCurrentValue(newValue);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        // Start the animation
        frameRef.current = requestAnimationFrame(animate);

        // Cleanup function to cancel animation on unmount or if endValue changes
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [endValue, duration]);
    
    return currentValue;
};
