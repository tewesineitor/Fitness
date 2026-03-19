
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, FoodItem, AddedFood, Exercise } from '../types';

/**
 * El cliente de la API de Google GenAI.
 * Se inicializa directamente asumiendo que `process.env.GEMINI_API_KEY` está disponible en el entorno de ejecución.
 * No es necesario llamar a una función de inicialización.
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type FoodCategory = FoodItem['category'];

// --- Type definitions for AI responses ---
export interface ExtractedNutritionData {
    serving_size_string: string | null;
    protein_g: number | null;
    carbs_g: number | null;
    fat_g: number | null;
}

export interface ExtractedActivityData {
    distance_km: number | null;
    duration_min: number | null;
    calories_kcal: number | null;
    avg_heart_rate_ppm: number | null;
    elevation_gain_m: number | null;
    weight_carried_kg?: number | null;
}

type AIServiceResult<T> = { success: true, data: T } | { success: false, error: string };

/**
 * Centralized error handler for AI service calls.
 * It logs the full error for debugging and returns a user-friendly message.
 * @param error The caught error object.
 * @param context A string identifying the function where the error occurred (for logging).
 * @param defaultUserMessage A fallback message specific to the function's context.
 * @returns A standardized error object.
 */
const handleAIError = (error: any, context: string, defaultUserMessage: string): { success: false, error: string } => {
    console.error(`Error en ${context}:`, error);

    const errorString = (error instanceof Error) ? error.message : JSON.stringify(error);

    if (errorString.includes('429')) {
        return { success: false, error: 'Se ha excedido la cuota de la API. Por favor, espera un momento antes de reintentar.' };
    }
    if (errorString.toLowerCase().includes('network') || errorString.toLowerCase().includes('fetch failed')) {
        return { success: false, error: 'Error de red. Revisa tu conexión a internet e intenta de nuevo.' };
    }
    
    // For other generic errors, use the context-specific default message
    return { success: false, error: defaultUserMessage };
};


// --- PRODUCT CATEGORIZATION ---
export const categorizeProductName = async (productName: string): Promise<AIServiceResult<FoodCategory | null>> => {
    try {
        if (!productName) {
            return { success: true, data: null };
        }
        const categories: FoodCategory[] = [
            'Grasas y Aceites',
            'Carnicería (Pollo)',
            'Carnicería (Res)',
            'Carnicería (Cerdo)',
            'Pescadería',
            'Huevo y Lácteos',
            'Embutidos',
            'Tortillas y Maíz',
            'Panadería',
            'Cereales y Tubérculos',
            'Legumbres',
            'Frutas',
            'Verduras',
            'Semillas y Frutos Secos',
            'Condimentos y Salsas',
            'Enlatados',
            'Calle (Antojitos)',
            'Calle (Caldos)',
            'Suplementos',
            'Untables / Extras'
        ];
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Clasifica el siguiente producto alimenticio en la categoría más apropiada de esta lista: ${categories.join(', ')}. Responde únicamente con el nombre de la categoría. Producto: "${productName}"`,
        });

        const category = response.text.trim() as FoodCategory;
        
        if (categories.includes(category)) {
            return { success: true, data: category };
        }
        console.warn(`AI returned an invalid category: "${category}"`);
        return { success: true, data: null }; // Success, but no valid category found

    } catch (e) {
        return handleAIError(e, 'categorizeProductName', 'No se pudo categorizar el producto. Inténtalo de nuevo.');
    }
};


// --- RECIPE GENERATION ---

export const generateRecipe = async (prompt: string, allFoodData: FoodItem[]): Promise<AIServiceResult<Omit<Recipe, 'id' | 'type' | 'imageUrl'>>> => {
    try {
        const availableFoodsString = allFoodData.map(f => `${f.id} | ${f.name} | 1 porción = ${f.standardPortion} (${f.rawWeightG || f.cookedWeightG || 'N/A'}g) | P:${f.macrosPerPortion.protein} C:${f.macrosPerPortion.carbs} F:${f.macrosPerPortion.fat}`).join('\n');
        
        const fullPrompt = `Crea una receta basada en la siguiente descripción del usuario: "${prompt}".
Usa SOLAMENTE los ingredientes de esta lista. Devuelve el ID del ingrediente y el número de porciones.
No inventes ingredientes que no estén en la lista.
Calcula los macros totales.
Proporciona instrucciones de preparación claras y concisas.
Genera un nombre creativo para la receta.

LISTA DE INGREDIENTES DISPONIBLES (ID | Nombre | Porción | Macros):
${availableFoodsString}

RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        mealType: { type: Type.STRING, enum: ['Desayuno', 'Almuerzo', 'Cena', 'Colación'] },
                        foods: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    foodItemId: { type: Type.STRING },
                                    portions: { type: Type.NUMBER }
                                }
                            }
                        },
                        preparation: { type: Type.STRING }
                    }
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);

        const foods: AddedFood[] = jsonResponse.foods.map((item: { foodItemId: string; portions: number }) => {
            const foodItem = allFoodData.find(f => f.id === item.foodItemId);
            if (!foodItem) {
                return null;
            }
            return { foodItem, portions: item.portions };
        }).filter((f: AddedFood | null): f is AddedFood => f !== null);

        if (foods.length === 0) {
            return { success: false, error: 'La IA no pudo encontrar ingredientes válidos para tu solicitud. Intenta con otros.' };
        }
        
        return {
            success: true,
            data: {
                name: jsonResponse.name,
                mealType: jsonResponse.mealType,
                foods,
                preparation: jsonResponse.preparation
            }
        };
    } catch (e) {
        return handleAIError(e, 'generateRecipe', 'No se pudo generar la receta. Intenta ser más específico.');
    }
};

// --- NUTRITION LABEL EXTRACTION ---

export const extractNutritionDataFromImage = async (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedNutritionData>> => {
    try {
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: "Analiza la imagen de esta tabla nutrimental. Enfócate exclusivamente en la columna etiquetada como 'por Porción'. Ignora las columnas 'por 100g' a menos que sea la única disponible. Si la tabla no especifica el tamaño de la porción en gramos (ej. '1 barrita'), y tú puedes inferir el peso por el empaque, úsalo. Si no es posible, deja el tamaño de la porción como una descripción. Extrae: 'serving_size_string' (ej. '1 barrita (45g)'), 'protein_g', 'carbs_g', 'fat_g'. Si un valor no está presente o es cero, devuélvelo como tal. Responde únicamente con un JSON válido." };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        serving_size_string: { type: Type.STRING, nullable: true },
                        protein_g: { type: Type.NUMBER, nullable: true },
                        carbs_g: { type: Type.NUMBER, nullable: true },
                        fat_g: { type: Type.NUMBER, nullable: true },
                    },
                },
            },
        });
        
        const data = JSON.parse(response.text);
        
        // Basic validation
        if (data.protein_g === null && data.carbs_g === null && data.fat_g === null) {
            return { success: false, error: 'No se pudieron extraer macros de la imagen. Intenta una foto más clara.' };
        }

        return { success: true, data };

    } catch (e) {
        return handleAIError(e, 'extractNutritionDataFromImage', "No se pudo analizar la imagen. Asegúrate de que sea clara y esté bien iluminada.");
    }
};

// --- AI NUTRITION ANALYSIS from OPEN FOOD FACTS DATA ---

export interface AnalyzedProductData {
    kcal: number | null;
    proteinG: number | null;
    carbsG: number | null;
    fatG: number | null;
    servingName: string | null;
    servingWeightG: number | null;
    category: FoodCategory | null;
    correctionApplied: boolean;
}

export const analyzeNutritionData = async (productData: any): Promise<AIServiceResult<AnalyzedProductData>> => {
    try {
        const prompt = `Actúa como un analista de datos nutricionales experto y escéptico. Tu tarea es interpretar los datos de Open Food Facts para UNA SOLA PORCIÓN y determinar si son confiables. Sigue este proceso:

**Regla Fundamental: Cómo determinar los Carbohidratos Disponibles (Netos).**
Tu misión más importante es calcular correctamente los carbohidratos disponibles. El valor de carbohidratos en los datos puede ser TOTAL o NETO. **NO ASUMAS, VERIFICA.**

1.  **Prioriza los datos por porción ('_serving').** Si no existen, usa los datos por 100g ('_100g') y aplica la misma lógica.
2.  Obtén los valores de proteína (P), carbohidratos (C), grasa (F), fibra (Fi) y calorías (Kcal_Producto) de la porción.
3.  **Si hay fibra (Fi > 0) y Kcal_Producto está disponible, haz esta prueba:**
    *   **Calorías A (asumiendo C es NETO):** \`(P * 4) + (C * 4) + (F * 9)\`
    *   **Calorías B (asumiendo C es TOTAL):** \`(P * 4) + ((C - Fi) * 4) + (F * 9)\`
    *   Compara las diferencias: \`Diff_A = abs(Calorías A - Kcal_Producto)\` y \`Diff_B = abs(Calorías B - Kcal_Producto)\`.
    *   **Si \`Diff_A\` es significativamente menor que \`Diff_B\` (idealmente cerca de cero),** C ya son los carbohidratos NETOS. Tu valor final de carbohidratos es \`C\`.
    *   **Si \`Diff_B\` es menor,** C son los carbohidratos TOTALES. Tu valor final de carbohidratos es \`C - Fi\`.
4.  **Si no hay fibra (Fi es 0 o nulo),** los carbohidratos siempre son netos. Tu valor final es \`C\`.
5.  **Si faltan las calorías del producto (\`Kcal_Producto\`),** no puedes verificar. En este caso, como regla de seguridad para productos de México/Europa, **NO RESTES LA FIBRA**. Asume que \`C\` ya son netos.

**Proceso de Análisis General:**

1.  Usa los datos por porción si existen. Si no, usa los de 100g y ajústalos con \`serving_quantity\` al final.
2.  Calcula los carbohidratos netos usando la **Regla Fundamental** de arriba.
3.  **VALIDACIÓN DE COHERENCIA:**
    a. Suma: \`proteínas\` + \`carbohidratos_netos\` + \`grasas\`. Si el total por 100g es > 105g, los datos son **CORRUPTOS**.
    b. Si las calorías que calculaste difieren más del 20% de las reportadas, marca los datos como **SOSPECHOSOS** (\`correction_applied: true\`).
4.  **Manejo de Datos Corruptos/Sospechosos.**
    *   Si los datos son corruptos o sospechosos, establece \`correction_applied\` en \`true\`. Intenta corregirlos si es obvio; si no, usa los valores originales pero con la advertencia.
5.  **Paso Final: Categorización y Formato.**
    *   Categoriza el producto.
    *   Devuelve todos los valores numéricos o \`null\`.

DATOS DEL PRODUCTO A ANALIZAR:
${JSON.stringify(productData, null, 2)}

RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        kcal: { type: Type.NUMBER, nullable: true },
                        protein_g: { type: Type.NUMBER, nullable: true },
                        carbs_g: { type: Type.NUMBER, nullable: true },
                        fat_g: { type: Type.NUMBER, nullable: true },
                        serving_name: { type: Type.STRING, nullable: true },
                        serving_weight_g: { type: Type.NUMBER, nullable: true },
                        category: { type: Type.STRING, nullable: true },
                        correction_applied: { type: Type.BOOLEAN },
                    },
                },
            },
        });
        const jsonResponse = JSON.parse(response.text);
        
        return {
            success: true,
            data: {
                kcal: jsonResponse.kcal,
                proteinG: jsonResponse.protein_g,
                carbsG: jsonResponse.carbs_g,
                fatG: jsonResponse.fat_g,
                servingName: jsonResponse.serving_name,
                servingWeightG: jsonResponse.serving_weight_g,
                category: jsonResponse.category,
                correctionApplied: jsonResponse.correction_applied,
            },
        };
    } catch (e) {
        return handleAIError(e, 'analyzeNutritionData', 'No se pudo analizar la información del producto.');
    }
};

// --- MISC AI ---
export const generateExerciseImage = async (exercise: Exercise): Promise<AIServiceResult<string>> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Vector illustration of a person performing the exercise "${exercise.name}". Minimalist, clean lines, on a dark background. The style should be modern and sleek, similar to a fitness app icon.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return { success: true, data: imageUrl };

    } catch (e) {
        return handleAIError(e, 'generateExerciseImage', 'No se pudo generar la imagen del ejercicio.');
    }
};

export const extractRunDataFromImage = async (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> => {
    try {
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: `Analiza esta imagen de un resumen de carrera. Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
Responde únicamente con el JSON.` };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        distance_km: { type: Type.NUMBER, nullable: true },
                        duration_min: { type: Type.NUMBER, nullable: true },
                        calories_kcal: { type: Type.NUMBER, nullable: true },
                        avg_heart_rate_ppm: { type: Type.NUMBER, nullable: true },
                        elevation_gain_m: { type: Type.NUMBER, nullable: true },
                    },
                },
            },
        });
        
        const data = JSON.parse(response.text);
        
        if (data.distance_km === null && data.duration_min === null) {
            return { success: false, error: 'No se pudieron extraer datos clave. Asegúrate que la distancia y duración son visibles.' };
        }

        return { success: true, data };

    } catch (e) {
        return handleAIError(e, 'extractRunDataFromImage', "No se pudo analizar la imagen. Intenta con una captura de pantalla más clara.");
    }
}

export const extractHikeDataFromImage = async (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> => {
    try {
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: `Analiza esta imagen de un resumen de senderismo (hike). Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
Responde únicamente con el JSON.` };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        distance_km: { type: Type.NUMBER, nullable: true },
                        duration_min: { type: Type.NUMBER, nullable: true },
                        calories_kcal: { type: Type.NUMBER, nullable: true },
                        avg_heart_rate_ppm: { type: Type.NUMBER, nullable: true },
                        elevation_gain_m: { type: Type.NUMBER, nullable: true },
                    },
                },
            },
        });
        
        const data = JSON.parse(response.text);
        
        if (data.distance_km === null && data.duration_min === null) {
            return { success: false, error: 'No se pudieron extraer datos clave. Asegúrate que la distancia y duración son visibles.' };
        }

        return { success: true, data };

    } catch (e) {
        return handleAIError(e, 'extractHikeDataFromImage', "No se pudo analizar la imagen. Intenta con una captura de pantalla más clara.");
    }
}

export const extractRuckingDataFromImage = async (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> => {
    try {
        const imagePart = { inlineData: { data: base64Image, mimeType } };
        const textPart = { text: `Analiza esta imagen de un resumen de rucking (caminata con peso). Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
- Peso cargado en la mochila en kilogramos (weight_carried_kg).
Responde únicamente con el JSON.` };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        distance_km: { type: Type.NUMBER, nullable: true },
                        duration_min: { type: Type.NUMBER, nullable: true },
                        calories_kcal: { type: Type.NUMBER, nullable: true },
                        avg_heart_rate_ppm: { type: Type.NUMBER, nullable: true },
                        elevation_gain_m: { type: Type.NUMBER, nullable: true },
                        weight_carried_kg: { type: Type.NUMBER, nullable: true },
                    },
                },
            },
        });
        
        const data = JSON.parse(response.text);
        
        if (data.distance_km === null && data.duration_min === null) {
            return { success: false, error: 'No se pudieron extraer datos clave. Asegúrate que la distancia y duración son visibles.' };
        }

        return { success: true, data };

    } catch (e) {
        return handleAIError(e, 'extractRuckingDataFromImage', "No se pudo analizar la imagen. Intenta con una captura de pantalla más clara.");
    }
}
