import React, { useState } from 'react';
import { CheckCircleIcon, HeartIcon, MoonIcon, SparklesIcon } from '../components/icons';
import BentoQuadrant from '../components/ui-premium/BentoQuadrant';
import PremiumBadge from '../components/ui-premium/PremiumBadge';
import PremiumButton from '../components/ui-premium/PremiumButton';
import IconButton from '../components/ui-premium/IconButton';
import PremiumInput from '../components/ui-premium/PremiumInput';
import SearchBar from '../components/ui-premium/SearchBar';
import PremiumModal from '../components/ui-premium/PremiumModal';
import PremiumStepper from '../components/ui-premium/PremiumStepper';
import SegmentedTabs from '../components/ui-premium/SegmentedTabs';
import SquishyCard from '../components/ui-premium/SquishyCard';
import SmartRestTimer from '../components/ui-premium/SmartRestTimer';
import ImageUploadArea from '../components/ui-premium/ImageUploadArea';
import MasterNutritionDashboard from '../components/ui-premium/MasterNutritionDashboard';
import { MealLogCard, DailyLogMeal } from '../components/nutricion/MealLogCard';
import RecipeCard, { Recipe } from '../components/ui-premium/RecipeCard';
import RoutineCard, { WorkoutRoutine } from '../components/ui-premium/RoutineCard';
import NonNegotiableCard from '../components/ui-premium/NonNegotiableCard';
import WeeklyStreakTracker, { DailyStreak } from '../components/ui-premium/WeeklyStreakTracker';
import PremiumFilterTab from '../components/ui-premium/PremiumFilterTab';
import IngredientListItem from '../components/ui-premium/IngredientListItem';
import type { IngredientEditableData } from '../components/ui-premium/IngredientListItem';
import IngredientEditModal from '../components/ui-premium/IngredientEditModal';
import {
  EyebrowText,
  ModalTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  MutedText,
  StatLabel,
  StatValue,
  MonoValue,
  GiantValue,
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

const mockMealWithImage: DailyLogMeal = {
  id: 'meal-1',
  title: 'Bowl de pollo con arroz jazmín',
  time: '14:30 PM',
  totalKcal: 520,
  totalMacros: { p: 42, c: 48, f: 16 },
  isCustom: false,
  imageUrl: '/assets/recipes/bowl-pollo.png',
  ingredients: [
    { id: '1', name: 'Pechuga de pollo', amount: 150, unit: 'g', kcal: 247, macros: { p: 46, c: 0, f: 5 } },
    { id: '2', name: 'Arroz jazmín cocido', amount: 120, unit: 'g', kcal: 156, macros: { p: 3, c: 35, f: 0 } },
    { id: '3', name: 'Aguacate', amount: 50, unit: 'g', kcal: 80, macros: { p: 1, c: 4, f: 7 } },
    { id: '4', name: 'Brócoli al vapor', amount: 100, unit: 'g', kcal: 35, macros: { p: 2, c: 7, f: 0 } },
  ],
};

const mockBowlRecipe: Recipe = {
  title: 'Bowl de pollo con arroz jazmín',
  description: 'Proteína magra, carbohidratos de índice glucémico medio y grasas saludables del aguacate.',
  imageUrl: '/assets/recipes/bowl-pollo.png',
  category: 'POST-ENTRENO',
  portions: 2,
  prepTimeMin: 25,
  totals: { kcal: 520, macros: { protein: 42, carbs: 48, fat: 16 } },
};

const mockOatsRecipe: Recipe = {
  title: 'Overnight oats de cacao',
  description: 'Variante compacta con alto nivel de fibra y proteína. Ideal para comenzar el día.',
  imageUrl: '/assets/recipes/oats-cacao.png',
  category: 'DESAYUNO',
  isFavorite: true,
  portions: 1,
  prepTimeMin: 10,
  totals: { kcal: 410, macros: { protein: 28, carbs: 39, fat: 11 } },
};

const mockUpperRoutine: WorkoutRoutine = {
  title: 'Upper Strength / Semana 4',
  description: 'Sesión de fuerza de torso superior con énfasis en press y remo. Incluye activación escapular y core anti-rotacional.',
  imageUrl: '/assets/routines/upper-strength-bg.webp',
  focus: 'Fuerza',
  estimatedTimeMin: 45,
  exerciseCount: 4,
};

const mockCustomMeal: DailyLogMeal = {
  id: 'meal-2',
  title: 'Snack Post-Entreno',
  time: '18:15 PM',
  totalKcal: 310,
  totalMacros: { p: 45, c: 20, f: 5 },
  isCustom: true,
  ingredients: [
    { id: '1', name: 'Whey Protein Isolate', amount: 1.5, unit: 'scoop (45g)', kcal: 180, macros: { p: 38, c: 3, f: 1 } },
    { id: '2', name: 'Leche de almendras sin azúcar', amount: 250, unit: 'ml', kcal: 30, macros: { p: 1, c: 0, f: 2 } },
    { id: '3', name: 'Plátano mediano', amount: 1, unit: 'Pieza (120g)', kcal: 100, macros: { p: 1, c: 25, f: 0 } },
  ],
};

const mockWeeklyStreak: DailyStreak[] = [
  { date: '2026-03-26', dayInitial: 'L', dayNumber: 26, isToday: false, status: 'completed' },
  { date: '2026-03-27', dayInitial: 'M', dayNumber: 27, isToday: false, status: 'completed' },
  { date: '2026-03-28', dayInitial: 'M', dayNumber: 28, isToday: false, status: 'completed' },
  { date: '2026-03-29', dayInitial: 'J', dayNumber: 29, isToday: false, status: 'failed' },
  { date: '2026-03-30', dayInitial: 'V', dayNumber: 30, isToday: false, status: 'completed' },
  { date: '2026-03-31', dayInitial: 'S', dayNumber: 31, isToday: false, status: 'completed' },
  { date: '2026-04-01', dayInitial: 'D', dayNumber: 1, isToday: true, status: 'pending' },
];

const DesignSystemDevScreen: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRuckingFormOpen, setIsRuckingFormOpen] = useState(false);
  const [stepperValue, setStepperValue] = useState(80);
  const [selectedSegment, setSelectedSegment] = useState<string | number>(1);
  const [searchValue, setSearchValue] = useState('Upper strength');
  const [stepsValue, setStepsValue] = useState(6800);
  const [sleepValue, setSleepValue] = useState(6.5);
  const [activeFilter, setActiveFilter] = useState('all');
  const [addedIngredients, setAddedIngredients] = useState<Record<string, number>>({ chicken: 1.5, quinoa: 1 });
  const [editingIngId, setEditingIngId] = useState<string | null>(null);
  const [ingredientsData, setIngredientsData] = useState<Record<string, IngredientEditableData>>({
    chicken: {
      name: 'Pechuga de Pollo (Sin Piel)',
      brand: 'Genérico',
      standardPortion: '100g Crudo (~75g Cocido)',
      rawWeightG: 100,
      cookedWeightG: 75,
      macros: { kcal: 110, protein: 23, carbs: 0, fat: 1.5 },
    },
    rice: {
      name: 'Arroz Blanco (Vapor)',
      brand: 'Genérico',
      standardPortion: '100g (Peso Cocido)',
      rawWeightG: 33,
      cookedWeightG: 100,
      macros: { kcal: 130, protein: 2.5, carbs: 28, fat: 0.3 },
    },
    quinoa: {
      name: 'Quinoa',
      brand: "Member's Mark",
      standardPortion: '50g Crudo (~150g Cocido)',
      rawWeightG: 50,
      cookedWeightG: 150,
      macros: { kcal: 183, protein: 7, carbs: 32, fat: 3 },
    },
    pork: {
      name: 'Lomo de Cerdo',
      brand: 'Genérico',
      standardPortion: '100g Crudo (~75g Cocido)',
      rawWeightG: 100,
      cookedWeightG: 75,
      macros: { kcal: 125, protein: 22, carbs: 0, fat: 3.5 },
    },
  });

  const handleIngredientAdd = (id: string) =>
    setAddedIngredients((prev) => ({ ...prev, [id]: 1 }));
  const handleIngredientQty = (id: string, delta: number) =>
    setAddedIngredients((prev) => ({
      ...prev,
      [id]: Math.max(0.25, parseFloat(((prev[id] ?? 1) + delta).toFixed(2))),
    }));
  const handleIngredientSave = (updated: IngredientEditableData) => {
    if (!editingIngId) return;
    setIngredientsData((prev) => ({ ...prev, [editingIngId]: updated }));
    setEditingIngId(null);
  };

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
            <SectionTitle>Colores Semánticos</SectionTitle>
            <MutedText>Paleta cromática canónica del sistema. Cada token tiene un rol semántico único e irremplazable.</MutedText>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Fondo Base', bg: 'bg-zinc-950' },
              { label: 'Cristal', bg: 'bg-zinc-900/80' },
              { label: 'Éxito / Ideal', bg: 'bg-emerald-400' },
              { label: 'Proteína', bg: 'bg-violet-500' },
              { label: 'Cardio / Carbos', bg: 'bg-cyan-400' },
              { label: 'Fuerza / Grasas', bg: 'bg-orange-500' },
              { label: 'Advertencia', bg: 'bg-amber-400' },
              { label: 'Límite', bg: 'bg-rose-500' },
            ].map(({ label, bg }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={['w-16 h-16 rounded-2xl border border-white/5', bg].join(' ')} />
                <MutedText>{label}</MutedText>
              </div>
            ))}
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

          <div className="grid gap-4 md:grid-cols-2">
            <SquishyCard padding="md" className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>primary / isLoading</CardTitle>
                <MutedText>Estado asíncrono</MutedText>
              </div>
              <PremiumButton variant="primary" size="lg" isLoading>
                Guardando
              </PremiumButton>
            </SquishyCard>

            <SquishyCard padding="md" className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle>danger / md</CardTitle>
                <MutedText>Acción destructiva</MutedText>
              </div>
              <PremiumButton variant="danger" size="md" onClick={() => console.log('Danger')}>
                Eliminar registro
              </PremiumButton>
            </SquishyCard>
          </div>

          <SquishyCard padding="md" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>IconButton</CardTitle>
              <MutedText>Íconos interactivos SSOT — ghost, danger, primary × sm/md/lg.</MutedText>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <IconButton icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>} variant="ghost" size="sm" onClick={() => console.log('ghost sm')} />
              <IconButton icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>} variant="ghost" size="md" onClick={() => console.log('ghost md')} />
              <IconButton icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>} variant="ghost" size="lg" onClick={() => console.log('ghost lg')} />
              <div className="w-px h-6 bg-white/10" />
              <IconButton icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>} variant="danger" size="sm" onClick={() => console.log('danger sm')} />
              <IconButton icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>} variant="danger" size="md" onClick={() => console.log('danger md')} />
              <div className="w-px h-6 bg-white/10" />
              <IconButton icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>} variant="primary" size="sm" onClick={() => console.log('primary sm')} />
              <IconButton icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>} variant="primary" size="md" onClick={() => console.log('primary md')} />
            </div>
          </SquishyCard>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Tarjetas</SectionTitle>
            <MutedText>Densidad, padding, estado activo y affordance interactivo.</MutedText>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SquishyCard padding="sm" className="flex flex-col gap-3">
              <EyebrowText>padding sm (p-4) — estática</EyebrowText>
              <CardTitle>Tarjeta compacta</CardTitle>
              <BodyText>Densidad alta para listas o bento de datos secundarios.</BodyText>
              <StatValue>84%</StatValue>
            </SquishyCard>

            <SquishyCard padding="lg" className="flex flex-col gap-4">
              <EyebrowText>padding lg (p-8) — estática</EyebrowText>
              <CardTitle>Tarjeta amplia</CardTitle>
              <BodyText>Mayor respiración interna para layouts hero o módulos premium.</BodyText>
              <MonoValue>cal / week / 12,480</MonoValue>
            </SquishyCard>

            <SquishyCard
              padding="md"
              interactive
              onClick={() => console.log('Click')}
              className="flex flex-col gap-3"
            >
              <EyebrowText>interactive — escala al presionar</EyebrowText>
              <CardTitle>Estado presionable</CardTitle>
              <BodyText>Presiona para sentir la física táctil: scale-[0.98] + brightness.</BodyText>
              <MutedText>active:scale-[0.98] hover:brightness-[1.08]</MutedText>
            </SquishyCard>

            <SquishyCard
              padding="md"
              active
              className="flex flex-col gap-3"
            >
              <EyebrowText>active — selección activa</EyebrowText>
              <CardTitle>Estado seleccionado</CardTitle>
              <BodyText>Ring esmeralda visible cuando la tarjeta es la opción activa del sistema.</BodyText>
              <MutedText>ring-1 ring-emerald-400/50 border-emerald-400/50</MutedText>
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
            <SectionTitle>Cronómetro Inteligente (Modo Foco)</SectionTitle>
            <MutedText>Widget de descanso activo con fases dinámicas y controles de acción rápida.</MutedText>
          </div>
          <SmartRestTimer targetTime={120} minimumTime={90} />
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Menú de Actividades</SectionTitle>
            <MutedText>Selección de actividad estilo Bento. Cada tarjeta abre su formulario de registro.</MutedText>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-[380px] mx-auto w-full">
            <SquishyCard interactive padding="md" className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="5" r="1.5" />
                <path d="M8 17l1.5-5 2.5 2 2.5-4L16 17" />
                <path d="M7 12l1-3 4 1 3-3" />
              </svg>
              <CardTitle>Carrera</CardTitle>
              <MutedText className="text-center">Ritmo y km</MutedText>
            </SquishyCard>

            <SquishyCard interactive padding="md" className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 20l4-8 4 4 4-10 4 14" />
                <path d="M3 20h18" />
              </svg>
              <CardTitle>Senderismo</CardTitle>
              <MutedText className="text-center">Ruta y elevación</MutedText>
            </SquishyCard>

            <SquishyCard
              interactive
              padding="md"
              className="flex flex-col items-center gap-3 col-span-2"
              onClick={() => setIsRuckingFormOpen(true)}
            >
              <svg className="w-8 h-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M12 11v6M9 14h6" />
              </svg>
              <CardTitle>Rucking</CardTitle>
              <MutedText className="text-center">Carga, ritmo y elevación</MutedText>
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

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Tarjetas y Layouts Complejos (Hoy / Biblioteca)</SectionTitle>
            <MutedText>Bloques estructurales premium para dashboards de hoy, listados y bibliotecas ricas.</MutedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecipeCard
              recipe={mockBowlRecipe}
              onQuickAdd={() => console.log('Quick add bowl')}
              onClick={() => console.log('Open bowl')}
            />
            <RoutineCard
              routine={mockUpperRoutine}
              onView={() => console.log('View routine')}
            />
            <RecipeCard
              recipe={mockOatsRecipe}
              onQuickAdd={() => console.log('Quick add oats')}
              onClick={() => console.log('Open oats')}
            />
          </div>

          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Buscar receta o rutina..."
          />
        </section>

        {/* ── Dashboard Maestro de Nutrición ─────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Dashboard Maestro de Nutrición</SectionTitle>
            <MutedText>
              Escenario Peligro: 250g carbos (excediendo ideal + al límite), 30g grasas
              (bajo el mínimo vital 55g). Carbos → ámbar. Grasas → rose + glow. Ring → ámbar (97%).
            </MutedText>
          </div>

          <MasterNutritionDashboard
            target={{
              kcal: 2200,
              protein: 150,
              carbMin: 150,
              carbIdeal: 220,
              carbMax: 250,
              fatMin: 55,
              fatIdeal: 80,
              fatMax: 100,
            }}
            consumed={{
              kcal: 2150,
              protein: 140,
              carbs: 250,
              fat: 30,
            }}
          />
        </section>

        {/* ── Historial de Consumo ─────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Historial de Consumo</SectionTitle>
            <MutedText>
              Tarjetas premium de registro de comida con físicas de acordeón, placeholder inteligente y tabla de ingredientes tabular.
            </MutedText>
          </div>

          <div className="flex flex-col gap-4">
            <MealLogCard meal={mockMealWithImage} />
            <MealLogCard meal={mockCustomMeal} />
          </div>
        </section>

        {/* ── Dashboard de Innegociables ────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Dashboard de Innegociables</SectionTitle>
            <MutedText>
              Grid de métricas diarias críticas. Las automáticas se actualizan desde nutrición.
              Las manuales abren modo input al tocar.
            </MutedText>
          </div>

          <WeeklyStreakTracker days={mockWeeklyStreak} />

          <div className="grid grid-cols-2 gap-4">
            {/* Automática: Proteína */}
            <NonNegotiableCard
              metric={{
                id: 'protein',
                label: 'Proteína',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                ),
                currentValue: 148,
                targetValue: 175,
                unit: 'g',
                isAutomated: true,
                toleranceThreshold: 0.9,
              }}
            />
            {/* Automática: Calorías */}
            <NonNegotiableCard
              metric={{
                id: 'calories',
                label: 'Calorías',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                  </svg>
                ),
                currentValue: 2150,
                targetValue: 2400,
                unit: 'kcal',
                isAutomated: true,
                toleranceThreshold: 0.85,
              }}
            />
            {/* Manual: Pasos */}
            <NonNegotiableCard
              metric={{
                id: 'steps',
                label: 'Pasos',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M13 4h3a2 2 0 0 1 2 2v14" />
                    <path d="M4 17v-6a2 2 0 0 1 2-2h7" />
                    <polyline points="9 11 9 17 17 17" />
                  </svg>
                ),
                currentValue: stepsValue,
                targetValue: 10000,
                unit: 'p',
                isAutomated: false,
                toleranceThreshold: 0.8,
              }}
              onValueChange={(_, v) => setStepsValue(v)}
            />
            {/* Manual: Sueño */}
            <NonNegotiableCard
              metric={{
                id: 'sleep',
                label: 'Sueño',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ),
                currentValue: sleepValue,
                targetValue: 8,
                unit: 'h',
                isAutomated: false,
                toleranceThreshold: 0.875,
              }}
              onValueChange={(_, v) => setSleepValue(v)}
            />
          </div>
        </section>

        {/* ── Biblioteca de Ingredientes ──────────────────────────────── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <SectionTitle>Biblioteca de Ingredientes</SectionTitle>
            <MutedText>
              Filtros tipo píldora y tarjetas de ingredientes con stepper premium y equivalencias de cocción.
            </MutedText>
          </div>

          {/* PremiumFilterTab row */}
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'all',      label: 'Todo',      count: 143 },
              { id: 'protein',  label: 'Proteína',  count: 38  },
              { id: 'carbs',    label: 'Carbohidratos', count: 51 },
              { id: 'fat',      label: 'Grasas',    count: 22  },
              { id: 'veggie',   label: 'Verduras',  count: 32  },
            ] as const).map((f) => (
              <PremiumFilterTab
                key={f.id}
                id={f.id}
                label={f.label}
                count={f.count}
                isActive={activeFilter === f.id}
                onClick={setActiveFilter}
              />
            ))}
          </div>

          {/* IngredientListItem — 4 variantes con datos reales de la DB */}
          <div className="flex flex-col gap-3">
            {/* 1. Pechuga: crudo+cocido, stepper fraccionario activo */}
            <IngredientListItem
              {...ingredientsData['chicken']}
              isAddedToPlate={!!addedIngredients['chicken']}
              quantityMultiplier={addedIngredients['chicken'] ?? 1}
              onAdd={() => handleIngredientAdd('chicken')}
              onUpdateQuantity={(d) => handleIngredientQty('chicken', d)}
              onEdit={() => setEditingIngId('chicken')}
            />
            {/* 2. Arroz Blanco: crudo 33g → cocido 100g, no agregado */}
            <IngredientListItem
              {...ingredientsData['rice']}
              isAddedToPlate={!!addedIngredients['rice']}
              quantityMultiplier={addedIngredients['rice'] ?? 1}
              onAdd={() => handleIngredientAdd('rice')}
              onUpdateQuantity={(d) => handleIngredientQty('rice', d)}
              onEdit={() => setEditingIngId('rice')}
            />
            {/* 3. Quinoa: crudo 50g → cocido 150g, stepper activo */}
            <IngredientListItem
              {...ingredientsData['quinoa']}
              isAddedToPlate={!!addedIngredients['quinoa']}
              quantityMultiplier={addedIngredients['quinoa'] ?? 1}
              onAdd={() => handleIngredientAdd('quinoa')}
              onUpdateQuantity={(d) => handleIngredientQty('quinoa', d)}
              onEdit={() => setEditingIngId('quinoa')}
            />
            {/* 4. Lomo de Cerdo: sin imagen → fallback inicial */}
            <IngredientListItem
              {...ingredientsData['pork']}
              isAddedToPlate={!!addedIngredients['pork']}
              quantityMultiplier={addedIngredients['pork'] ?? 1}
              onAdd={() => handleIngredientAdd('pork')}
              onUpdateQuantity={(d) => handleIngredientQty('pork', d)}
              onEdit={() => setEditingIngId('pork')}
            />
          </div>

          {/* Edit modal */}
          {editingIngId && ingredientsData[editingIngId] && (
            <IngredientEditModal
              item={ingredientsData[editingIngId]}
              onSave={handleIngredientSave}
              onClose={() => setEditingIngId(null)}
            />
          )}
        </section>

      </div>

      {isRuckingFormOpen && (
        <PremiumModal
          onClose={() => setIsRuckingFormOpen(false)}
          onPrimary={() => setIsRuckingFormOpen(false)}
          eyebrow="Actividad de Carga"
          title="Registrar Rucking"
          primaryLabel="GUARDAR RUCKING"
        >
          <PremiumButton
            variant="ghost"
            size="sm"
            leftIcon={<SparklesIcon className="w-4 h-4" />}
            className="w-full border border-cyan-400/20 text-cyan-400"
          >
            Leer resumen con IA
          </PremiumButton>

          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Distancia"
              type="number"
              placeholder="0.0"
              rightElement="km"
            />
            <PremiumInput
              label="Duración"
              type="number"
              placeholder="0"
              rightElement="min"
            />
          </div>

          <SquishyCard padding="md" className="flex flex-col items-center justify-center text-center gap-2">
            <EyebrowText>RITMO PROMEDIO</EyebrowText>
            <GiantValue>
              0&apos;00&quot;<span className="text-xl text-zinc-500">/km</span>
            </GiantValue>
          </SquishyCard>

          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Kcal"
              type="number"
              placeholder="0"
              rightElement="kcal"
            />
            <PremiumInput
              label="PPM máx."
              type="number"
              placeholder="0"
              rightElement="ppm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PremiumInput
              label="Elevación"
              type="number"
              placeholder="0"
              rightElement="m"
            />
            <PremiumInput
              label="Peso extra"
              type="number"
              placeholder="0"
              rightElement="kg"
            />
          </div>

          <ImageUploadArea />

          <PremiumInput
            label="Notas"
            multiline
            rows={4}
            placeholder="¿Cómo fue la sesión? Terreno, sensaciones, equipamiento..."
          />
        </PremiumModal>
      )}

      {isModalOpen && (
        <PremiumModal
          onClose={() => setIsModalOpen(false)}
          onPrimary={() => setIsModalOpen(false)}
          eyebrow="Ejercicio Compuesto"
          title="Peso Muerto Rumano"
          primaryLabel="Entendido"
          headerMedia={
            <img src="/assets/ui/modal-pulse.svg" alt="Pulse" className="absolute inset-0 w-full h-full object-cover" />
          }
        >
          <EyebrowText className="text-emerald-400 mb-2">MÚSCULOS IMPLICADOS</EyebrowText>
          <div className="flex flex-wrap gap-2">
            {['Isquiotibiales', 'Glúteo Mayor', 'Erectores Espinales'].map((m) => (
              <span
                key={m}
                className="px-3 py-1 rounded-full border border-zinc-700/50 bg-zinc-800/50"
              >
                <StatLabel>{m}</StatLabel>
              </span>
            ))}
          </div>

          <SectionTitle className="mt-8 mb-4">Técnica de Ejecución</SectionTitle>
          <div className="flex flex-col gap-5">
            {[
              { n: 1, text: 'Posición Inicial: De pie, con los pies a la anchura de las caderas. Sostén la barra con agarre prono frente a tus muslos.' },
              { n: 2, text: 'Rodillas: Mantén una flexión muy ligera en las rodillas durante todo el movimiento.' },
              { n: 3, text: 'El Descenso: Empuja las caderas hacia atrás, como si quisieras tocar una pared con los glúteos.' },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-start gap-4">
                <StatValue className="text-zinc-700 flex-shrink-0 w-6 text-center">{n}</StatValue>
                <BodyText>{text}</BodyText>
              </div>
            ))}
          </div>

          <SectionTitle className="mt-8 mb-4">Puntos Clave</SectionTitle>
          <div className="flex flex-col gap-3">
            <BodyText>• La barra debe deslizarse pegada a tus muslos durante todo el recorrido.</BodyText>
            <BodyText>• La espalda recta es innegociable: activa los erectores antes de iniciar el descenso.</BodyText>
          </div>
        </PremiumModal>
      )}
    </div>
  );
};

export default DesignSystemDevScreen;
