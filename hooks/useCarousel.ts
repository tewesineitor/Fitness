import { useState, useEffect, useCallback, TouchEvent } from 'react';

export const useCarousel = (itemCount: number, intervalMs?: number) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const getHourlyItemIndex = useCallback(() => {
        if (itemCount === 0) return 0;
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - startOfYear.getTime();
        const hoursSinceYearStart = Math.floor(diff / (1000 * 60 * 60));
        return hoursSinceYearStart % itemCount;
    }, [itemCount]);

    const goNext = useCallback(() => {
        if (itemCount === 0) return;
        setActiveIndex(prev => (prev === itemCount - 1 ? 0 : prev + 1));
    }, [itemCount]);

    const goPrev = useCallback(() => {
        if (itemCount === 0) return;
        setActiveIndex(prev => (prev === 0 ? itemCount - 1 : prev - 1));
    }, [itemCount]);

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            goNext();
        }
        if (isRightSwipe) {
            goPrev();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    const goTo = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    useEffect(() => {
        if (!intervalMs || itemCount === 0) return;

        setActiveIndex(getHourlyItemIndex());

        const calculateTimeout = () => {
            const now = new Date();
            const nextHour = new Date(now);
            nextHour.setHours(now.getHours() + 1, 0, 1, 0);
            return nextHour.getTime() - now.getTime();
        };
        
        let intervalId: ReturnType<typeof setInterval>;
        const timeoutId = setTimeout(() => {
            setActiveIndex(getHourlyItemIndex());
            intervalId = setInterval(() => {
                setActiveIndex(getHourlyItemIndex());
            }, 60 * 60 * 1000);
        }, calculateTimeout());

        return () => {
            clearTimeout(timeoutId);
            if(intervalId) clearInterval(intervalId);
        };
    }, [itemCount, intervalMs, getHourlyItemIndex]);
    
     useEffect(() => {
        // Reset index if itemCount changes to prevent out-of-bounds
        if (activeIndex >= itemCount) {
            setActiveIndex(0);
        }
    }, [itemCount, activeIndex]);

    return {
        activeIndex,
        goTo,
        goNext,
        goPrev,
        touchHandlers: {
            onTouchStart,
            onTouchMove,
            onTouchEnd
        }
    };
};
