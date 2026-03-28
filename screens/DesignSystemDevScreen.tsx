import React, { useState } from 'react';
import PremiumButton from '../components/ui-premium/PremiumButton';
import PremiumModal from '../components/ui-premium/PremiumModal';
import SquishyCard from '../components/ui-premium/SquishyCard';
import {
  EyebrowText,
  ModalTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  MutedText,
  StatValue,
  MonoValue,
} from '../components/ui-premium/Typography';

type TypographyShowcaseItem = {
  label: string;
  preview: React.ReactNode;
};

const typographyItems: TypographyShowcaseItem[] = [
  {
    label: 'EyebrowText',
    preview: <EyebrowText>System Token</EyebrowText>,
  },
  {
    label: 'ModalTitle',
    preview: <ModalTitle>Premium Modal Title</ModalTitle>,
  },
  {
    label: 'SectionTitle',
    preview: <SectionTitle>Section Title Sample</SectionTitle>,
  },
  {
    label: 'CardTitle',
    preview: <CardTitle>Card Title Sample</CardTitle>,
  },
  {
    label: 'BodyText',
    preview: (
      <BodyText>
        Texto base para auditar ritmo, contraste y legibilidad en superficies oscuras.
      </BodyText>
    ),
  },
  {
    label: 'MutedText',
    preview: <MutedText>Texto de soporte para hints y metadata secundaria.</MutedText>,
  },
  {
    label: 'StatValue',
    preview: <StatValue>128</StatValue>,
  },
  {
    label: 'MonoValue',
    preview: <MonoValue>00:42:18</MonoValue>,
  },
];

const buttonVariants: Array<{ variant: 'primary' | 'ghost'; size: 'md' | 'lg' }> = [
  { variant: 'primary', size: 'md' },
  { variant: 'primary', size: 'lg' },
  { variant: 'ghost', size: 'md' },
  { variant: 'ghost', size: 'lg' },
];

const DesignSystemDevScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 pb-32 overflow-y-auto">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        <section className="flex flex-col gap-4">
          <EyebrowText>Playground temporal</EyebrowText>
          <div className="flex flex-col gap-3">
            <ModalTitle>UI Premium Audit Surface</ModalTitle>
            <BodyText className="max-w-2xl">
              Pantalla interna para inspeccionar los componentes canónicos del Design System
              antes de conectarlos a flujos reales.
            </BodyText>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Tipografía</SectionTitle>
            <MutedText>Vista comparativa para revisar escala, peso y contraste.</MutedText>
          </div>

          <div className="grid gap-4">
            {typographyItems.map((item) => (
              <SquishyCard
                key={item.label}
                padding="md"
                className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-center"
              >
                <MonoValue className="text-zinc-500">{item.label}</MonoValue>
                <div className="min-w-0">{item.preview}</div>
              </SquishyCard>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Botones</SectionTitle>
            <MutedText>Combinaciones canónicas de variante y tamaño.</MutedText>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {buttonVariants.map(({ variant, size }) => (
              <SquishyCard key={`${variant}-${size}`} padding="md" className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{variant} / {size}</CardTitle>
                  <MutedText>PremiumButton</MutedText>
                </div>

                <PremiumButton
                  variant={variant}
                  size={size}
                  onClick={() => console.log('Click')}
                >
                  {variant === 'primary' ? 'Run Action' : 'Secondary Action'}
                </PremiumButton>
              </SquishyCard>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Tarjetas</SectionTitle>
            <MutedText>Exploración rápida de densidad, padding y affordance interactivo.</MutedText>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SquishyCard padding="md" className="flex flex-col gap-3">
              <EyebrowText>Padding md</EyebrowText>
              <CardTitle>Resumen compacto</CardTitle>
              <BodyText>
                Ejemplo base para validar spacing medio en tarjetas informativas.
              </BodyText>
              <StatValue>84%</StatValue>
            </SquishyCard>

            <SquishyCard padding="lg" className="flex flex-col gap-4">
              <EyebrowText>Padding lg</EyebrowText>
              <CardTitle>Tarjeta amplia</CardTitle>
              <BodyText>
                Variante con mayor respiración interna para layouts premium o módulos hero.
              </BodyText>
              <MonoValue>cal / week / 12,480</MonoValue>
            </SquishyCard>

            <SquishyCard
              padding="md"
              interactive
              onClick={() => console.log('Click')}
              className="flex flex-col gap-3 ring-1 ring-emerald-400/20"
            >
              <EyebrowText>Interactive</EyebrowText>
              <CardTitle>Estado presionable</CardTitle>
              <BodyText>
                Simulación de una superficie tocable para revisar feedback visual y jerarquía.
              </BodyText>
              <MutedText>Haz click para probar la interacción.</MutedText>
            </SquishyCard>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Modal</SectionTitle>
            <MutedText>Preview del contenedor premium, media slot y CTA inferior.</MutedText>
          </div>

          <SquishyCard padding="lg" className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <CardTitle>Abrir modal de prueba</CardTitle>
              <BodyText>
                El contenido usa los tokens de tipografía del sistema para validar consistencia
                dentro de overlays.
              </BodyText>
            </div>

            <div className="w-full max-w-sm">
              <PremiumButton size="lg" variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Premium Modal
              </PremiumButton>
            </div>
          </SquishyCard>
        </section>
      </div>

      {isModalOpen && (
        <PremiumModal
          onClose={() => setIsModalOpen(false)}
          onPrimary={() => setIsModalOpen(false)}
          eyebrow="Playground modal"
          title="Premium Modal"
          primaryLabel="Cerrar modal"
          headerMedia={
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.22),transparent_55%),linear-gradient(135deg,rgba(24,24,27,1),rgba(39,39,42,0.92))]">
              <div className="absolute inset-6 rounded-[2rem] border border-white/10" />
              <div className="relative flex flex-col items-center gap-2 text-center px-6">
                <EyebrowText>Header Media</EyebrowText>
                <StatValue>16:9</StatValue>
                <MutedText>Placeholder visual para imagen, GIF o video.</MutedText>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <EyebrowText>Audit copy</EyebrowText>
            <ModalTitle className="text-2xl">Contenido de ejemplo</ModalTitle>
            <BodyText>
              Este modal sirve para revisar la composición del contenedor, el slot de media y la
              convivencia entre tokens tipográficos dentro del overlay.
            </BodyText>
            <MutedText>
              Cierra con el CTA inferior o tocando el backdrop para comprobar el comportamiento.
            </MutedText>
            <MonoValue>modal.state = open</MonoValue>
          </div>
        </PremiumModal>
      )}
    </div>
  );
};

export default DesignSystemDevScreen;
