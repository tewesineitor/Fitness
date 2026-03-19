import { Achievement } from './types';
import { TrophyIcon, ArchitectIcon, IronWeekIcon, ProteinChefIcon, RookieRunnerIcon, SereneMindIcon, NutritionMasterIcon } from './components/icons';

export const achievementsData: Record<string, Achievement> = {
  'beginner-architect': {
    id: 'beginner-architect',
    title: 'Arquitecto Principiante',
    description: 'Completa tu primera rutina de cualquier tipo.',
    icon: ArchitectIcon,
  },
  'iron-week': {
    id: 'iron-week',
    title: 'Semana de Hierro',
    description: 'Completa todas las tareas asignadas de una semana completa (7 días).',
    icon: IronWeekIcon,
  },
  'protein-chef': {
    id: 'protein-chef',
    title: 'Chef Proteico',
    description: 'Crea y guarda tu primera receta personalizada.',
    icon: ProteinChefIcon,
  },
  'rookie-runner': {
    id: 'rookie-runner',
    title: 'Corredor Novato',
    description: 'Completa la Semana 1 del plan de Cardio Progresivo.',
    icon: RookieRunnerIcon,
  },
  'serene-mind': {
    id: 'serene-mind',
    title: 'Mente Serena',
    description: 'Completa 5 sesiones de Meditación Guiada.',
    icon: SereneMindIcon,
  },
  'steel-consistency': {
    id: 'steel-consistency',
    title: 'Constancia de Acero',
    description: 'Completa 4 semanas seguidas del plan.',
    icon: TrophyIcon,
  },
  'nutrition-master': {
    id: 'nutrition-master',
    title: 'Maestro de la Nutrición',
    description: 'Cumple tus tres metas de macronutrientes (+/- 10g) durante 3 días seguidos.',
    icon: NutritionMasterIcon,
  },
};