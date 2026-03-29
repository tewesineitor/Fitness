import React, { useState } from 'react';
import { BookOpenIcon, PlateIcon, PlayIcon, WaterGlassIcon } from '../components/icons';
import MacroArcGauge from '../components/ui-premium/MacroArcGauge';
import NonNegotiableCard from '../components/ui-premium/NonNegotiableCard';
import PremiumBadge from '../components/ui-premium/PremiumBadge';
import PremiumButton from '../components/ui-premium/PremiumButton';
import PremiumInput from '../components/ui-premium/PremiumInput';
import PremiumModal from '../components/ui-premium/PremiumModal';
import PremiumStepper from '../components/ui-premium/PremiumStepper';
import RecipeCardPremium from '../components/ui-premium/RecipeCardPremium';
import RoutineCardPremium from '../components/ui-premium/RoutineCardPremium';
import SegmentedTabs from '../components/ui-premium/SegmentedTabs';
import SquishyCard from '../components/ui-premium/SquishyCard';
import CircularTimer from '../components/CircularTimer';
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

const segmentOptions = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3+', value: 3 },
];

const DesignSystemDevScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepperValue, setStepperValue] = useState(80);
  const [selectedSegment, setSelectedSegment] = useState<string | number>(1);
  const [searchValue, setSearchValue] = useState('Upper strength');

  return (
    <div className="min-h-screen text-white p-8 pb-40 overflow-y-auto">
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
            <SectionTitle>Controles Táctiles (Steppers)</SectionTitle>
            <MutedText>Botones táctiles [-] y [+] con display numérico central. Extraídos de FuerzaScreen.</MutedText>
          </div>
          <PremiumStepper
            label="Carga (kg)"
            value={stepperValue}
            onDecrement={() => setStepperValue((v) => Math.max(0, v - 2.5))}
            onIncrement={() => setStepperValue((v) => v + 2.5)}
            prevLabel="Anterior: 77.5 kg"
          />
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Controles de Segmento (Tabs)</SectionTitle>
            <MutedText>Píldoras segmentadas con acento esmeralda en estado activo. Extraídas de FuerzaScreen (selector RIR).</MutedText>
          </div>
          <SegmentedTabs
            label="RIR — Reps en reserva"
            options={segmentOptions}
            selectedValue={selectedSegment}
            onChange={setSelectedSegment}
          />
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Etiquetas (Badges)</SectionTitle>
            <MutedText>Alerta contextual con fondo esmeralda traslúcido. Extraída de FuerzaScreen (foco técnico).</MutedText>
          </div>
          <div className="flex flex-col gap-3">
            <PremiumBadge icon="ℹ️">
              Pausa Isométrica — mantén la tensión en la fase excéntrica.
            </PremiumBadge>
            <PremiumBadge>
              Badge sin icono — solo texto de soporte contextual.
            </PremiumBadge>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Indicadores de Progreso</SectionTitle>
            <MutedText>Anillo SVG de cuenta regresiva. Simulado con 45 s de duración.</MutedText>
          </div>
          <SquishyCard padding="lg" className="flex items-center justify-center py-10">
            <CircularTimer
              initialDuration={90}
              timeLeft={45}
              size={220}
              strokeWidth={14}
              strokeColor="text-brand-accent"
            />
          </SquishyCard>
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

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Tarjetas y Layouts Complejos (Hoy / Biblioteca)</SectionTitle>
            <MutedText>Bloques estructurales premium para dashboards de hoy, listados y bibliotecas ricas.</MutedText>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <MacroArcGauge
              eyebrow="Resumen nutricional"
              title="Macros del día"
              macros={[
                { label: 'Carbohidratos', value: 146, target: 180, tone: 'amber' },
                { label: 'Grasas', value: 52, target: 70, tone: 'sky' },
                { label: 'Proteínas', value: 138, target: 160, tone: 'emerald' },
              ]}
            />

            <RecipeCardPremium
              title="Bowl de pollo con arroz jazmín"
              calories="520 kcal"
              servings="2 porciones"
              description="Tarjeta premium para biblioteca de recetas con hero visual, metadata y chips de macros reutilizables."
              macros={[
                { label: 'P', value: '42 g' },
                { label: 'C', value: '48 g' },
                { label: 'F', value: '16 g' },
              ]}
              media={
                <>
                  <img
                    src="/assets/recipes/bowl-pollo.png"
                    alt="Bowl de pollo"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                  <div className="absolute inset-0 p-5 flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                      <EyebrowText>Biblioteca</EyebrowText>
                      <MutedText>Meal prep premium</MutedText>
                    </div>
                    <PlateIcon className="h-12 w-12 text-zinc-300 drop-shadow-lg" />
                  </div>
                </>
              }
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RoutineCardPremium
              eyebrow="Intermedio - Fuerza"
              title="Upper Strength / Semana 4"
              meta="45 min"
              description="Tarjeta hero para rutinas activas o sugeridas, con jerarquía editorial fuerte y CTA sutil para entrar al detalle."
              chips={['4 bloques', 'Push / Pull', 'RPE 8']}
              ctaLabel="Ver rutina"
              onCtaClick={() => console.log('Click')}
            />

            <div className="flex flex-col gap-4">
              <NonNegotiableCard
                icon={<WaterGlassIcon className="h-7 w-7" />}
                title="Bebe Agua"
                description="Tarjeta horizontal para hábitos no negociables y recordatorios rápidos del dashboard diario."
                meta="3L"
                onClick={() => console.log('Click')}
              />

              <NonNegotiableCard
                icon={<BookOpenIcon className="h-7 w-7" />}
                title="Lee 10 min"
                description="El mismo bloque puede vivir como checklist premium en Hoy o como item destacado dentro de Biblioteca."
                meta="10m"
              />

              <PremiumInput
                label="Buscar receta o rutina"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Ej. upper strength, bowl proteico"
                hint="Control de input de cristal para forms, búsqueda rápida y filtros contextuales."
              />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RecipeCardPremium
              title="Overnight oats de cacao"
              calories="410 kcal"
              servings="Desayuno"
              description="Variante compacta para destacar recetas recurrentes, favoritos o sugerencias basadas en objetivos."
              macros={[
                { label: 'P', value: '28 g' },
                { label: 'C', value: '39 g' },
                { label: 'F', value: '11 g' },
              ]}
              media={
                <>
                  <img
                    src="/assets/recipes/oats-cacao.png"
                    alt="Overnight oats"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/10" />
                  <div className="absolute inset-0 p-5 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <EyebrowText>Favorita</EyebrowText>
                      <MutedText>Alta en proteína</MutedText>
                    </div>
                    <PlayIcon className="h-10 w-10 text-zinc-300 drop-shadow-lg" />
                  </div>
                </>
              }
            />

            <SquishyCard padding="lg" className="flex flex-col gap-4">
              <EyebrowText>Composición</EyebrowText>
              <CardTitle>Stack de biblioteca</CardTitle>
              <BodyText>
                Estos bloques se pueden combinar para formar carruseles, rows editoriales y panels de onboarding sin salir del lenguaje premium del sistema.
              </BodyText>
              <div className="flex flex-wrap gap-3">
                <PremiumBadge>Hoy</PremiumBadge>
                <PremiumBadge>Biblioteca</PremiumBadge>
                <PremiumBadge>Reusable</PremiumBadge>
              </div>
            </SquishyCard>
          </div>
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
