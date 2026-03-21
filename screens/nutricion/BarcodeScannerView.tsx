import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Button from '../../components/Button';
import Card from '../../components/Card';
import IconButton from '../../components/IconButton';
import Tag from '../../components/Tag';
import { BarcodeIcon, ChevronRightIcon, SparklesIcon, XIcon } from '../../components/icons';

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
      } catch (error: unknown) {
        setHasPermission(false);
        setScanError(error instanceof Error ? error.message : 'No se pudo acceder a la camara. Verifica los permisos.');
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
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0 bg-black">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover bg-black" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

      <div className="relative z-20 flex flex-1 flex-col justify-between p-5">
        <div className="pointer-events-auto flex items-start justify-between gap-4">
          <div>
            <Tag variant="overlay" tone="accent" size="sm" className="border-white/10 bg-black/45 text-white">
              Live Scanner
            </Tag>
            <h2 className="mt-3 max-w-[10ch] text-3xl font-black uppercase tracking-[-0.06em] text-white">
              Scan Barcode
            </h2>
          </div>

          <IconButton
            onClick={onClose}
            icon={XIcon}
            label="Cerrar escaner"
            variant="secondary"
            size="medium"
            className="border-white/15 bg-black/45 text-white hover:bg-black/60 hover:text-white"
          />
        </div>

        <div className="pointer-events-none relative mx-auto flex w-full max-w-sm flex-1 items-center justify-center px-3">
          <div className="absolute inset-x-6 top-1/2 h-64 -translate-y-1/2 rounded-[2rem] border border-white/10 bg-black/35 backdrop-blur-[2px]" />
          <div className="absolute left-1/2 top-1/2 h-56 w-[82%] max-w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem]">
            <div className="pointer-events-none absolute -inset-[100vh] border-[100vh] border-black/58" />

            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/15 bg-transparent">
              <div className="absolute left-0 top-0 h-9 w-9 border-l-2 border-t-2 border-brand-accent" />
              <div className="absolute right-0 top-0 h-9 w-9 border-r-2 border-t-2 border-brand-accent" />
              <div className="absolute bottom-0 left-0 h-9 w-9 border-b-2 border-l-2 border-brand-accent" />
              <div className="absolute bottom-0 right-0 h-9 w-9 border-b-2 border-r-2 border-brand-accent" />
              <div className="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 animate-scan bg-brand-accent shadow-[0_0_18px_rgba(var(--color-brand-accent-rgb),0.95)]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-auto pb-4">
          <Card variant="glass" className="mx-auto w-full max-w-md border-white/10 bg-black/45 px-5 py-5 text-white shadow-2xl">
            {hasPermission === false ? (
              <div className="space-y-4">
                <Tag variant="status" tone="danger" size="sm">
                  Camera access required
                </Tag>
                <p className="text-sm font-medium leading-relaxed text-white/75">
                  {scanError || 'Habilita el permiso de camara en tu navegador para continuar.'}
                </p>
                <Button onClick={onClose} variant="secondary" size="small" className="w-full border-white/15 bg-black/30 text-white">
                  Cerrar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">Nutrition capture</p>
                    <p className="mt-2 text-base font-semibold leading-snug text-white">
                      Alinea el codigo dentro del marco para abrir el editor con el producto detectado.
                    </p>
                  </div>
                  <div className="rounded-full border border-brand-accent/20 bg-brand-accent/10 p-3 text-brand-accent">
                    <BarcodeIcon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[1.15rem] border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-brand-accent" />
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Auto parse</span>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-white/50" />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerView;
