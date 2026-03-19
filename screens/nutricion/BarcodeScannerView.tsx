
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
    const controlsRef = useRef<any>(null);
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
                const constraints = {
                    video: {
                        facingMode: { ideal: 'environment' }
                    }
                };

                const controls = await codeReader.decodeFromConstraints(
                    constraints,
                    videoElement,
                    (result, err) => {
                        if (result && isScanningRef.current) {
                            isScanningRef.current = false;
                            if (navigator.vibrate) navigator.vibrate(50);
                            onScanSuccessRef.current(result.getText());
                        }
                    }
                );
                
                controlsRef.current = controls;
                setHasPermission(true);
            } catch (err) {
                console.error('Camera permission/start failed:', err);
                setHasPermission(false);
                setScanError("No se pudo acceder a la cámara. Verifica los permisos.");
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
        <div className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col animate-fade-in-up overflow-hidden">
            {/* Camera Feed Layer */}
            <div className="absolute inset-0 z-0 bg-black">
                <video 
                    ref={videoRef} 
                    playsInline 
                    muted
                    className="w-full h-full object-cover bg-black" 
                />
            </div>

            {/* HUD Overlay Layer */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none">
                
                {/* Header */}
                <div className="flex justify-between items-start pointer-events-auto">
                    <div className="bg-zinc-900/90 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_rgba(var(--color-brand-accent-rgb),0.5)]"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Escáner Activo</span>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-white/20 text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Central Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-48 sm:w-80 sm:h-56">
                    {/* Darkened area outside reticle for focus */}
                    <div className="absolute -inset-[100vh] border-[100vh] border-black/60 pointer-events-none"></div>
                    
                    {/* Reticle Box */}
                    <div className="relative w-full h-full">
                        {/* Corner Accents - Minimalist */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-accent"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-accent"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-accent"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-accent"></div>

                        {/* Subtle Scan Line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),1)] animate-scan top-1/2"></div>
                    </div>

                    {/* Status Text below reticle */}
                    <div className="absolute -bottom-12 left-0 right-0 text-center">
                        <p className="text-[10px] font-bold font-mono text-brand-accent uppercase tracking-[0.3em] animate-pulse">Buscando código de barras</p>
                    </div>
                </div>

                {/* Footer / Instructions */}
                <div className="text-center pb-12 pointer-events-auto">
                    {hasPermission === false && (
                        <div className="bg-red-950/40 border border-red-500/30 p-6 rounded-3xl backdrop-blur-xl mb-6 mx-auto max-w-xs shadow-2xl">
                            <p className="text-red-400 font-black text-[10px] uppercase tracking-widest mb-2">Error de Acceso</p>
                            <p className="text-white text-xs opacity-80 leading-relaxed font-medium">{scanError || "Habilita los permisos de cámara en tu navegador para continuar."}</p>
                            <Button onClick={onClose} variant="secondary" size="small" className="mt-4 w-full rounded-xl">Cerrar</Button>
                        </div>
                    )}
                    
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-white/20 shadow-2xl">
                        <BarcodeIcon className="w-5 h-5 text-brand-accent" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.15em]">Alinea el código en el marco</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScannerView;
