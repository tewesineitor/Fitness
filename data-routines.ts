
import { RoutineTask } from './types';

const warmupTorsoFlow = [
  {
    type: 'warmup' as const,
    title: "Calentamiento: Torso",
    subtitle: "Prepara la parte superior de tu cuerpo para el entrenamiento.",
    items: [
      { exerciseId: 'trote-ligero', reps: '3-5 min' },
      { exerciseId: 'circulos-brazos', reps: '10 por dirección' },
      { exerciseId: 'postura-gato-vaca', reps: '15 repeticiones' },
      { exerciseId: 'rotacion-toracica-cuadrupedia', reps: '10 por lado' },
      { exerciseId: 'elevaciones-ytwl', reps: '10 de cada letra' },
    ]
  }
];

const warmupPiernaFlow = [
  {
    type: 'warmup' as const,
    title: "Calentamiento: Pierna",
    subtitle: "Prepara la parte inferior de tu cuerpo y el core.",
    items: [
      { exerciseId: 'trote-ligero', reps: '3-5 min' },
      { exerciseId: 'circulos-tobillo', reps: '10 por dirección/pie' },
      { exerciseId: 'balanceos-piernas', reps: '10 por dirección/pierna' },
      { exerciseId: 'inclinacion-pelvica', reps: '15 repeticiones' },
      { exerciseId: 'puente-gluteos', reps: '15 repeticiones (pausa 2s)' }
    ]
  }
];

const cooldownFlow = [
  {
    type: 'cooldown' as const,
    title: "Estiramientos Post-Entreno",
    subtitle: "Mantén cada estiramiento por 30 segundos por lado para mejorar la recuperación y la flexibilidad.",
    items: [
      { exerciseId: 'estiramiento-pectorales-puerta' },
      { exerciseId: 'estiramiento-dorsal-nino' },
      { exerciseId: 'estiramiento-cuadriceps-pie' },
      { exerciseId: 'estiramiento-isquios-sentado' },
      { exerciseId: 'estiramiento-piriforme' }
    ]
  }
];

const warmupTorsoEspecificoFlow = [
  {
    type: 'warmup' as const,
    title: "Calentamiento: Torso (R.A.M.P.)",
    subtitle: "Raise, Activate, Mobilize, Potentiate.",
    items: [
      { exerciseId: 'saltos-tijera', reps: '2 minutos' },
      { exerciseId: 'pull-aparts-banda', reps: '15 repeticiones' },
      { exerciseId: 'plancha-core', reps: '2 x 15 segundos' },
      { exerciseId: 'dislocaciones-hombro-banda', reps: '10 repeticiones' },
      { exerciseId: 'press-banca-mancuernas', reps: '1x8 (50%), 1x4 (70%), 1x2 (85%)', title: 'Series de Aproximación' },
    ]
  }
];


const warmupPiernaRampFlow = [
  {
    type: 'warmup' as const,
    title: "Calentamiento: Pierna (R.A.M.P.)",
    subtitle: "Raise, Activate, Mobilize, Potentiate.",
    items: [
      { exerciseId: 'desplazamientos-laterales', reps: '2 minutos' },
      { exerciseId: 'puente-gluteos-suelo', reps: '15 reps (1s pausa)' },
      { exerciseId: 'monster-walks', reps: '10 por pierna' },
      { exerciseId: 'worlds-greatest-stretch', reps: '5 por lado' },
      { exerciseId: 'dorsiflexion-dinamica', reps: '10 reps' },
      { exerciseId: 'peso-muerto-rumano', reps: '1x8 (50%), 1x4 (70%), 1x2 (85%)', title: 'Series de Aproximación' },
    ]
  }
];

export const defaultRoutines: RoutineTask[] = [
  {
    id: 'torso-a-fuerza-control',
    name: "Día 1: Torso A (Fuerza y Control)",
    timeOfDay: 'Mañana',
    type: 'strength',
    technicalFocus: "Pausa Isométrica (1-3s) en máxima contracción",
    isUserCreated: false,
    flow: [
        ...warmupTorsoEspecificoFlow,
        { type: 'exercise', title: 'Press Banca con Mancuernas', exerciseId: 'press-banca-mancuernas', sets: 3, reps: '8-10', rir: '1-2', rest: 120, restMax: 180 },
        { type: 'exercise', title: 'Remo Unilateral con Mancuerna', exerciseId: 'remo-mancuerna-una-mano', sets: 4, reps: '10-12', rir: '1-2', rest: 120, restMax: 180 },
        { type: 'exercise', title: 'Jalón Dorsal con Banda', exerciseId: 'jalon-dorsal-banda', sets: 4, reps: '15-20', rir: '1-2', rest: 90 },
        { type: 'exercise', title: 'Press Militar Sentado', exerciseId: 'press-militar-sentado-mancuernas', sets: 3, reps: '8-12', rir: '2', rest: 90 },
        { type: 'exercise', title: 'Skullcrushers (Rompecráneos)', exerciseId: 'press-frances', sets: 3, reps: '10-15', rir: '1-2', rest: 60 }
    ]
  },
  {
    id: 'pierna-a-cadena-posterior',
    name: "Día 2: Pierna A (Cadena Posterior y Estabilidad)",
    timeOfDay: 'Mañana',
    type: 'strength',
    technicalFocus: "Pausa Isométrica (1-3s) en máxima contracción",
    isUserCreated: false,
    flow: [
        ...warmupPiernaRampFlow,
        { type: 'exercise', title: 'Peso Muerto Rumano (RDL)', exerciseId: 'peso-muerto-rumano', sets: 3, reps: '8-12', rir: '1-2', rest: 150, restMax: 180 },
        { type: 'exercise', title: 'Sentadilla Búlgara', exerciseId: 'sentadilla-bulgara-mancuernas', sets: 3, reps: '8-10 (por pierna)', rir: '1-2', rest: 150, restMax: 180 },
        { type: 'exercise', title: 'Hip Thrust (Empuje de Cadera)', exerciseId: 'hip-thrust-banda-mancuerna', sets: 3, reps: '12-15', rir: '1-2', rest: 120 },
        { type: 'exercise', title: 'Elevación de Talones Unilateral', exerciseId: 'elevacion-talones-unilateral-mancuerna', sets: 4, reps: '15 (por pierna)', rir: 'Mod-Pesado', rest: 90, restMax: 120 },
        { type: 'exercise', title: 'Plancha Abdominal Isométrica', exerciseId: 'plancha-abdominal-isometrica', sets: 3, reps: '45-60 seg', rir: 'Fallo', rest: 60, restMax: 90 }
    ]
  },
  {
    id: 'torso-b-bombeo-postura',
    name: "Día 4: Torso B (Bombeo y Postura)",
    timeOfDay: 'Mañana',
    type: 'strength',
    technicalFocus: "Movimiento Fluido y Constante (Sin Pausas)",
    isUserCreated: false,
    flow: [
        ...warmupTorsoEspecificoFlow,
        { type: 'exercise', title: 'Press Inclinado con Mancuernas', exerciseId: 'press-inclinado-mancuernas', sets: 3, reps: '10-15', rir: '1-2', rest: 90, restMax: 120 },
        { type: 'exercise', title: 'Remo Pecho Apoyado', exerciseId: 'remo-pecho-apoyado-mancuernas', sets: 3, reps: '12-15', rir: '1-2', rest: 90 },
        { type: 'exercise', title: 'Flexiones (Push-ups) con Banda', exerciseId: 'flexiones-banda', sets: 3, reps: 'Fallo Técnico', rir: '0', rest: 90 },
        { type: 'exercise', title: 'Face Pull', exerciseId: 'face-pull-banda', sets: 4, reps: '15-20', rir: '0-1', rest: 60 },
        { type: 'exercise', title: 'Elevaciones Laterales', exerciseId: 'elevaciones-laterales-mancuernas', sets: 4, reps: '15-20', rir: '0-1', rest: 60 },
        { type: 'exercise', title: 'Curl de Bíceps Inclinado', exerciseId: 'curl-biceps-inclinado-mancuernas', sets: 3, reps: '12-15', rir: '0-1', rest: 60, restMax: 90 }
    ]
  },
  {
    id: 'pierna-b-volumen-cuadriceps',
    name: "Día 5: Pierna B (Volumen y Cuádriceps)",
    timeOfDay: 'Mañana',
    type: 'strength',
    technicalFocus: "Movimiento Fluido y Constante (Sin Pausas)",
    isUserCreated: false,
    flow: [
        ...warmupPiernaRampFlow,
        { type: 'exercise', title: 'Sentadilla Goblet', exerciseId: 'sentadilla-goblet-pesada', sets: 4, reps: '15-20', rir: 'Pesado', rest: 90, restMax: 120 },
        { type: 'exercise', title: 'Zancadas Reversas (Lunges)', exerciseId: 'zancadas-reversas-mancuernas', sets: 3, reps: '12-15 (por pierna)', rir: '1-2', rest: 90, restMax: 120 },
        { type: 'exercise', title: 'Buenos Días con Banda', exerciseId: 'buenos-dias-banda', sets: 3, reps: '15-20', rir: '1-2', rest: 90 },
        { type: 'exercise', title: 'Gemelo Sentado (Enfoque Sóleo)', exerciseId: 'gemelo-sentado-mancuernas', sets: 4, reps: '20-30', rir: 'Mod-Pesado', rest: 60 },
        { type: 'exercise', title: 'Dead Bug con Presión Constante', exerciseId: 'dead-bug-presion-constante', sets: 3, reps: '12-15 (por pierna)', rir: 'Tensión', rest: 60 }
    ]
  },
  {
    id: 'warmup-torso-especifico',
    name: "Calentamiento Torso (R.A.M.P.)",
    timeOfDay: 'Mañana',
    type: 'posture',
    isUserCreated: false,
    flow: warmupTorsoEspecificoFlow
  },
  {
    id: 'warmup-pierna-ramp',
    name: "Calentamiento Pierna (R.A.M.P.)",
    timeOfDay: 'Mañana',
    type: 'posture',
    isUserCreated: false,
    flow: warmupPiernaRampFlow
  },
  {
    id: 'default-cooldown',
    name: "Enfriamiento y Flexibilidad",
    timeOfDay: 'Noche',
    type: 'yoga',
    isUserCreated: false,
    flow: cooldownFlow
  }
];
