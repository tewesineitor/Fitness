
import { useEffect, useRef } from 'react';

export const useWakeLock = (enabled: boolean) => {
    const sentinelRef = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        const releaseLock = async () => {
            if (sentinelRef.current) {
                try {
                    await sentinelRef.current.release();
                } catch (e) {
                    // Ignore release errors
                }
                sentinelRef.current = null;
            }
        };

        if (!enabled) {
            releaseLock();
            return;
        }

        const requestLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    sentinelRef.current = await navigator.wakeLock.request('screen');
                    sentinelRef.current.addEventListener('release', () => {
                        // Lock released
                    });
                } catch (err: unknown) {
                    // Specific handling for NotAllowedError which happens in IFrames (like AI Studio preview)
                    // or when the device is in low power mode. We fail silently here to avoid console noise.
                    if (!(err instanceof Error) || err.name !== 'NotAllowedError') {
                        console.warn(`Wake Lock request failed: ${err}`);
                    }
                }
            }
        };

        requestLock();

        // Re-request lock if the page becomes visible again (e.g. user switched tabs)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && enabled) {
                requestLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            releaseLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled]);
};
