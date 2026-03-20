import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Button from '../../components/Button';
import { BarcodeIcon, XIcon } from '../../components/icons';

interface BarcodeScannerViewProps {
    onScanSuccess: (text: string) => void;
    onClose: () => void;
}

const BarcodeScannerView: React.FC<BarcodeScannerViewProps> = ({ onScanSuccess, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef(new BrowserMultiFormatReader());
    const isScanningRef = useRef(true);
    const controlsRef = useRef<{ stop: () => void } | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

    const onScanSuccessRef = useRef(onScanSuccess);
    useEffect(() => {
        onScanSuccessRef.current = onScanSuccess;
    }, [onScanSuccess]);

    useEffect(() => {
        const videoElement = videoRef.current;
        const codeReader = codeReaderRef.current;

        if (!videoElement) return;

        const startScanning = async () => {
            try {
                const controls = await codeReader.decodeFromConstraints(
                    {
                        video: {
                            facingMode: { ideal: 'environment' },
                        },
                    },
                    videoElement,
                    (result) => {
                        if (result && isScanningRef.current) {
                            isScanningRef.current = false;
                            if (navigator.vibrate) navigator.vibrate(50);
                            onScanSuccessRef.current(result.getText());
                        }
                    }
                );

                controlsRef.current = controls;
                setHasPermission(true);
            } catch (err: unknown) {
                console.error('Camera permission/start failed:', err);
                setHasPermission(false);
                setScanError(err instanceof Error ? err.message : 'No se pudo acceder a la camara. Verifica los permisos.');
            }
        };

        startScanning();

        return () => {
            if (controlsRef.current) {
                controlsRef.current.stop();
                controlsRef.current = null;
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#0A0A0A] animate-fade-in-up">
            <div className="absolute inset-0 z-0 bg-black">
                <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="h-full w-full object-cover bg-black"
                />
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
                <div className="pointer-events-auto flex items-start justify-between">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-zinc-900/90 px-4 py-2.5 shadow-xl backdrop-blur-md">
                        <div className="h-2 w-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(var(--color-brand-accent-rgb),0.5)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Escaner activo</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-zinc-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 active:scale-95"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-80">
                    <div className="pointer-events-none absolute -inset-[100vh] border-[100vh] border-black/60" />

                    <div className="relative h-full w-full">
                        <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-brand-accent" />
                        <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-brand-accent" />
                        <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-brand-accent" />
                        <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-brand-accent" />
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 animate-scan bg-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),1)]" />
                    </div>

                    <div className="absolute -bottom-12 left-0 right-0 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent animate-pulse">Buscando codigo de barras</p>
                    </div>
                </div>

                <div className="pointer-events-auto pb-12 text-center">
                    {hasPermission === false && (
                        <div className="mx-auto mb-6 max-w-xs rounded-3xl border border-red-500/30 bg-red-950/40 p-6 shadow-2xl backdrop-blur-xl">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-red-400">Error de acceso</p>
                            <p className="text-xs font-medium leading-relaxed text-white opacity-80">
                                {scanError || 'Habilita los permisos de camara en tu navegador para continuar.'}
                            </p>
                            <Button onClick={onClose} variant="secondary" size="small" className="mt-4 w-full rounded-xl">
                                Cerrar
                            </Button>
                        </div>
                    )}

                    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-zinc-900/90 px-6 py-4 shadow-2xl backdrop-blur-md">
                        <BarcodeIcon className="h-5 w-5 text-brand-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">Alinea el codigo en el marco</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerView;
