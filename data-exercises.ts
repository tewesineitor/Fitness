
import { Exercise } from './types';

export const exercises: Record<string, Exercise> = {
  'press-banca-barra': {
    id: 'press-banca-barra',
    name: 'Press de Banca con Barra',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Deltoides (Cabeza Anterior), Tríceps Braquial

**Técnica:**
1. Acuéstese en el banco plano con los pies firmes en el suelo.
2. Agarre la barra con las manos un poco más anchas que los hombros.
3. Baje la barra de forma controlada hasta tocar la parte media-baja del pecho.
4. Empuje la barra hacia arriba de forma explosiva hasta la extensión completa de los codos.

**Puntos Clave:**
- Mantenga los omóplatos retraídos y juntos ("sacando pecho").
- Los codos deben estar a unos 45-75 grados del torso, no a 90 grados.
- Mantenga los glúteos en contacto con el banco.
- Use las piernas para empujar el cuerpo hacia atrás en el banco ('leg drive') para mayor estabilidad y fuerza.

**Progresiones:**
**Principiante:** Empezar solo con la barra para dominar la técnica.
**Intermedio:** Aumentar el peso progresivamente. Probar pausas en el pecho.`
  },
  'extension-triceps-polea': {
    id: 'extension-triceps-polea',
    name: 'Extensión de Tríceps en Polea',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial (Cabeza Lateral y Medial)

**Técnica:**
1. De pie frente a una máquina de poleas, agarre la barra recta o cuerda con las palmas hacia abajo.
2. Mantenga los codos pegados a los costados del cuerpo.
3. Extienda los codos empujando hacia abajo hasta que los brazos estén completamente rectos.
4. Baje controladamente volviendo a la posición inicial (codos a 90 grados o un poco más).

**Puntos Clave:**
- Evite mover los hombros o usar el impulso del cuerpo.
- Mantenga la espalda recta y el core activado.
- Para BFR (Restricción de Flujo Sanguíneo): Use cargas ligeras (20-30% 1RM) y descansos cortos estrictos.

**Progresiones:**
**Principiante:** Usar peso ligero para aislar el tríceps.
**Intermedio:** Aumentar peso o usar técnica BFR para hipertrofia metabólica.`
  },
  'press-inclinado-mancuernas': {
    id: 'press-inclinado-mancuernas',
    name: 'Press Inclinado con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor (Porción Clavicular), Deltoides (Cabeza Anterior), Tríceps Braquial

**Técnica:**
1. Ajuste el banco a una inclinación de 30-45 grados.
2. Siéntese con una mancuerna en cada rodilla y úselas para impulsarse hacia atrás mientras se acuesta.
3. Baje las mancuernas a los lados del pecho superior con los codos ligeramente metidos.
4. Empuje hacia arriba y ligeramente hacia adentro hasta que las mancuernas casi se toquen.

**Puntos Clave:**
- El rango de movimiento es mayor que con barra, lo que permite un mejor estiramiento.
- Ayuda a corregir desequilibrios de fuerza entre ambos lados.
- No deixe que las mancuernas choquen en la parte superior.

**Progresiones:**
**Principiante:** Usar un peso ligero para controlar el movimiento.
**Intermedio:** Aumentar el peso. Probar el press alterno (un brazo a la vez).`
  },
  'aperturas-mancuernas': {
    id: 'aperturas-mancuernas',
    name: 'Aperturas con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor (Porción Esternal), Deltoides (Cabeza Anterior)

**Técnica:**
1. Acuéstese en un banco plano con las mancuernas sobre el pecho, palmas enfrentadas y codos ligeramente flexionados.
2. Baje los brazos en un arco amplio hacia los lados hasta sentir un buen estiramiento en el pecho.
3. Invierta el movimiento, contrayendo el pecho para volver a la posición inicial.

**Puntos Clave:**
- Mantenga una ligera flexión constante en los codos; no los extienda ni los flexione durante el movimiento.
- El movimiento debe originarse en la articulación del hombro, no en los codos.

**Progresiones:**
**Principiante:** Usar peso muy ligero y enfocarse en el estiramiento y la contracción.
**Intermedio:** Aumentar el peso de forma conservadora. Realizar en banco inclinado para enfocar el pectoral superior.`
  },
  'pullover-mancuerna': {
    id: 'pullover-mancuerna',
    name: 'Pullover con Mancuerna',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Pectoral Mayor, Serrato Anterior, Tríceps Braquial

**Técnica:**
1. Acuéstese de forma transversal en el banco, apoyando solo la parte superior de la espalda.
2. Sujete una mancuerna por uno de sus extremos con ambas manos sobre el pecho.
3. Con los codos ligeramente flexionados, baje la mancuerna por detrás de la cabeza en un arco amplio.
4. Vuelva a la posición inicial tirando con los dorsales y el pecho.

**Puntos Clave:**
- Mantenga las caderas bajas para maximizar el estiramiento.
- Controle el movimiento en todo momento, especialmente en la fase de bajada.

**Progresiones:**
**Principiante:** Usar peso ligero y un rango de movimiento cómodo.
**Intermedio:** Aumentar el peso. Probar a mantener la contracción en la parte superior.`
  },
  'peso-muerto-convencional': {
    id: 'peso-muerto-convencional',
    name: 'Peso Muerto Convencional',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Isquiotibiales, Erectores Espinales, Dorsal Ancho, Trapecio, Core

**Técnica:**
1. Párese con los pies a la anchura de las caderas, con la barra sobre la mitad del pie.
2. Flexione las caderas y rodillas para agarrar la barra con un agarre prono o mixto.
3. Con la espalda recta y el pecho arriba, inicie el levantamiento empujando el suelo con las piernas.
4. Una vez que la barra pasa las rodillas, extienda las caderas hasta estar completamente erguido.
5. Baje de forma controlada invirtiendo el movimiento.

**Puntos Clave:**
- La espalda debe permanecer neutra durante todo el levantamiento.
- La barra debe viajar cerca del cuerpo en una línea vertical.
- El movimiento es una bisagra de cadera, no una sentadilla.
- Tire de la barra para eliminar la holgura ('pull the slack') antes de iniciar el levantamiento para mantener la tensión.

**Progresiones:**
**Principiante:** Aprender el movimiento con muy poco peso o solo la barra.
**Intermedio:** Aumentar progresivamente la carga.`
  },
  'peso-muerto-rumano': {
    id: 'peso-muerto-rumano',
    name: 'Peso Muerto Rumano (con Barra o Mancuernas)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Isquiotibiales, Glúteo Mayor, Erectores Espinales (Espalda Baja), Dorsal Ancho

**Técnica:**
1. Posición Inicial: De pie, con los pies a la anchura de las caderas. Sostén la barra con un agarre prono (palmas hacia ti) justo por fuera de tus piernas (o una mancuerna en cada mano).
2. Rodillas: Mantén una flexión muy ligera en las rodillas durante todo el movimiento; no deben estar completamente bloqueadas.
3. El Descenso: Inicia el movimiento empujando las caderas hacia atrás, como si quisieras tocar una pared detrás de ti con los glúteos. La espalda debe permanecer completamente recta y el cuello en posición neutra.
4. Recorrido: La barra (o mancuernas) debe deslizarse pegada a tus muslos y espinillas. Baja hasta que sientas un estiramiento profundo en los isquiotibiales, generalmente cuando la barra llega a la mitad de la espinilla.
5. El Ascenso: Invierte el movimiento empujando las caderas hacia adelante y contrayendo los glúteos con fuerza para volver a la posición inicial erguida.

**Puntos Clave:**
- El mantra es: "Las caderas van hacia atrás, no la espalda hacia abajo". Esto es una bisagra de cadera, no una flexión de columna.
- Mantén la espalda neutra en todo momento para proteger la zona lumbar. Si sientes dolor en la espalda baja, es probable que la estés curvando.
- La barra o las mancuernas deben permanecer en contacto (o muy cerca) de tus piernas durante todo el recorrido.
- El movimiento termina cuando sientes el máximo estiramiento en los isquiotibiales, no se trata de tocar el suelo.

**Progresiones:**
Principiante: Practicar el movimiento de bisagra de cadera sin peso, solo con un palo de PVC sobre la espalda. Luego, usar mancuernas muy ligeras.
Intermedio: Aumentar progresivamente el peso en la barra. Probar la variante a una sola pierna (Single Leg RDL) para un mayor desafío de estabilidad y fuerza unilateral.`
  },
  'remo-barra-pendlay': {
    id: 'remo-barra-pendlay',
    name: 'Remo con Barra (Pendlay Row)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Romboides, Trapecio (Fibras Medias e Inferiores), Deltoides (Cabeza Posterior), Bíceps Braquial

**Técnica:**
1. Incline el torso hasta que esté casi paralelo al suelo, con la barra en el suelo.
2. Agarre la barra con las manos un poco más anchas que los hombros.
3. Con la espalda recta, tire de la barra de forma explosiva hacia la parte baja del pecho/abdomen superior.
4. Baje la barra hasta que descanse completamente en el suelo antes de la siguiente repetición.

**Puntos Clave:**
- Cada repetición comienza desde peso muerto en el suelo.
- La espalda debe permanecer fija y paralela al suelo.
- El objetivo es mover el peso con la espalda, no con los brazos.

**Progresiones:**
**Principiante:** Empezar con peso ligero para dominar la posición de la espalda.
**Intermedio:** Aumentar la carga.`
  },
  'remo-mancuerna-una-mano': {
    id: 'remo-mancuerna-una-mano',
    name: 'Remo con Mancuerna a una Mano',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Romboides, Trapecio, Deltoides (Cabeza Posterior), Bíceps Braquial

**Técnica:**
1. Apoye una rodilla y la mano del mismo lado en un banco plano.
2. La otra pierna está en el suelo para dar estabilidad.
3. Con la espalda paralela al suelo, agarre una mancuerna con el brazo libre.
4. Tire de la mancuerna hacia la cadera, manteniendo el codo cerca del cuerpo.
5. Baje de forma controlada.

**Puntos Clave:**
- Permite un mayor rango de movimiento y una fuerte contracción del dorsal.
- Minimiza el estrés en la zona lumbar.
- Concéntrese en tirar con el codo, no con la mano.

**Progresiones:**
**Principiante:** Usar peso ligero y enfocarse en la retracción escapular.
**Intermedio:** Aumentar el peso. Probar diferentes ángulos de tracción.`
  },
  'press-militar-barra-pie': {
    id: 'press-militar-barra-pie',
    name: 'Press Militar con Barra (de pie)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Anterior), Deltoides (Cabeza Media), Tríceps Braquial, Trapecio (Fibras Superiores), Core

**Técnica:**
1. De pie, agarre la barra a una anchura ligeramente superior a la de los hombros y colóquela sobre la parte superior del pecho.
2. Con el core y los glúteos apretados, empuje la barra verticalmente por encima de la cabeza hasta la extensión completa de los codos.
3. Baje la barra de forma controlada a la posición inicial.

**Puntos Clave:**
- No arquear excesivamente la espalda baja.
- La cabeza debe moverse ligeramente hacia atrás para permitir el paso de la barra y luego volver a su posición neutra.
- Mantener los codos ligeramente por delante de la barra.

**Progresiones:**
**Principiante:** Empezar con la barra vacía.
**Intermedio:** Aumentar la carga.`
  },
  'elevaciones-laterales-mancuernas': {
    id: 'elevaciones-laterales-mancuernas',
    name: 'Elevaciones Laterales con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Media)

**Técnica:**
1. De pie o sentado, sostenga las mancuernas a los lados con las palmas hacia el cuerpo.
2. Con una ligera flexión en los codos, eleve los brazos hacia los lados hasta que estén paralelos al suelo.
3. Piense en "servir agua" al final del movimiento, con los pulgares ligeramente hacia abajo.
4. Baje de forma controlada.

**Puntos Clave:**
- Evite usar el impulso o encoger los trapecios.
- El movimiento debe ser controlado, especialmente en la bajada.
- El codo debe liderar el movimiento, no la muñeca.

**Progresiones:**
**Principiante:** Usar peso muy ligero. Realizar el movimiento de forma unilateral para mayor concentración.
**Intermedio:** Aumentar el peso. Probar series descendentes.`
  },
  'pajaros-mancuernas': {
    id: 'pajaros-mancuernas',
    name: '"Pájaros" con Mancuernas (Bent Over Raise)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Posterior), Romboides, Trapecio (Fibras Medias e Inferiores)

**Técnica:**
1. Posición Inicial: Sostén una mancuerna en cada mano. Realiza una bisagra de cadera (similar al Peso Muerto Rumano) hasta que tu torso esté casi paralelo al suelo. Mantén la espalda recta.
2. Brazos: Deja que las mancuernas cuelguen directamente debajo de tu pecho, con las palmas enfrentadas (agarre neutro). Mantén una ligera flexión en los codos, como si abrazaras un barril.
3. La Elevación: Sin cambiar la flexión de los codos, eleva los brazos hacia los lados, liderando el movimiento con los codos y la parte posterior de los hombros. Imagina que quieres juntar tus omóplatos.
4. Contracción: Haz una pausa en la parte superior del movimiento, apretando la espalda alta.
5. El Descenso: Baja las mancuernas de forma lenta y controlada hasta la posición inicial.

**Puntos Clave:**
- Usa un peso ligero. Este ejercicio no se presta para levantar cargas pesadas. El ego aquí solo lleva a una mala técnica y lesiones.
- El movimiento debe ser controlado, sin usar el impulso del cuerpo para "lanzar" las pesas hacia arriba.
- Evita encoger los hombros hacia las orejas. Mantén los trapecios superiores relajados.
- El torso debe permanecer estático durante todo el ejercicio.

**Progresiones:**
Principiante: Realizar el ejercicio sentado en el borde de un banco e inclinado hacia adelante para dar soporte a la espalda baja. Usar bandas elásticas realizando "pull-aparts".
Intermedio: Aumentar lentamente el peso. Añadir una pausa de 1-2 segundos en la parte superior para incrementar el tiempo bajo tensión.`
  },
  'press-arnold': {
    id: 'press-arnold',
    name: 'Press Arnold',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Anterior), Deltoides (Cabeza Media), Deltoides (Cabeza Posterior), Tríceps Braquial, Trapecio

**Técnica:**
1. Sentado en un banco con respaldo, sostenga las mancuernas frente a los hombros con las palmas hacia usted.
2. Inicie el press hacia arriba mientras rota las muñecas, de modo que las palmas miren hacia adelante en la parte superior del movimiento.
3. Invierta el movimiento en la bajada, rotando las palmas de nuevo hacia usted.

**Puntos Clave:**
- El movimiento debe ser fluido y continuo.
- Mantiene la tensión en los deltoides durante un rango de movimiento más largo.

**Progresiones:**
**Principiante:** Usar peso ligero para dominar la rotación.
**Intermedio:** Aumentar el peso.`
  },
  'sentadilla-trasera-barra': {
    id: 'sentadilla-trasera-barra',
    name: 'Sentadilla Trasera con Barra',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Aductores, Erectores Espinales

**Técnica:**
1. Coloque la barra sobre los trapecios (barra alta) o deltoides posteriores (barra baja).
2. Con los pies a la anchura de los hombros y las puntas ligeramente hacia afuera, inicie el movimiento empujando las caderas hacia atrás y flexionando las rodillas.
3. Baje hasta que las caderas estén al menos paralelas al suelo.
4. Suba de forma controlada, manteniendo el pecho erguido.

**Puntos Clave:**
- Mantenga la espalda neutra y el pecho arriba.
- Las rodillas deben seguir la línea de los pies, sin colapsar hacia adentro.
- El peso debe distribuirse por todo el pie, no solo en los dedos o talones.
- Respire profundamente y contraiga el core como si fuera a recibir un golpe antes de bajar ('bracing').

**Progresiones:**
**Principiante:** Empezar con Goblet Squats para aprender el patrón de movimiento.
**Intermedio:** Aumentar la carga. Probar sentadillas con pausa.`
  },
  'sentadilla-frontal-barra': {
    id: 'sentadilla-frontal-barra',
    name: 'Sentadilla Frontal con Barra',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Core, Músculos de la Espalda Alta

**Técnica:**
1. Posición de la Barra (Rack): Coloca la barra en un rack a la altura de tu pecho. Acércate y apoya la barra sobre tus deltoides frontales, pegada a la clavícula, creando un "estante" con tus hombros.
2. El Agarre: Tienes dos opciones principales:
   - Agarre Limpio (Clean Grip): Eleva los codos y coloca las puntas de los dedos debajo de la barra para asegurarla. Requiere buena movilidad de muñeca.
   - Agarre Cruzado (Bodybuilder): Cruza los brazos y coloca las manos sobre la barra para mantenerla en su sitio. Es más fácil si tienes poca movilidad.
3. La Salida: Con la barra segura y los codos altos, sácala del rack y da 1-2 pasos hacia atrás. Pies a la anchura de los hombros.
4. El Descenso: Manteniendo el pecho erguido y los codos apuntando siempre hacia adelante y arriba, baja las caderas como si te sentaras en una silla. Tu torso permanecerá mucho más vertical que en una sentadilla trasera.
5. El Ascenso: Empuja el suelo con todo el pie para subir, liderando el movimiento con el pecho y manteniendo los codos elevados en todo momento.

**Puntos Clave:**
- ¡CODOS ARRIBA! Es la regla más importante. Si los codos bajan, tu torso se inclinará hacia adelante y probablemente pierdas la barra.
- El peso de la barra debe descansar sobre los hombros, no sobre las manos. Las manos solo estabilizan.
- Mantén el torso lo más vertical posible durante todo el recorrido. Esto es lo que le da al ejercicio su gran poder para fortalecer el core.
- Requiere buena movilidad de tobillos, caderas y muñecas. No dudes en trabajar estas áreas si te cuesta la técnica.

**Progresiones:**
Principiante: Dominar la Sentadilla Goblet (es el precursor perfecto). Practicar el movimiento con una barra vacía o un palo de PVC para automatizar la posición de los codos.
Intermedio: Aumentar el peso de forma progresiva. Incorporar pausas en el punto más bajo de la sentadilla (Pause Front Squat).`
  },
  'zancadas-mancuernas': {
    id: 'zancadas-mancuernas',
    name: 'Zancadas (Lunges) con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Isquiotibiales

**Técnica:**
1. De pie, sostenga una mancuerna en cada mano.
2. Dé un paso largo hacia adelante con una pierna y baje las caderas hasta que ambas rodillas estén flexionadas a unos 90 grados.
3. La rodilla trasera debe casi tocar el suelo.
4. Empuje con el pie delantero para volver a la posición inicial. Alterne las piernas.

**Puntos Clave:**
- El torso debe permanecer erguido.
- La rodilla delantera no debe sobrepasar la punta del pie.
- Un paso más corto enfatiza los cuádriceps; un paso más largo, los glúteos.

**Progresiones:**
**Principiante:** Realizar sin peso.
**Intermedio:** Aumentar el peso. Probar zancadas caminando.`
  },
  'hip-thrust-barra': {
    id: 'hip-thrust-barra',
    name: 'Hip Thrust con Barra',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Isquiotibiales

**Técnica:**
1. Siéntese en el suelo con la parte superior de la espalda apoyada en un banco.
2. Ruede una barra cargada sobre sus caderas.
3. Con los pies en el suelo y las rodillas flexionadas, empuje las caderas hacia arriba hasta que el cuerpo forme una línea recta desde los hombros hasta las rodillas.
4. Apriete los glúteos en la parte superior. Baje de forma controlada.

**Puntos Clave:**
- Mantenga la barbilla pegada al pecho para proteger el cuello.
- En la posición superior, las espinillas deben estar verticales.
- El movimiento es una extensión de cadera pura.

**Progresiones:**
**Principiante:** Realizar con peso corporal o una mancuerna.
**Intermedio:** Aumentar la carga en la barra.`
  },
  'curl-biceps-barra-z': {
    id: 'curl-biceps-barra-z',
    name: 'Curl de Bíceps con Barra Z',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Bíceps Braquial, Braquial Anterior

**Técnica:**
1. De pie, agarre la barra Z con un agarre supino (palmas hacia arriba) a la anchura de los hombros.
2. Manteniendo los codos pegados al cuerpo, flexione los codos para levantar la barra hacia los hombros.
3. Apriete los bíceps en la parte superior.
4. Baje la barra de forma controlada hasta la extensión completa.

**Puntos Clave:**
- La barra Z reduce la tensión en las muñecas en comparación con una barra recta.
- Evite balancear el cuerpo para generar impulso.

**Progresiones:**
**Principiante:** Usar peso ligero y enfocarse en la contracción.
**Intermedio:** Aumentar el peso. Probar el curl 21 (7 reps parciales bajas, 7 altas, 7 completas).`
  },
  'press-frances': {
    id: 'press-frances',
    name: 'Press Francés (Skull Crusher)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial

**Técnica:**
1. Acuéstese en un banco plano con una barra Z o mancuernas.
2. Extienda los brazos verticalmente sobre el pecho.
3. Manteniendo los codos fijos, flexiónelos para bajar la barra hacia la frente.
4. Extienda los codos para volver a la posición inicial, contrayendo los tríceps.

**Puntos Clave:**
- Los codos deben apuntar al techo, no abrirse hacia los lados.
- El movimiento debe ser únicamente de la articulación del codo.

**Progresiones:**
**Principiante:** Usar peso ligero.
**Intermedio:** Aumentar la carga. Probar en banco inclinado para mayor estiramiento de la cabeza larga.`
  },
  'press-banca-agarre-cerrado': {
    id: 'press-banca-agarre-cerrado',
    name: 'Press de Banca con Agarre Cerrado',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial, Pectoral Mayor (Porción Esternal), Deltoides (Cabeza Anterior)

**Técnica:**
1. Acuéstese en el banco plano como en un press de banca normal.
2. Agarre la barra con las manos a la anchura de los hombros o ligeramente más cerradas.
3. Baje la barra hasta la parte baja del pecho, manteniendo los codos pegados al cuerpo.
4. Empuje hacia arriba hasta la extensión completa.

**Puntos Clave:**
- Este movimiento traslada el énfasis del pecho a los tríceps.
- Mantener los codos pegados al torso es crucial.

**Progresiones:**
**Principiante:** Empezar con poco peso.
**Intermedio:** Aumentar la carga.`
  },
  'press-suelo-mancuernas': {
    id: 'press-suelo-mancuernas',
    name: 'Press de Suelo con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Tríceps Braquial, Deltoides (Cabeza Anterior)

**Técnica:**
1. Acuéstese en el suelo con las rodillas flexionadas.
2. Sostenga las mancuernas sobre el pecho con los brazos extendidos.
3. Baje las mancuernas hasta que los tríceps toquen el suelo.
4. Haga una pausa y empuje de nuevo hacia arriba.

**Puntos Clave:**
- El rango de movimiento es más corto que en un banco, lo que protege los hombros.
- Ideal para trabajar la fuerza de bloqueo (lockout).

**Progresiones:**
**Principiante:** Realizar con peso corporal (flexiones de rodillas).
**Intermedio:** Aumentar las repeticiones. Realizar de forma alterna.`
  },
  'flexiones-manos-step': {
    id: 'flexiones-manos-step',
    name: 'Flexiones con Manos en Step',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor (Porción Inferior), Tríceps Braquial, Deltoides

**Técnica:**
1. Coloque las manos sobre los bordes de un banco step, a la anchura de los hombros.
2. En posición de plancha, baje el pecho hasta que esté cerca del step.
3. Empuje hacia arriba hasta la posición inicial.

**Puntos Clave:**
- La inclinación facilita el ejercicio en comparación con las flexiones en el suelo.
- Permite un mayor rango de movimiento que las flexiones estándar.

**Progresiones:**
**Principiante:** Empezar con una inclinación mayor (usando una silla o mesa).
**Intermedio:** Bajar la inclinación (manos en el suelo).`
  },
  'press-pecho-banda-resistencia': {
    id: 'press-pecho-banda-resistencia',
    name: 'Press de Pecho con Banda de Resistencia',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Tríceps Braquial, Deltoides

**Técnica:**
1. Pase una banda de resistencia por su espalda, a la altura de los omóplatos.
2. Sujete los extremos de la banda con cada mano.
3. De pie o arrodillado, empuje los brazos hacia adelante, extendiéndolos completamente contra la resistencia de la banda.
4. Vuelva a la posición inicial de forma controlada.

**Puntos Clave:**
- La resistencia es variable: aumenta al final del movimiento, donde el músculo es más fuerte.
- Mantenga el core activado para estabilizar el torso.

**Progresiones:**
**Principiante:** Usar una banda de resistencia ligera.
**Intermedio:** Usar una banda más pesada. Aumentar las repeticiones.`
  },
  'remo-inclinado-mancuernas-ligeras': {
    id: 'remo-inclinado-mancuernas-ligeras',
    name: 'Remo Inclinado con Mancuernas Ligeras',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Romboides, Trapecio, Deltoides (Cabeza Posterior)

**Técnica:**
1. De pie, con los pies a la anchura de las caderas, incline el torso hacia adelante manteniendo la espalda recta.
2. Sostenga las mancuernas con los brazos extendidos hacia el suelo.
3. Tire de las mancuernas hacia las caderas, apretando los omóplatos.
4. Baje de forma controlada.

**Puntos Clave:**
- Con peso ligero, el enfoque está en la contracción muscular y altas repeticiones (15-25).
- Mantenga el cuello en una posición neutra.

**Progresiones:**
**Principiante:** Realizar con el pecho apoyado en un banco step inclinado para mayor soporte.
**Intermedio:** Aumentar las repeticiones y/o la velocidad controlada.`
  },
  'remo-sentado-banda-resistencia': {
    id: 'remo-sentado-banda-resistencia',
    name: 'Remo Sentado con Banda de Resistencia',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Romboides, Trapecio

**Técnica:**
1. Siéntese en el suelo con las piernas extendidas.
2. Coloque el centro de la banda alrededor de las plantas de los pies.
3. Sujete los extremos de la banda con las manos.
4. Con la espalda recta, tire de la banda hacia su abdomen, llevando los codos hacia atrás y juntando los omóplatos.

**Puntos Clave:**
- Mantenga el torso erguido; no se incline hacia atrás para generar impulso.
- La contracción de la espalda es la clave del movimiento.

**Progresiones:**
**Principiante:** Usar una banda ligera.
**Intermedio:** Usar una banda más pesada o agarrar la banda más cerca de los pies para aumentar la tensión.`
  },
  'pull-aparts-banda': {
    id: 'pull-aparts-banda',
    name: '"Pull-Aparts" con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Posterior), Romboides, Trapecio (Fibras Medias)

**Técnica:**
1. De pie, sostenga una banda de resistencia con ambas manos frente a usted, a la altura de los hombros, con los brazos extendidos.
2. Separe las manos, estirando la banda a lo ancho de su pecho.
3. Concéntrese en juntar los omóplatos.
4. Vuelva a la posición inicial de forma controlada.

**Puntos Clave:**
- Excelente para la salud del hombro y la corrección postural.
- Mantenga los brazos rectos durante todo el movimiento.

**Progresiones:**
**Principiante:** Usar una banda muy ligera.
**Intermedio:** Usar una banda de mayor resistencia. Realizar pausas en la posición de máxima contracción.`
  },
  'press-hombros-mancuernas-ligeras': {
    id: 'press-hombros-mancuernas-ligeras',
    name: 'Press de Hombros con Mancuernas Ligeras',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabezas Anterior y Media), Tríceps Braquial

**Técnica:**
1. Sentado o de pie, sostenga las mancuernas a la altura de los hombros, con las palmas hacia adelante.
2. Empuje las mancuernas verticalmente hacia arriba hasta que los brazos estén casi completamente extendidos.
3. Baje de forma controlada a la posición inicial.

**Puntos Clave:**
- Con peso ligero, céntrese en un tempo lento y controlado (ej. 3 segundos para bajar, 1 para subir).
- Mantenga el core activado para proteger la espalda baja.

**Progresiones:**
**Principiante:** Realizar el movimiento de forma alterna.
**Intermedio:** Realizar series de altas repeticiones (15-20) o aumentar el tiempo bajo tensión.`
  },
  'elevaciones-laterales-pausa': {
    id: 'elevaciones-laterales-pausa',
    name: 'Elevaciones Laterales con Pausa',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Media)

**Técnica:**
1. De pie, sostenga las mancuernas a los lados.
2. Eleve los brazos hacia los lados hasta la altura de los hombros.
3. Mantenga la posición en la parte superior durante 1-2 segundos, contrayendo los deltoides.
4. Baje las mancuernas de forma muy lenta (3-4 segundos).

**Puntos Clave:**
- La pausa y la fase excéntrica lenta aumentan la intensidad sin necesidad de mucho peso.
- Evite el balanceo.

**Progresiones:**
**Principiante:** Realizar sin pausa.
**Intermedio:** Aumentar el tiempo de la pausa y de la fase excéntrica.`
  },
  'remo-menton-banda': {
    id: 'remo-menton-banda',
    name: 'Remo al Mentón con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Media), Trapecio

**Técnica:**
1. Pise el centro de una banda de resistencia con ambos pies.
2. Agarre los extremos de la banda con las manos juntas frente a los muslos.
3. Tire de la banda hacia arriba, llevando las manos hacia el mentón y los codos hacia los lados y hacia arriba.
4. Baje de forma controlada.

**Puntos Clave:**
- Los codos siempre deben estar más altos que las muñecas.
- El movimiento es vertical, cerca del cuerpo.

**Progresiones:**
**Principiante:** Usar una banda ligera.
**Intermedio:** Usar una banda más pesada.`
  },
  'sentadilla-goblet-mancuerna-ligera': {
    id: 'sentadilla-goblet-mancuerna-ligera',
    name: 'Sentadilla Goblet con Mancuerna Ligera',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Core

**Técnica:**
1. Sostenga una mancuerna verticalmente contra su pecho.
2. Realice una sentadilla profunda, manteniendo el torso erguido.
3. Haga una pausa de 1-2 segundos en la parte inferior antes de subir.

**Puntos Clave:**
- La pausa aumenta la intensidad y el tiempo bajo tensión.
- Mantenga los codos entre las rodillas en la parte inferior.

**Progresiones:**
**Principiante:** Realizar sin pausa.
**Intermedio:** Aumentar el tiempo de pausa. Probar sentadillas con salto al subir.`
  },
  'step-up-banco-step': {
    id: 'step-up-banco-step',
    name: 'Step-Up en Banco Step',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Cuádriceps

**Técnica:**
1. De pie frente a un banco step, sosteniendo mancuernas a los lados (opcional).
2. Suba un pie al step y empuje con esa pierna para elevar todo el cuerpo.
3. La pierna de atrás debe usarse lo menos posible para el impulso.
4. Baje de forma controlada. Complete todas las repeticiones con una pierna antes de cambiar.

**Puntos Clave:**
- Concéntrese en el trabajo de la pierna que está sobre el step.
- Mantenga el torso erguido y el core activado.

**Progresiones:**
**Principiante:** Realizar sin mancuernas.
**Intermedio:** Añadir mancuernas ligeras. Aumentar la altura del step.`
  },
  'puente-gluteos-una-pierna': {
    id: 'puente-gluteos-una-pierna',
    name: 'Puente de Glúteos a una Pierna',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Isquiotibiales

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas.
2. Extienda una pierna recta.
3. Coloque una mancuerna sobre la cadera del lado que trabaja.
4. Empuje con el talón del pie apoyado para elevar las caderas.
5. Apriete el glúteo en la parte superior. Baje de forma controlada.

**Puntos Clave:**
- Mantenga las caderas niveladas; no deixe que un lado caiga.
- El movimiento debe ser controlado y enfocado en la contracción del glúteo.

**Progresiones:**
**Principiante:** Realizar sin peso o con ambas piernas.
**Intermedio:** Añadir peso. Añadir una pausa en la parte superior.`
  },
  'curl-biceps-banda': {
    id: 'curl-biceps-banda',
    name: 'Curl de Bíceps con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Bíceps Braquial

**Técnica:**
1. Pise el centro de una banda de resistencia.
2. Sujete los extremos con las palmas hacia adelante.
3. Manteniendo los codos pegados al cuerpo, flexiónelos para llevar las manos hacia los hombros.
4. Baje de forma controlada.

**Puntos Clave:**
- La resistencia variable de la banda desafía al bíceps especialmente en la parte final del movimiento.
- No balancee el cuerpo.

**Progresiones:**
**Principiante:** Usar una banda ligera.
**Intermedio:** Usar una banda más pesada o realizar el ejercicio de rodillas para aumentar la tensión inicial.`
  },
  'patada-triceps-mancuerna': {
    id: 'patada-triceps-mancuerna',
    name: 'Patada de Tríceps con Mancuerna',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial

**Técnica:**
1. Incline el torso hacia adelante, apoyando una mano en una silla o banco step.
2. Sostenga una mancuerna en la otra mano, con el codo flexionado a 90 grados y el brazo superior paralelo al suelo.
3. Extienda el codo hacia atrás hasta que el brazo esté completamente recto.
4. Vuelva a la posición inicial de forma controlada.

**Puntos Clave:**
- El brazo superior debe permanecer inmóvil durante todo el ejercicio.
- Concéntrese en apretar el tríceps en la posición de extensión completa.

**Progresiones:**
**Principiante:** Realizar sin peso, enfocándose en la contracción.
**Intermedio:** Aumentar las repeticiones. Añadir una pausa en la extensión.`
  },
  'dislocaciones-hombro-banda': {
    id: 'dislocaciones-hombro-banda',
    name: 'Dislocaciones de Hombro con Banda',
    category: 'movilidad',
    isBodyweight: false,
    gifUrl: '',
    description: `**Objetivo:** Movilizar la articulación del hombro y mejorar el rango de movimiento.
    
**Técnica:**
1. Toma una banda elástica (o un palo de escoba) con un agarre ancho.
2. Mantén los brazos completamente estirados.
3. Pásala desde tu cintura por encima de tu cabeza hasta tocar tu espalda baja.
4. Regresa a la posición inicial manteniendo los brazos rectos.`
  },
  'press-banca-mancuernas': {
    id: 'press-banca-mancuernas',
    name: 'Press de Banca con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:** Pectoral Mayor, Deltoides Anterior, Tríceps.
    
**Técnica:**
1. Acuéstate en un banco plano (0º) con una mancuerna en cada mano.
2. Junta los omóplatos contra el banco (saca pecho).
3. Baja las mancuernas controladamente durante 3 segundos.
4. Los codos deben formar un ángulo de 45º respecto al torso.
5. Realiza una PAUSA ISOMÉTRICA de 1 segundo en la parte más baja.
6. Sube explosivamente.`
  },
  'jalon-dorsal-banda': {
    id: 'jalon-dorsal-banda',
    name: 'Jalón Dorsal con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:** Dorsal Ancho, Bíceps, Espalda Alta.
    
**Técnica:**
1. Usa una banda anclada en un punto alto (aprox 2.2m).
2. Colócate de rodillas o de pie inclinando el torso a 45º.
3. Agarra la banda y tracciona llevando los codos hacia abajo y hacia tus costillas.
4. Saca el pecho al jalar, no te encorves.
5. Sostén 1 segundo la máxima contracción abajo.`
  },
  'press-militar-sentado-mancuernas': {
    id: 'press-militar-sentado-mancuernas',
    name: 'Press Militar Sentado con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:** Deltoides, Tríceps.
    
**Técnica:**
1. Siéntate en un banco a 80º-85º con mancuernas.
2. Apoya firmemente la espalda alta.
3. Posiciona los codos ligeramente adelantados (plano escapular, ~30º).
4. Empuja el peso verticalmente, apretando el abdomen.
5. Baja controladamente hasta que las mancuernas rocen la altura de tus orejas.`
  },
  'extension-triceps-cabeza-banda': {
    id: 'extension-triceps-cabeza-banda',
    name: 'Extensión de Tríceps sobre la Cabeza con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial (Cabeza Larga)

**Técnica:**
1. Pise un extremo de la banda con un pie.
2. Sujete el otro extremo con ambas manos y llévelo por detrás de la cabeza, con los codos flexionados y apuntando hacia arriba.
3. Extienda los codos para llevar las manos hacia el techo.
4. Baje de forma controlada.

**Puntos Clave:**
- Mantenga los codos lo más juntos posible.
- El estiramiento en la parte inferior es clave para estimular la cabeza larga del tríceps.

**Progresiones:**
**Principiante:** Usar una banda ligera.
**Intermedio:** Usar una banda de mayor resistencia.`
  },
  'salto-comba-basico': {
    id: 'salto-comba-basico',
    name: 'Salto de Comba Básico',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Gemelos, Cuádriceps, Core, Hombros

**Técnica:**
1. De pie, con la comba detrás de los talones.
2. Gire la comba usando las muñecas, no los brazos.
3. Salte con ambos pies juntos, solo lo suficiente para que la comba pase por debajo.
4. Aterrice suavemente sobre las puntas de los pies.

**Puntos Clave:**
- Mantenga una postura erguida y los codos cerca del cuerpo.
- El salto debe ser bajo y eficiente.
- La longitud de la comba es correcta si al pisarla en el centro, los mangos llegan a la altura de las axilas.

**Progresiones:**
**Principiante:** Practicar el movimiento sin comba. Empezar con intervalos cortos (ej. 20 seg de salto, 40 seg de descanso).
**Intermedio:** Aumentar la duración de los intervalos (ej. 30 seg de salto, 30 seg de descanso). Probar variaciones.`
  },
  'salto-boxeador': {
    id: 'salto-boxeador',
    name: 'Salto de Boxeador',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Gemelos, Cuádriceps, Core, Hombros

**Técnica:**
1. Similar al salto básico, pero alternando el peso del cuerpo de un pie a otro con cada salto.
2. Un pie soporta el peso mientras el otro toca ligeramente el suelo.
3. El movimiento imita el juego de pies de un boxeador.

**Puntos Clave:**
- Es un ritmo más sostenible que el salto básico y permite sesiones más largas.
- Mantenga el movimiento fluido y rítmico.

**Progresiones:**
**Principiante:** Dominar primero el salto básico.
**Intermedio:** Incorporarlo en rutinas de intervalos.`
  },
  'rodillas-altas-comba': {
    id: 'rodillas-altas-comba',
    name: 'Rodillas Altas con Comba',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Flexores de Cadera, Cuádriceps, Glúteos, Core

**Técnica:**
1. Mientras salta, alterne llevando una rodilla hacia el pecho con cada giro de la comba.

**Puntos Clave:**
- Aumenta significativamente la intensidad cardiovascular.
- Mantenga el core activado para estabilizar el torso.

**Progresiones:**
**Principiante:** Realizar rodillas altas sin comba.
**Intermedio:** Integrar en intervalos de alta intensidad (HIIT).`
  },
  'flexiones-push-ups': {
    id: 'flexiones-push-ups',
    name: 'Flexiones (Push-ups)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Tríceps Braquial, Deltoides (Cabeza Anterior), Core

**Técnica:**
1. Coloque las manos en el suelo a la anchura de los hombros.
2. Extienda las piernas hacia atrás, formando una línea recta desde la cabeza hasta los talones.
3. Baje el cuerpo de forma controlada hasta que el pecho casi toque el suelo.
4. Empuje con fuerza para volver a la posición inicial.

**Puntos Clave:**
- Mantenga el core y los glúteos contraídos para evitar que la cadera se hunda.
- Los codos deben formar un ángulo de 45-75 grados con el torso, no abiertos a los lados.

**Progresiones:**
**Principiante:** Flexiones en la pared -> Flexiones inclinadas -> Flexiones de rodillas.
**Intermedio:** Flexiones estándar -> Flexiones diamante (manos juntas) -> Flexiones declinadas (pies elevados).`
  },
  'fondos-silla-paralelas-dips': {
    id: 'fondos-silla-paralelas-dips',
    name: 'Fondos en Silla o Paralelas (Dips)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial, Pectoral Mayor (Porción Inferior), Deltoides (Cabeza Anterior)

**Técnica:**
1. Colóquese entre dos sillas estables o barras paralelas, con las manos apoyadas en ellas.
2. Extienda los brazos para levantar el cuerpo.
3. Baje el cuerpo flexionando los codos hasta que los hombros estén aproximadamente a la altura de los codos (90 grados).
4. Empuje hacia arriba para volver a la posición inicial.

**Puntos Clave:**
- Para enfatizar los tríceps, mantenga el torso lo más vertical posible.
- Para enfatizar el pecho, inclínese ligeramente hacia adelante.
- No baje en exceso para proteger la articulación del hombro.

**Progresiones:**
**Principiante:** Fondos en banco (manos detrás del cuerpo, pies en el suelo).
**Intermedio:** Fondos en paralelas. Probar negativas (bajada lenta).`
  },
  'remo-invertido-dominada-australiana': {
    id: 'remo-invertido-dominada-australiana',
    name: 'Remo Invertido (Dominada Australiana)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Romboides, Trapecio, Deltoides (Cabeza Posterior), Bíceps Braquial

**Técnica:**
1. Colóquese debajo de una barra baja o el borde de una mesa resistente.
2. Agarre la barra con las manos a la anchura de los hombros.
3. Manteniendo el cuerpo recto como una tabla, tire del pecho hacia la barra.
4. Baje de forma controlada.

**Puntos Clave:**
- La dificultad se ajusta con la inclinación del cuerpo: cuanto más horizontal esté, más difícil será.
- Apriete los omóplatos en la parte superior del movimiento.

**Progresiones:**
**Principiante:** Cuerpo más vertical.
**Intermedio:** Cuerpo más horizontal -> Pies elevados sobre un step o silla.`
  },
  'dominadas-pull-ups': {
    id: 'dominadas-pull-ups',
    name: 'Dominadas (Pull-ups)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Dorsal Ancho, Bíceps Braquial, Trapecio, Romboides

**Técnica:**
1. Cuélguese de una barra alta con un agarre prono (palmas hacia adelante), un poco más ancho que los hombros.
2. Inicie el movimiento retrayendo las escápulas (hombros hacia abajo y atrás).
3. Tire con la espalda y los brazos hasta que la barbilla supere la barra.
4. Baje de forma controlada hasta la extensión completa de los brazos.

**Puntos Clave:**
- Evite el balanceo (kipping) para un desarrollo de fuerza estricto.
- Un agarre supino (chin-up) involucra más a los bíceps y suele ser más fácil para principiantes.
- Baje hasta la extensión completa de los brazos para un rango de movimiento completo y mayor desarrollo muscular.

**Progresiones:**
**Principiante:** Colgarse activamente -> Dominadas escapulares -> Negativas (saltar y bajar lentamente) -> Dominadas con banda elástica.
**Intermedio:** Dominadas estándar.`
  },
  'flexiones-pica-pike-push-ups': {
    id: 'flexiones-pica-pike-push-ups',
    name: 'Flexiones en Pica (Pike Push-ups)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides (Cabeza Anterior), Deltoides (Cabeza Media), Tríceps Braquial, Trapecio (Fibras Superiores)

**Técnica:**
1. Colóquese en posición de "V" invertida, con las caderas altas y el cuerpo formando un ángulo.
2. Las manos y los pies están en el suelo.
3. Flexione los codos para bajar la parte superior de la cabeza hacia el suelo.
4. Empuje hacia arriba para volver a la posición inicial.

**Puntos Clave:**
- Mantenga las caderas lo más altas posible durante todo el movimiento.
- La cabeza debe moverse hacia adelante, formando un trípode con las manos en la parte inferior.

**Progresiones:**
**Principiante:** Realizar con un rango de movimiento corto.
**Intermedio:** Elevar los pies sobre un step o silla para aumentar la carga sobre los hombros.`
  },
  'flexiones-pino-asistidas-handstand-push-ups': {
    id: 'flexiones-pino-asistidas-handstand-push-ups',
    name: 'Flexiones de Pino Asistidas (Handstand Push-ups)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides, Tríceps Braquial, Trapecio

**Técnica:**
1. Colóquese en posición de pino (handstand) con los talones apoyados en una pared para mantener el equilibrio.
2. Baje el cuerpo flexionando los codos hasta que la cabeza casi toque el suelo.
3. Empuje con fuerza para volver a la posición inicial.

**Puntos Clave:**
- Mantenga el core activado para estabilizar el cuerpo.
- Es un ejercicio avanzado que requiere una base sólida de fuerza.

**Progresiones:**
**Principiante:** Dominar las flexiones en pica con pies elevados.
**Intermedio:** Realizar negativas de flexión de pino. Aumentar el rango de movimiento usando parallettes.`
  },
  'sentadilla-cuerpo-squat': {
    id: 'sentadilla-cuerpo-squat',
    name: 'Sentadilla (Squat)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Isquiotibiales

**Técnica:**
1. De pie, con los pies a la anchura de los hombros.
2. Baje las caderas hacia atrás y hacia abajo, como si se sentara en una silla.
3. Mantenga el pecho erguido y la espalda recta.
4. Baje hasta que los muslos estén paralelos al suelo o más abajo.
5. Empuje con los talones para volver a subir.

**Puntos Clave:**
- Las rodillas deben seguir la dirección de los pies.
- El control del movimiento es clave, especialmente en la bajada.

**Progresiones:**
**Principiante:** Sentadilla asistida (agarrándose a algo).
**Intermedio:** Sentadilla con pausa en el fondo -> Sentadilla con salto (pliométrica).`
  },
  'sentadilla-bulgara-bulgarian-split-squat': {
    id: 'sentadilla-bulgara-bulgarian-split-squat',
    name: 'Sentadilla Búlgara (Bulgarian Split Squat)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Cuádriceps

**Técnica:**
1. Coloque el empeine de un pie en una silla o banco detrás de usted.
2. El pie delantero debe estar lo suficientemente adelante para permitir una sentadilla cómoda.
3. Baje el cuerpo hasta que el muslo delantero esté paralelo al suelo.
4. Empuje con el pie delantero para volver a subir.

**Puntos Clave:**
- Es un ejercicio unilateral excelente para corregir desequilibrios y aumentar la fuerza.
- Mantenga el torso erguido.

**Progresiones:**
**Principiante:** Realizar sin elevación del pie trasero (zancada estática).
**Intermedio:** Aumentar las repeticiones. Añadir explosividad en la subida.`
  },
  'sentadilla-pistola-pistol-squat': {
    id: 'sentadilla-pistola-pistol-squat',
    name: 'Sentadilla Pistola (Pistol Squat)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Isquiotibiales, Core

**Técnica:**
1. De pie sobre una pierna, extienda la otra pierna recta hacia adelante.
2. Baje lentamente el cuerpo sobre la pierna de apoyo, como en una sentadilla normal.
3. Baje lo más profundo posible, idealmente hasta que el isquiotibial cubra el gemelo.
4. Vuelva a subir de forma controlada.

**Puntos Clave:**
- Requiere una gran combinación de fuerza, equilibrio y movilidad.
- Mantenga el talón de la pierna de apoyo firmemente en el suelo.

**Progresiones:**
**Principiante:** Sentadilla pistola asistida (agarrándose a una puerta o usando TRX) -> Sentadilla pistola a una caja o banco (bajando hasta sentarse).
**Intermedio:** Negativas de pistola.`
  },
  'fondos-banco-triceps': {
    id: 'fondos-banco-triceps',
    name: 'Fondos en Banco (Tríceps)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Tríceps Braquial, Deltoides (Cabeza Anterior)

**Técnica:**
1. Siéntese en el borde de una silla o banco, con las manos a los lados de las caderas.
2. Deslice los glúteos hacia adelante, apoyando el peso en los brazos.
3. Baje el cuerpo flexionando los codos hasta unos 90 grados.
4. Empuje con los tríceps para volver a la posición inicial.

**Puntos Clave:**
- La dificultad aumenta al alejar los pies del cuerpo (piernas flexionadas es más fácil, extendidas es más difícil).
- Mantenga la espalda cerca del banco.

**Progresiones:**
**Principiante:** Piernas flexionadas.
**Intermedio:** Piernas extendidas -> Pies elevados en otra superficie.`
  },
  'plancha-core': {
    id: 'plancha-core',
    name: 'Plancha (Core)',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Recto Abdominal, Transverso Abdominal, Oblicuos, Erectores Espinales

**Técnica:**
1. Apoye los antebrazos y las puntas de los pies en el suelo.
2. Mantenga el cuerpo en una línea recta perfecta desde la cabeza hasta los talones.
3. Contraiga el abdomen y los glúteos para mantener la posición.

**Puntos Clave:**
- No deixe que la cadera se hunda ni se eleve demasiado.
- Mantenga una respiración constante.
- Objetivo: Mantener la posición durante 20-45 segundos. Realice 3-4 repeticiones.

**Progresiones:**
**Principiante:** Plancha de rodillas.
**Intermedio:** Aumentar el tiempo de mantenimiento. Probar plancha con toque de hombros o plancha lateral.`
  },
  'elevacion-piernas-leg-raises': {
    id: 'elevacion-piernas-leg-raises',
    name: 'Elevación de Piernas (Leg Raises)',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Recto Abdominal (Porción Inferior), Flexores de Cadera

**Técnica:**
1. Acuéstese boca arriba, con las manos debajo de los glúteos para apoyar la espalda baja.
2. Levante las piernas rectas hacia el techo hasta que estén perpendiculares al suelo.
3. Baje las piernas de forma lenta y controlada, sin dejar que toquen el suelo.

**Puntos Clave:**
- Mantenga la espalda baja en contacto con el suelo durante todo el movimiento.
- Si es muy difícil, flexione las rodillas.

**Progresiones:**
**Principiante:** Elevación de rodillas al pecho.
**Intermedio:** Elevación de piernas estiradas. Realizar colgado de una barra.`
  },
  'estiramiento-pectorales-puerta': {
    id: 'estiramiento-pectorales-puerta',
    name: 'Estiramiento de Pectorales en Puerta',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Pectoral Menor

**Técnica:**
1. Colóquese en el marco de una puerta.
2. Apoye los antebrazos en el marco, con los codos a la altura de los hombros o ligeramente por debajo.
3. Dé un paso suave hacia adelante hasta sentir un estiramiento en la parte delantera del pecho y los hombros.
4. Mantenga la posición durante 30 segundos.

**Puntos Clave:**
- Es uno de los estiramientos más efectivos para contrarrestar el acortamiento de los pectorales por la postura sedentaria.`
  },
  'postura-gato-vaca': {
    id: 'postura-gato-vaca',
    name: 'Movilización Gato-Vaca',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Movilizar cada segmento de la columna vertebral, aliviando la rigidez y mejorando la conciencia corporal.

**Técnica:**
1. Comience en cuadrupedia (a cuatro patas), con las manos debajo de los hombros y las rodillas debajo de las caderas.
2. **Vaca:** Al inhalar, deje caer el abdomen, arquee la espalda y levante la cabeza y el coxis hacia el techo.
3. **Gato:** Al exhalar, redondee la espalda hacia el techo, metiendo el ombligo y llevando la barbilla hacia el pecho.
4. Alterne suavemente entre estas dos posiciones durante 10-15 repeticiones.

**Puntos Clave:**
- Observe su capacidad para iniciar el movimiento desde la pelvis. ¿Puede mover la pelvis (anteversión y retroversión) de forma independiente, permitiendo que la columna siga el movimiento en una onda suave?`
  },
  'rotacion-toracica-cuadrupedia': {
    id: 'rotacion-toracica-cuadrupedia',
    name: 'Rotación Torácica en Cuadrupedia',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Mejorar la capacidad de rotación de la columna dorsal (espalda alta), una movilidad que se pierde fácilmente con posturas sedentarias.

**Técnica:**
1. Desde la posición de cuadrupedia, coloque una mano detrás de la nuca.
2. Al exhalar, gire el torso, llevando el codo de la mano elevada hacia el techo. Siga el codo con la mirada.
3. Al inhalar, regrese lentamente y lleve el codo hacia la muñeca de la mano de apoyo.
4. Realice 2 series de 10-12 repeticiones por lado.

**Puntos Clave:**
- Mantenga las caderas estables y evite que se desplacen. El movimiento debe originarse en la espalda alta.`
  },
  'retraccion-cervical': {
    id: 'retraccion-cervical',
    name: 'Retracción Cervical ("Papada")',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Músculos Flexores Profundos del Cuello

**Técnica:**
1. Siéntese o póngase de pie con la espalda recta, mirando al frente.
2. Lleve suavemente la barbilla hacia atrás, como si intentara crear una "papada", sin inclinar la cabeza hacia abajo.
3. Mantenga 5 segundos, repita 10 veces.`
  },
  'remo-banda-elastica': {
    id: 'remo-banda-elastica',
    name: 'Remo con Banda Elástica (Band Rows)',
    category: 'postura',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Romboides, Trapecio (Fibras Medias e Inferiores), Deltoides (Cabeza Posterior)

**Técnica:**
1. Sujete una banda elástica a un punto fijo (como el pomo de una puerta) a la altura del pecho.
2. Sostenga los extremos de la banda con ambas manos, los brazos extendidos y dé un paso atrás para crear tensión.
3. Inicie el movimiento juntando los omóplatos. Luego, tire de la banda hacia su torso, llevando los codos hacia atrás.
4. Realice 3 series de 12-15 repeticiones.`
  },
  'elevaciones-ytwl': {
    id: 'elevaciones-ytwl',
    name: 'Elevaciones en Y, T, W, L (YTWL)',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Trapecio (Fibras Medias e Inferiores), Romboides, Deltoides (Cabeza Posterior)

**Técnica:**
1. Acuéstese boca abajo en el suelo con la frente apoyada.
2. Y: Extienda los brazos en diagonal hacia arriba (formando una Y), con los pulgares apuntando al techo. Levante los brazos del suelo.
3. T: Extienda los brazos hacia los lados (formando una T), pulgares al techo. Levante los brazos.
4. W: Doble los codos (formando una W), pulgares al techo. Levante los antebrazos.
5. L: Mantenga los codos pegados al cuerpo y los antebrazos perpendiculares. Rote los hombros para levantar las manos.
6. Realice 10-12 repeticiones de cada letra.`
  },
  'puente-gluteos': {
    id: 'puente-gluteos',
    name: 'Puente de Glúteos',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer los glúteos e isquiotibiales, músculos clave para la estabilidad de la pelvis, rodillas y espalda baja.

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas y los pies planos en el suelo, separados al ancho de las caderas.
2. Contraiga los glúteos y el abdomen.
3. Levante las caderas del suelo hasta que su cuerpo forme una línea recta desde los hombros hasta las rodillas.
4. Mantenga 2-3 segundos en la cima, apretando fuertemente los glúteos.
5. Baje de forma controlada. Realice 2-3 series de 12-15 repeticiones.

**Puntos Clave:**
- Evite arquear la espalda baja; el movimiento debe ser una extensión de cadera.`
  },
  'angeles-pared': {
    id: 'angeles-pared',
    name: 'Ángeles de Pared (Wall Angels)',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Rotadores Externos del Hombro, Trapecio (Fibras Inferiores), Serrato Anterior

**Técnica:**
1. Póngase de pie con la espalda contra una pared, tocándola con los talones, glúteos, espalda alta y cabeza.
2. Levante los brazos a los lados con los codos doblados a 90 grados (posición de "cactus"), intentando mantener el dorso de las manos y los antebrazos en contacto con la pared.
3. Deslice lentamente los brazos hacia arriba por la pared, tan alto como pueda sin que la espalda baja se separe de la pared o los brazos se despeguen.
4. Realice 10-12 repeticiones lentas.`
  },
  'test-dorsiflexion-tobillo': {
    id: 'test-dorsiflexion-tobillo',
    name: 'Test de Dorsiflexión Rodilla-Pared',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Medir de forma sencilla y fiable el rango de movimiento de dorsiflexión del tobillo, un movimiento clave para la salud de la rodilla y la sentadilla.

**Técnica:**
1. Descalzo, colóquese de frente a una pared.
2. Ponga un pie adelante, con la punta a un puño de distancia (10-12 cm) de la pared.
3. Manteniendo toda la planta del pie, especialmente el talón, en el suelo, intente tocar la pared con la rodilla.

**Puntos Clave:**
- La rodilla debe avanzar en línea recta, sin desviarse hacia adentro.
- Realizar el test en ambos tobillos para comparar.

**Resultados y Recomendaciones:**
- **Positivo (Movilidad Adecuada):** La rodilla toca la pared sin levantar el talón. ¡Excelente! Tu movilidad es funcional.
- **Negativo (Movilidad Limitada):** El talón se levanta antes de que la rodilla toque la pared. Esto indica una restricción y es recomendable trabajar en ella para prevenir compensaciones en rodillas y caderas.
[RECOMMENDATIONS:test-dorsiflexion-tobillo]`
  },
  'alfabeto-tobillo': {
    id: 'alfabeto-tobillo',
    name: 'El Alfabeto del Tobillo',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Movilizar la articulación del tobillo en todos sus planos de movimiento, mejorando la lubricación articular y el control motor.

**Técnica:**
1. Sentado en una silla o en el borde de la cama con el pie en el aire.
2. Utilice el dedo gordo del pie para "escribir" lentamente cada letra del abecedario en el aire.

**Puntos Clave:**
- Realice el movimiento de forma lenta y controlada, buscando el mayor rango de movimiento posible.`
  },
  'circulos-tobillo': {
    id: 'circulos-tobillo',
    name: 'Círculos con los Tobillos',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Movilizar y lubricar la articulación del tobillo de forma controlada.

**Técnica:**
1. Sentado en una silla o en el borde de la cama con el pie en el aire.
2. Realice 10-15 círculos lentos y amplios con el tobillo en el sentido de las agujas del reloj.
3. Repita en sentido contrario.

**Puntos Clave:**
- Concéntrese en que el movimiento se origine en el tobillo y no en toda la pierna.`
  },
  'estiramiento-gemelos': {
    id: 'estiramiento-gemelos',
    name: 'Estiramiento de Gemelos (Gastrocnemio)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Estirar el músculo gastrocnemio, la parte más superficial y voluminosa de la pantorrilla.

**Técnica:**
1. De pie, frente a una pared, apoye las manos en ella.
2. Dé un paso atrás con la pierna a estirar, manteniendo la rodilla **completamente extendida** y el talón en el suelo.
3. Incline el cuerpo hacia adelante flexionando la pierna delantera hasta sentir tensión en la parte superior del pantorrilla.
4. Mantenga la posición durante 20-30 segundos.`
  },
  'estiramiento-soleo': {
    id: 'estiramiento-soleo',
    name: 'Estiramiento del Sóleo',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Estirar el músculo sóleo, que se encuentra debajo del gemelo y es crucial para la dorsiflexión.

**Técnica:**
1. Desde la posición de estiramiento de gemelos, **flexione ligeramente la rodilla** de la pierna de atrás.
2. Mantenga siempre el talón en el suelo.
3. Sentirá la tensión más abajo en la pantorrilla, cerca del tendón de Aquiles.
4. Mantenga durante 20-30 segundos.`
  },
  'estiramiento-pantorrilla-toalla': {
    id: 'estiramiento-pantorrilla-toalla',
    name: 'Estiramiento de Pantorrilla con Toalla',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Estirar la musculatura de la pantorrilla de forma pasiva.

**Técnica:**
1. Siéntese en el suelo con las piernas extendidas.
2. Pase una toalla o banda por debajo de la planta de un pie.
3. Sujetando los extremos, tire suavemente hacia su cuerpo, llevando los dedos del pie hacia la espinilla.
4. Mantenga la rodilla recta. Sostenga la posición durante 20-30 segundos.`
  },
  'elevaciones-talon': {
    id: 'elevaciones-talon',
    name: 'Elevaciones de Talón',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer los músculos de la pantorrilla (gastrocnemio y sóleo), que contribuyen a la estabilidad del tobillo.

**Técnica:**
1. De pie, con los pies separados a la anchura de las caderas. Puede apoyarse en una pared para mantener el equilibrio.
2. Levante lentamente los talones del suelo hasta quedar sobre las puntas de los pies, tan alto como pueda.
3. Haga una pausa de 1-2 segundos en la parte superior.
4. Baje de forma controlada y lenta.
5. Realice 2-3 series de 15-20 repeticiones.

**Progresiones:**
- Realice el ejercicio sobre una sola pierna para aumentar la dificultad.`
  },
  'caminata-talon-punta': {
    id: 'caminata-talon-punta',
    name: 'Caminatas de Talones y Puntas',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer de forma dinámica tanto los músculos de la espinilla (tibial anterior) como los de la pantorrilla.

**Técnica:**
1. Camine una distancia de 5-10 metros apoyándose únicamente sobre los talones (dedos de los pies levantados).
2. Regrese caminando únicamente sobre las puntas de los pies.

**Puntos Clave:**
- Mantenga el torso erguido durante todo el recorrido.`
  },
  'banda-tobillo-4-direcciones': {
    id: 'banda-tobillo-4-direcciones',
    name: 'Fortalecimiento de Tobillo con Banda (4 Direcciones)',
    category: 'postura',
    isBodyweight: false,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer los músculos estabilizadores del tobillo en todos sus planos de movimiento para prevenir esguinces.

**Técnica:**
1. Sentado en el suelo, ancle una banda elástica en un objeto fijo (pata de una mesa).
2. Coloque la banda alrededor de la parte superior del pie a trabajar.
3. Realice movimientos lentos y controlados contra la resistencia en las 4 direcciones:
    - **Dorsiflexión:** Con la banda anclada al frente, tire del pie hacia usted.
    - **Flexión Plantar:** Con la banda anclada detrás de usted (o sujetada por sus manos), empuje el pie hacia abajo.
    - **Inversión:** Con la banda anclada lateralmente hacia afuera, gire la planta del pie hacia adentro.
    - **Eversión:** Con la banda anclada lateralmente hacia adentro, gire la planta del pie hacia afuera.
4. Realice 2 series de 15 repeticiones por cada movimiento.`
  },
  'equilibrio-monopodal': {
    id: 'equilibrio-monopodal',
    name: 'Equilibrio Monopodal',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Mejorar la propiocepción, que es la capacidad del tobillo para reaccionar rápidamente y mantener la estabilidad, previniendo torceduras.

**Técnica:**
1. Póngase de pie sobre una sola pierna, manteniendo una ligera flexión en la rodilla.
2. Intente mantener el equilibrio durante 30 segundos sin que el otro pie toque el suelo.

**Puntos Clave:**
- Fije la vista en un punto estático para ayudarse con el equilibrio.

**Progresiones:**
- Para aumentar la dificultad, realice el ejercicio con los ojos cerrados. Esto obliga al tobillo a trabajar mucho más.`
  },
  'contracciones-isometricas-cuadriceps': {
    id: 'contracciones-isometricas-cuadriceps',
    name: 'Contracciones Isométricas de Cuádriceps',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Activar el músculo cuádriceps sin mover la articulación de la rodilla, haciéndolo un ejercicio muy seguro para fases iniciales o con molestias.

**Técnica:**
1. Siéntese o acuéstese con la pierna extendida y una toalla pequeña enrollada debajo de la rodilla.
2. Contraiga el músculo del muslo (cuádriceps) intentando aplastar la toalla y empujar la rodilla contra el suelo.
3. Mantenga la contracción durante 5-10 segundos y luego relaje.
4. Realice 2 series de 10-15 repeticiones.`
  },
  'elevacion-pierna-recta': {
    id: 'elevacion-pierna-recta',
    name: 'Elevación de Pierna Recta',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer el cuádriceps y los flexores de la cadera sin generar estrés compresivo en la articulación de la rodilla.

**Técnica:**
1. Acuéstese boca arriba con la pierna sana flexionada y el pie apoyado.
2. Contraiga el cuádriceps de la pierna extendida para mantener la rodilla completamente recta.
3. Levante lentamente la pierna hasta que el muslo esté a la altura del de la otra pierna.
4. Baje la pierna de forma lenta y controlada, sin dejar que caiga.
5. Realice 2 series de 10-12 repeticiones por pierna.`
  },
  'sentadilla-isometrica-pared': {
    id: 'sentadilla-isometrica-pared',
    name: 'Sentadilla Isométrica en Pared',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer cuádriceps, glúteos e isquiotibiales de forma isométrica (sin movimiento), lo que es menos estresante para la articulación que las sentadillas dinámicas.

**Técnica:**
1. Apoye la espalda contra una pared y deslice hacia abajo hasta que las rodillas estén a 90 grados, como si estuviera en una silla invisible.
2. Asegúrese de que las rodillas estén directamente sobre los tobillos.
3. Mantenga la posición durante 30-60 segundos.
4. Realice 3 repeticiones.`
  },
  'sentadillas-parciales': {
    id: 'sentadillas-parciales',
    name: 'Sentadillas Parciales',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer los músculos de las piernas en un patrón funcional de sentadilla, pero en un rango de movimiento limitado y sin dolor.

**Técnica:**
1. De pie, con los pies a la anchura de los hombros.
2. Baje las caderas hacia atrás y hacia abajo, pero solo hasta un punto en el que no sienta dolor (ej. un cuarto o media sentadilla).
3. Mantenga el peso sobre los talones y la espalda recta.
4. Vuelva a la posición inicial.
5. Realice 2-3 series de 10-12 repeticiones.`
  },
  'movimiento-almeja': {
    id: 'movimiento-almeja',
    name: 'Movimiento de Almeja (Clamshell)',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Aislar y fortalecer el glúteo medio, un músculo vital para la estabilidad de la pelvis y la prevención del valgo de rodilla (rodillas hacia adentro).

**Técnica:**
1. Acuéstese de lado con las caderas y las rodillas flexionadas a 45 grados, con los pies juntos.
2. Manteniendo los pies en contacto, levante la rodilla superior hacia el techo sin que la pelvis se mueva o rote hacia atrás.
3. Baje lentamente.
4. Realice 2 series de 15-20 repeticiones por lado.

**Puntos Clave:**
- El movimiento debe ser pequeño y controlado, originado en la cadera.`
  },
  'inclinacion-pelvica': {
    id: 'inclinacion-pelvica',
    name: 'Inclinación Pélvica (Pelvic Tilt)',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Aprender a activar el músculo transverso del abdomen, el músculo más profundo de la faja abdominal y clave para la estabilidad lumbar.

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas y los pies en el suelo.
2. Contraiga suavemente los abdominales para aplanar la espalda contra el suelo, eliminando el arco lumbar.
3. Piense en "llevar el ombligo hacia la columna".
4. Mantenga la contracción durante 5 segundos sin contener la respiración.
5. Realice 2 series de 10-12 repeticiones.`
  },
  'perro-caza': {
    id: 'perro-caza',
    name: 'Perro de Caza (Bird-Dog)',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Entrenar al core para resistir las fuerzas de rotación y estabilizar la columna, al tiempo que se fortalece la espalda alta.

**Técnica:**
1. En posición de cuadrupedia, contraiga los abdominales para mantener la espalda plana.
2. Extienda lentamente el brazo derecho hacia adelante y la pierna izquierda hacia atrás simultáneamente, hasta que estén paralelos al suelo.
3. Vuelva a la posición inicial de forma controlada y repita con el otro lado.
4. Realice 2 series de 10 repeticiones por lado.

**Puntos Clave:**
- El desafío es mantener el torso completamente inmóvil, como si tuviera un vaso de agua en la espalda baja.`
  },
  'rodillas-al-pecho': {
    id: 'rodillas-al-pecho',
    name: 'Estiramiento de Rodillas al Pecho',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Aliviar la tensión en la zona lumbar y los glúteos.

**Técnica:**
1. Acuéstese boca arriba.
2. Lleve una rodilla hacia el pecho, sujetándola con las manos.
3. Sostenga durante 20-30 segundos, sintiendo un estiramiento suave.
4. Repita con la otra pierna. Puede llevar ambas rodillas al pecho simultáneamente para un estiramiento general.`
  },
  'torsion-tronco-supina': {
    id: 'torsion-tronco-supina',
    name: 'Torsión de Tronco Supina',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Promover una rotación suave y controlada de la columna lumbar para aliviar la rigidez.

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas y los brazos extendidos a los lados en forma de "T".
2. Manteniendo los hombros pegados al suelo, deixe caer lentamente ambas rodillas juntas hacia un lado.
3. Gire la cabeza en la dirección opuesta.
4. Mantenga durante 20-30 segundos y repita hacia el otro lado.`
  },
  'estiramiento-isquios-supino': {
    id: 'estiramiento-isquios-supino',
    name: 'Estiramiento de Isquiotibiales (Supino)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Estirar los isquiotibiales. La tensión en estos músculos puede afectar la posición de la pelvis y contribuir al dolor lumbar.

**Técnica:**
1. Acuéstese boca arriba. Eleve una pierna recta hacia el techo.
2. Sujete la pierna por detrás del muslo o la pantorrilla (o use una toalla).
3. Tire suavemente de ella hacia usted hasta sentir un estiramiento en la parte posterior del muslo.
4. Mantenga la rodilla lo más recta posible y la espalda baja en el suelo.
5. Sostenga durante 30 segundos por pierna.`
  },
  'estiramiento-piriforme': {
    id: 'estiramiento-piriforme',
    name: 'Estiramiento del Piriforme (Figura de 4)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Estirar el músculo piriforme en la cadera. Cuando está tenso, puede irritar el nervio ciático y causar dolor.

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas.
2. Cruce el tobillo derecho sobre la rodilla izquierda.
3. Sujete el muslo izquierdo con ambas manos y tire suavemente hacia el pecho.
4. Debería sentir un estiramiento profundo en el glúteo derecho.
5. Sostenga durante 30 segundos por lado.`
  },
  'test-flexion-hombro-pared': {
    id: 'test-flexion-hombro-pared',
    name: 'Test de Flexión de Hombro en Pared',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Evaluar la movilidad en flexión del hombro y la capacidad de extensión de la columna dorsal.

**Técnica:**
1. De pie con talones, glúteos, omóplatos y cabeza contra una pared.
2. Intente levantar ambos brazos rectos por encima de la cabeza hasta tocar la pared con los pulgares.

**Puntos Clave:**
- **Importante:** No permita que la espalda baja se separe de la pared o que las costillas se eleven.

**Resultados y Recomendaciones:**
- **Positivo (Movilidad Adecuada):** Puede tocar la pared con los pulgares sin compensar con la espalda baja.
- **Negativo (Movilidad Limitada):** No puede tocar la pared, o la espalda baja se arquea excesivamente. Esto indica una restricción en el hombro o la columna dorsal.
[RECOMMENDATIONS:test-flexion-hombro-pared]`
  },
  'test-cierre-espalda': {
    id: 'test-cierre-espalda',
    name: 'Test de Movilidad Rotacional (Test del Cierre)',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Evaluar la rotación interna y externa de la articulación del hombro.

**Técnica:**
1. De pie, intente tocarse las manos por detrás de la espalda.
2. Lleve un brazo por encima del hombro y el otro por debajo, por la zona lumbar.
3. Mida la distancia entre los dedos.
4. Repita invirtiendo los brazos.

**Resultados y Recomendaciones:**
- Una gran distancia entre los dedos o una asimetría significativa (más de 3-5 cm de diferencia entre lados) puede indicar una limitación.
[RECOMMENDATIONS:test-cierre-espalda]`
  },
  'test-flexion-tronco': {
    id: 'test-flexion-tronco',
    name: 'Test de Flexión de Tronco (Tocar Pies)',
    category: 'postura',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Evaluar la flexibilidad general de la cadena posterior (espalda baja e isquiotibiales) y la movilidad de la columna.

**Técnica:**
1. De pie, con los pies juntos y las rodillas completamente extendidas.
2. Inclínese hacia adelante lentamente e intente tocarse los dedos de los pies.

**Puntos Clave:**
- Observe la calidad del movimiento: ¿La curva de la columna es uniforme y distribuida?
- ¿Aparece dolor durante el movimiento? Una flexión suave y sin dolor indica una buena movilidad.

**Resultados y Recomendaciones:**
- Si no puede llegar a los pies y siente mucha tensión en la espalda baja o los isquiotibiales, es recomendable trabajar la flexibilidad de la cadena posterior.
[RECOMMENDATIONS:test-flexion-tronco]`
  },
  'estiramiento-trapecios-cuello': {
    id: 'estiramiento-trapecios-cuello',
    name: 'Estiramiento de Trapecios y Cuello',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Aliviar la tensión en los músculos del cuello y la parte superior de los hombros (trapecios).

**Técnica:**
1. Sentado con la espalda recta, incline suavemente la cabeza hacia el hombro derecho como si quisiera tocarlo con la oreja.
2. Para intensificar, sujete el borde de la silla con la mano izquierda o aplique una suave presión sobre la cabeza con la mano derecha.
3. Mantenga durante 20-30 segundos y repita hacia el otro lado.

**Puntos Clave:**
- No fuerce el movimiento; debe ser un estiramiento suave.`
  },
  'retracciones-escapulares': {
    id: 'retracciones-escapulares',
    name: 'Activación de Retracción Escapular',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Objetivo:**
Fortalecer y activar los músculos (romboides, trapecio medio) responsables de mantener los hombros en una posición neutra y saludable.

**Técnica:**
1. De pie o sentado con la espalda recta.
2. Junte los omóplatos (escápulas) como si quisiera sostener un lápiz entre ellos.
3. No encoja los hombros hacia las orejas.
4. Mantenga la contracción durante 3-5 segundos y relaje.
5. Realice 2 series de 15 repeticiones.`
  },
  'saltos-tijera': {
    id: 'saltos-tijera',
    name: 'Saltos de Tijera (Jumping Jacks)',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Comience de pie con los pies juntos y los brazos a los lados.
2. En un solo movimiento, salte separando los pies a la vez que levanta los brazos por encima de la cabeza.
3. Vuelva a la posición inicial con otro salto.
4. Mantenga un ritmo constante.`
  },
  'circulos-brazos': {
    id: 'circulos-brazos',
    name: 'Círculos con los Brazos',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, con los pies a la anchura de los hombros.
2. Extienda los brazos a los lados, paralelos al suelo.
3. Realice 10-15 círculos amplios y controlados hacia adelante.
4. Invierta el movimiento y realice 10-15 círculos hacia atrás.
**Puntos Clave:**
- Moviliza la articulación del hombro.`
  },
  'balanceos-piernas': {
    id: 'balanceos-piernas',
    name: 'Balanceos de Piernas',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Sosténgase de una pared o un objeto estable.
2. Balancee una pierna hacia adelante y hacia atrás de forma controlada 10-15 veces.
3. Gire 90 grados y balancee la misma pierna de lado a lado (cruzando por delante del cuerpo) 10-15 veces.
4. Repita con la otra pierna.
**Puntos Clave:**
- Mejora la movilidad dinámica de la cadera.`
  },
  'sentadilla-profunda-sin-peso': {
    id: 'sentadilla-profunda-sin-peso',
    name: 'Sentadilla Profunda (sin peso)',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, con los pies a la anchura de los hombros.
2. Baje las caderas hasta una posición de sentadilla profunda, manteniendo el torso erguido.
3. Mantenga la posición durante 20-30 segundos, puede mover suavemente las caderas de lado a lado.
**Puntos Clave:**
- Ayuda a mejorar la movilidad de cadera y tobillo.`
  },
  'zancada-con-torsion': {
    id: 'zancada-con-torsion',
    name: 'Zancada con Torsión',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Dé un paso largo hacia adelante con la pierna derecha, bajando a una posición de zancada.
2. Coloque la mano izquierda en el suelo, al lado del pie derecho.
3. Gire el torso hacia la derecha, levantando el brazo derecho hacia el techo.
4. Mantenga brevemente y regrese. Repita 5-8 veces por lado.
**Puntos Clave:**
- Moviliza la columna torácica y estira los flexores de la cadera.`
  },
  'pasos-altos-sin-salto': {
    id: 'pasos-altos-sin-salto',
    name: 'Pasos Altos (High Knees) sin salto',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, comience a marchar en el lugar.
2. Con cada paso, eleve la rodilla lo más alto posible, hacia el pecho.
3. Mantenga el torso erguido. Alterne las piernas a un ritmo controlado.
4. Realice 10-15 repeticiones por pierna.`
  },
  'patadas-gluteo-sin-salto': {
    id: 'patadas-gluteo-sin-salto',
    name: 'Patadas al Glúteo (Butt Kicks) sin salto',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, comience a marchar en el lugar.
2. Con cada paso, lleve el talón hacia el glúteo correspondiente.
3. Mantenga un movimiento fluido y controlado.
4. Realice 10-15 repeticiones por pierna.`
  },
  'circulos-rodillas': {
    id: 'circulos-rodillas',
    name: 'Círculos de Rodillas',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, con los pies juntos y las rodillas ligeramente flexionadas.
2. Coloque las manos sobre las rodillas.
3. Realice 10 círculos lentos con las rodillas en el sentido de las agujas del reloj.
4. Repita en sentido contrario.`
  },
  'trote-ligero': {
    id: 'trote-ligero',
    name: 'Trote Ligero',
    category: 'calentamiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Sistema Cardiovascular

**Técnica:**
1. Correr a un ritmo suave y constante.
2. Mantener una postura erguida, con los hombros relajados.
3. La respiración debe ser controlada y permitir mantener una conversación.

**Puntos Clave:**
- Cumple la función de "Elevar" (Raise) del modelo de calentamiento RAMP.
- El objetivo es aumentar la temperatura corporal y el flujo sanguíneo, no la velocidad ni la fatiga.
- Ideal para los primeros 5-10 minutos de un calentamiento.

**Progresiones:**
- Aumentar gradualmente la duración de 5 a 10 minutos.
- Aumentar ligeramente el ritmo sin perder la capacidad de hablar cómodamente.`
  },
  'estiramiento-isquios-sentado': {
    id: 'estiramiento-isquios-sentado',
    name: 'Estiramiento de Isquiotibiales (Sentado)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Siéntese en el suelo con una pierna extendida y la otra flexionada, con la planta del pie contra el muslo interno.
2. Inclínese hacia adelante desde la cadera sobre la pierna extendida hasta sentir un estiramiento.
3. Mantenga la espalda relativamente recta.
4. Sostenga durante 20-30 segundos por lado.`
  },
  'estiramiento-cuadriceps-pie': {
    id: 'estiramiento-cuadriceps-pie',
    name: 'Estiramiento de Cuádriceps (de pie)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. De pie, sujétese a una pared para mantener el equilibrio.
2. Agarre el tobillo y lleve el talón hacia el glúteo.
3. Mantenga las rodillas juntas y la cadera hacia adelante.
4. Sostenga durante 20-30 segundos por lado.`
  },
  'estiramiento-dorsal-nino': {
    id: 'estiramiento-dorsal-nino',
    name: 'Estiramiento de Dorsal (Postura del Niño)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Arrodíllese en el suelo y siéntese sobre los talones.
2. Inclínese hacia adelante, extendiendo los brazos frente a usted.
3. Baje el pecho hacia el suelo y relaje la cabeza.
4. Para enfatizar los dorsales, "camine" con las manos hacia un lado.
5. Sostenga durante 20-30 segundos.`
  },
  'estiramiento-triceps-cabeza': {
    id: 'estiramiento-triceps-cabeza',
    name: 'Estiramiento de Tríceps sobre la Cabeza',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Levante un brazo e flexione o codo, de modo que a mão caia por trás da cabeça.
2. Use a outra mão para puxar suavemente o codo para baixo e ligeiramente para o lado oposto.
3. Sostenga durante 20-30 segundos por lado.`
  },
  'estiramiento-flexor-cadera-arrodillado': {
    id: 'estiramiento-flexor-cadera-arrodillado',
    name: 'Estiramiento de Flexor de Cadera (Arrodillado)',
    category: 'estiramiento',
    isBodyweight: true,
    gifUrl: '',
    description: `**Técnica:**
1. Arrodíllese sobre una rodilla, con la otra pierna adelante y el pie plano en el suelo (posición de zancada).
2. Contraiga el glúteo de la pierna arrodillada y empuje suavemente la cadera hacia adelante.
3. Mantenga el torso erguido.
4. Sostenga durante 20-30 segundos por lado.`
  },
  'desplazamientos-laterales': {
    id: 'desplazamientos-laterales',
    name: 'Desplazamientos Laterales',
    category: 'cardio',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteos, Aductores, Abductores, Core

**Técnica:**
1. Adopte una posición atlética con las rodillas ligeramente flexionadas.
2. Desplácese lateralmente moviendo los pies rápidamente sin cruzarlos.
3. Mantenga el pecho erguido y la mirada al frente.

**Puntos Clave:**
- Mantenga las caderas bajas.
- Movimientos rápidos y controlados.

**Progresiones:**
**Principiante:** Paso lateral lento.
**Intermedio:** Aumentar la velocidad y la distancia.`
  },
  'puente-gluteos-suelo': {
    id: 'puente-gluteos-suelo',
    name: 'Puente de Glúteos en Suelo',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Isquiotibiales, Core

**Técnica:**
1. Acuéstese boca arriba con las rodillas flexionadas y los pies planos en el suelo.
2. Empuje con los talones para elevar las caderas hacia el techo.
3. Apriete los glúteos fuertemente en la parte superior durante 1 segundo.
4. Baje de forma controlada.

**Puntos Clave:**
- No arquee la espalda baja; el movimiento debe venir de las caderas.
- Mantenga las rodillas alineadas con los pies.

**Progresiones:**
**Principiante:** Dos piernas.
**Intermedio:** Una pierna o añadir peso.`
  },
  'monster-walks': {
    id: 'monster-walks',
    name: 'Monster Walks',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Medio, Glúteo Menor, Tensor de la Fascia Lata

**Técnica:**
1. Coloque una banda de resistencia alrededor de las rodillas o tobillos.
2. Adopte una posición de media sentadilla.
3. Camine lateralmente o hacia adelante/atrás manteniendo la tensión en la banda.
4. Mantenga las rodillas separadas en todo momento.

**Puntos Clave:**
- No deje que las rodillas colapsen hacia adentro.
- Mantenga la postura atlética.

**Progresiones:**
**Principiante:** Banda ligera sobre las rodillas.
**Intermedio:** Banda más pesada o en los tobillos.`
  },
  'worlds-greatest-stretch': {
    id: 'worlds-greatest-stretch',
    name: "World's Greatest Stretch",
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cadera, Isquiotibiales, Torso, Hombros (Movilidad Global)

**Técnica:**
1. Dé una zancada profunda hacia adelante.
2. Apoye la mano opuesta al pie delantero en el suelo.
3. Rote el torso y levante el otro brazo hacia el techo, siguiendo la mano con la mirada.
4. Regrese la mano al suelo y estire la pierna delantera para estirar el isquiotibial.

**Puntos Clave:**
- Respire profundamente durante el movimiento.
- Busque amplitud de movimiento, no velocidad.

**Progresiones:**
**Principiante:** Movimientos más cortos.
**Intermedio:** Mayor profundidad y rotación.`
  },
  'dorsiflexion-dinamica': {
    id: 'dorsiflexion-dinamica',
    name: 'Dorsiflexión Dinámica de Tobillo',
    category: 'movilidad',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Sóleo, Tibial Anterior (Movilidad de Tobillo)

**Técnica:**
1. Colóquese frente a una pared con un pie adelantado unos centímetros.
2. Empuje la rodilla hacia la pared sin levantar el talón del suelo.
3. Toque la pared con la rodilla (si es posible) y regrese.

**Puntos Clave:**
- El talón DEBE permanecer pegado al suelo.
- Movimiento rítmico y controlado.

**Progresiones:**
**Principiante:** Pie cerca de la pared.
**Intermedio:** Alejar el pie progresivamente.`
  },
  'sentadilla-bulgara-mancuernas': {
    id: 'sentadilla-bulgara-mancuernas',
    name: 'Sentadilla Búlgara con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Glúteo Mayor, Isquiotibiales

**Técnica:**
1. Coloque el empeine de un pie en un banco detrás de usted.
2. Sostenga mancuernas a los lados.
3. Baje las caderas flexionando la rodilla delantera y trasera.
4. Mantenga el torso ligeramente inclinado hacia adelante para activar el glúteo.
5. Empuje con el pie delantero para subir.

**Puntos Clave:**
- La rodilla trasera debe acercarse al suelo pero no golpearlo.
- Mantenga el peso en el talón delantero.

**Progresiones:**
**Principiante:** Sin peso.
**Intermedio:** Añadir mancuernas o barra.`
  },
  'hip-thrust-banda-mancuerna': {
    id: 'hip-thrust-banda-mancuerna',
    name: 'Hip Thrust con Banda y Mancuerna',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Isquiotibiales

**Técnica:**
1. Espalda alta apoyada en banco. Banda sobre las rodillas. Mancuerna sobre la pelvis.
2. Mantenga las rodillas abiertas contra la banda.
3. Empuje las caderas hacia arriba hasta la extensión completa.
4. Pausa de 2 segundos arriba apretando glúteos.

**Puntos Clave:**
- Barbilla pegada al pecho.
- No hiperextienda la espalda baja.
- Empuje desde los talones.

**Progresiones:**
**Principiante:** Solo peso corporal.
**Intermedio:** Aumentar peso de mancuerna o resistencia de banda.`
  },
  'elevacion-talones-unilateral-mancuerna': {
    id: 'elevacion-talones-unilateral-mancuerna',
    name: 'Elevación de Talones Unilateral',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Gemelos (Gastrocnemio)

**Técnica:**
1. De pie sobre un escalón o disco con un pie, sosteniendo una mancuerna.
2. Baje el talón lo más posible para estirar.
3. Pausa de 3 segundos en la parte baja.
4. Suba explosivamente hasta la punta del pie.

**Puntos Clave:**
- La pausa elimina el rebote elástico, obligando al músculo a trabajar.
- Rango de movimiento completo.

**Progresiones:**
**Principiante:** Dos piernas.
**Intermedio:** Una pierna con peso extra.`
  },
  'plancha-abdominal-isometrica': {
    id: 'plancha-abdominal-isometrica',
    name: 'Plancha Abdominal Isométrica',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Core (Transverso, Recto Abdominal), Hombros

**Técnica:**
1. Apóyese en antebrazos y puntas de pies. Cuerpo recto.
2. Apriete glúteos y cuádriceps.
3. Intente "arrastrar" los codos hacia los pies sin moverlos para generar tensión máxima.

**Puntos Clave:**
- No deje caer la cadera ni la levante demasiado.
- La tensión activa es clave, no solo "aguantar".

**Progresiones:**
**Principiante:** Rodillas apoyadas.
**Intermedio:** Plancha completa con tensión máxima.`
  },
  'remo-pecho-apoyado-mancuernas': {
    id: 'remo-pecho-apoyado-mancuernas',
    name: 'Remo Pecho Apoyado (Chest Supported Row)',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Romboides, Trapecio Medio/Inferior, Dorsal Ancho

**Técnica:**
1. Acuéstese boca abajo en un banco inclinado (30-45º).
2. Sostenga mancuernas con agarre neutro o prono.
3. Reme llevando los codos hacia atrás y arriba, abriéndolos unos 45 grados.
4. Apriete la espalda alta en la cima.

**Puntos Clave:**
- El pecho debe permanecer pegado al banco.
- Elimina el impulso y protege la espalda baja.

**Progresiones:**
**Principiante:** Peso ligero, enfoque en retracción.
**Intermedio:** Aumentar carga.`
  },
  'flexiones-banda': {
    id: 'flexiones-banda',
    name: 'Flexiones con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Pectoral Mayor, Tríceps, Deltoides Anterior

**Técnica:**
1. Pase la banda por detrás de la espalda y sujétela con las manos en el suelo.
2. Realice una flexión estándar.
3. La banda añade resistencia máxima al final del movimiento (bloqueo).

**Puntos Clave:**
- Mantenga el cuerpo en línea recta.
- Bloquee los codos al final para máxima contracción de tríceps.

**Progresiones:**
**Principiante:** Flexiones normales o rodillas.
**Intermedio:** Banda más gruesa.`
  },
  'face-pull-banda': {
    id: 'face-pull-banda',
    name: 'Face Pull con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Deltoides Posterior, Manguito Rotador, Trapecio

**Técnica:**
1. Ancle la banda a la altura de la cabeza o más arriba.
2. Tire de la banda hacia la cara, separando las manos.
3. Al final, rote externamente los hombros (pose de doble bíceps).

**Puntos Clave:**
- Los codos deben estar altos.
- Enfoque en la rotación externa y salud del hombro.

**Progresiones:**
**Principiante:** Banda ligera.
**Intermedio:** Banda media, pausas isométricas.`
  },
  'curl-biceps-inclinado-mancuernas': {
    id: 'curl-biceps-inclinado-mancuernas',
    name: 'Curl de Bíceps Inclinado',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Bíceps Braquial (Cabeza Larga)

**Técnica:**
1. Siéntese en banco inclinado (45-60º).
2. Deje colgar los brazos hacia atrás, perpendiculares al suelo.
3. Flexione los codos sin adelantarlos.

**Puntos Clave:**
- El codo debe permanecer fijo apuntando al suelo.
- Estiramiento máximo en la parte baja.

**Progresiones:**
**Principiante:** Menor inclinación.
**Intermedio:** Mayor inclinación (más estiramiento).`
  },
  'sentadilla-goblet-pesada': {
    id: 'sentadilla-goblet-pesada',
    name: 'Sentadilla Goblet Pesada',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Cuádriceps, Core, Glúteos

**Técnica:**
1. Sostenga una mancuerna pesada pegada al pecho.
2. Eleve los talones con discos pequeños (opcional para profundidad).
3. Baje profundo hasta que los codos toquen el interior de los muslos.
4. Suba verticalmente.

**Puntos Clave:**
- Torso vertical.
- Profundidad máxima.

**Progresiones:**
**Principiante:** Peso moderado.
**Intermedio:** Peso alto o chaleco lastrado.`
  },
  'zancadas-reversas-mancuernas': {
    id: 'zancadas-reversas-mancuernas',
    name: 'Zancadas Reversas con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Glúteo Mayor, Cuádriceps

**Técnica:**
1. De pie con mancuernas.
2. Dé un paso largo hacia atrás.
3. Baje hasta que la rodilla trasera roce el suelo.
4. Empuje con el talón delantero para volver.

**Puntos Clave:**
- Más seguro para las rodillas que las zancadas frontales.
- Torso ligeramente inclinado para énfasis en glúteo.

**Progresiones:**
**Principiante:** Sin peso.
**Intermedio:** Aumentar carga.`
  },
  'buenos-dias-banda': {
    id: 'buenos-dias-banda',
    name: 'Buenos Días con Banda',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Isquiotibiales, Glúteos, Erectores Espinales

**Técnica:**
1. Pise la banda y pase el otro extremo por detrás del cuello (sobre trapecios).
2. Empuje caderas hacia atrás (bisagra) con rodillas semi-rígidas.
3. Baje el torso hasta sentir gran estiramiento femoral.
4. Suba explosivamente contra la banda.

**Puntos Clave:**
- Espalda recta en todo momento.
- Movimiento de cadera, no de espalda.

**Progresiones:**
**Principiante:** Banda ligera.
**Intermedio:** Banda pesada.`
  },
  'gemelo-sentado-mancuernas': {
    id: 'gemelo-sentado-mancuernas',
    name: 'Gemelo Sentado con Mancuernas',
    category: 'fuerza',
    isBodyweight: false,
    gifUrl: '',
    description: `**Músculos trabajados:**
Sóleo

**Técnica:**
1. Sentado, coloque mancuernas sobre los muslos cerca de las rodillas.
2. Eleve los talones lo máximo posible.
3. Baje controladamente.

**Puntos Clave:**
- Al tener la rodilla flexionada, se desactiva el gastrocnemio y trabaja el sóleo.
- Altas repeticiones para quemazón.

**Progresiones:**
**Principiante:** Peso moderado.
**Intermedio:** Peso alto y pausas.`
  },
  'dead-bug-presion-constante': {
    id: 'dead-bug-presion-constante',
    name: 'Dead Bug con Presión Constante',
    category: 'fuerza',
    isBodyweight: true,
    gifUrl: '',
    description: `**Músculos trabajados:**
Core, Transverso Abdominal

**Técnica:**
1. Acuéstese boca arriba. Sujete una banda anclada detrás de la cabeza y jálela hasta el pecho (brazos rectos).
2. Mantenga esa tensión. Piernas a 90 grados.
3. Estire una pierna al ras del suelo y regrese.
4. La espalda baja NO debe despegarse del suelo.

**Puntos Clave:**
- La tensión de la banda activa el core superior.
- Control total de la zona lumbar.

**Progresiones:**
**Principiante:** Sin banda o rango de pierna más corto.
**Intermedio:** Banda fuerte y piernas rectas.`
  },
};
