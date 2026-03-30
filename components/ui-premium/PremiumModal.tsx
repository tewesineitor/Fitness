import React from 'react';
import { XIcon } from '../icons';
import { vibrate } from '../../utils/helpers';
import PremiumButton from './PremiumButton';
import { EyebrowText, ModalTitle } from './Typography';

interface PremiumModalProps {
  onClose: () => void;
  children: React.ReactNode;
  /**
   * Slot for media injected above the card header (image, GIF, video, etc.)
   * Renders inside a rounded 16:9 container at the top of the card.
   */
  headerMedia?: React.ReactNode;
  /**
   * Eyebrow label shown above the title in emerald-400.
   */
  eyebrow?: string;
  title?: string;
  /**
   * CTA label for the primary close/confirm button at the bottom.
   * If omitted, no bottom FAB is rendered.
   */
  primaryLabel?: string;
  onPrimary?: () => void;
  /**
   * Max width of the inner card. Defaults to 'max-w-2xl'.
   */
  maxWidth?: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({
  onClose,
  children,
  headerMedia,
  eyebrow,
  title,
  primaryLabel,
  onPrimary,
  maxWidth = 'max-w-2xl',
}) => {
  return (
    <div
      className="fixed inset-0 z-[200] bg-zinc-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) { vibrate(5); onClose(); } }}
    >
      {/* ── Inner card ──────────────────────────────────────────────────────── */}
      <div
        className={[
          'w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem]',
          'flex flex-col shadow-2xl max-h-[90dvh] overflow-hidden',
          'animate-slide-in-up',
          maxWidth,
        ].join(' ')}
      >
        {/* ── Scrollable area ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain hide-scrollbar p-8 flex flex-col gap-6">
          {/* Header media slot — 16:9, sits above everything */}
          {headerMedia && (
            <div className="w-full aspect-video bg-zinc-950 rounded-3xl border border-zinc-800/50 overflow-hidden flex items-center justify-center">
              {headerMedia}
            </div>
          )}

          {/* Title row */}
          {(eyebrow || title) && (
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                {eyebrow && <EyebrowText>{eyebrow}</EyebrowText>}
                {title && <ModalTitle className="text-2xl">{title}</ModalTitle>}
              </div>

              {/* Dismiss X — oculta cuando hay CTA primario inferior */}
              {!primaryLabel && (
                <button
                  onClick={() => { vibrate(5); onClose(); }}
                  className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-100 select-none"
                  aria-label="Cerrar"
                >
                  <XIcon className="w-4 h-4 text-zinc-400" />
                </button>
              )}
            </div>
          )}

          {/* Slot para contenido libre del consumidor */}
          <div className="flex flex-col gap-4">
            {children}
          </div>
        </div>

        {/* ── Sticky footer CTA ───────────────────────────────────────────────── */}
        {primaryLabel && (
          <div className="sticky bottom-0 w-full p-6 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 z-10">
            <PremiumButton
              onPress={() => { onPrimary ? onPrimary() : onClose(); }}
              size="lg"
              variant="primary"
            >
              {primaryLabel}
            </PremiumButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;
