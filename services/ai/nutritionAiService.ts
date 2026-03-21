import { Type } from '@google/genai';
import type { AddedFood, FoodCategory, FoodItem, Recipe } from '../../types';
import { getAI } from './aiClient';
import { handleAIError, type AIServiceResult } from './aiErrors';
import type {
    AnalyzedProductData,
    AnalyzedProductResponse,
    ExtractedNutritionData,
    GeneratedRecipeResponse,
    OpenFoodFactsProductData,
} from './aiTypes';

const FOOD_CATEGORIES: FoodCategory[] = [
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
    'Untables / Extras',
];

export const categorizeProductName = async (productName: string): Promise<AIServiceResult<FoodCategory | null>> => {
    try {
        if (!productName) {
            return { success: true, data: null };
        }

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Clasifica el siguiente producto alimenticio en la categoría más apropiada de esta lista: ${FOOD_CATEGORIES.join(', ')}. Responde únicamente con el nombre de la categoría. Producto: "${productName}"`,
        });

        const category = response.text.trim() as FoodCategory;

        if (FOOD_CATEGORIES.includes(category)) {
            return { success: true, data: category };
        }

        console.warn(`AI returned an invalid category: "${category}"`);
        return { success: true, data: null };
    } catch (error) {
        return handleAIError(error, 'categorizeProductName', 'No se pudo categorizar el producto. Inténtalo de nuevo.');
    }
};

export const generateRecipe = async (
    prompt: string,
    allFoodData: FoodItem[]
): Promise<AIServiceResult<Omit<Recipe, 'id' | 'type' | 'imageUrl'>>> => {
    try {
        const availableFoodsString = allFoodData
            .map(
                (food) =>
                    `${food.id} | ${food.name} | 1 porción = ${food.standardPortion} (${food.rawWeightG || food.cookedWeightG || 'N/A'}g) | P:${food.macrosPerPortion.protein} C:${food.macrosPerPortion.carbs} F:${food.macrosPerPortion.fat}`
            )
            .join('\n');

        const fullPrompt = `Crea una receta basada en la siguiente descripción del usuario: "${prompt}".
Usa SOLAMENTE los ingredientes de esta lista. Devuelve el ID del ingrediente y el número de porciones.
No inventes ingredientes que no estén en la lista.
Calcula los macros totales.
Proporciona instrucciones de preparación claras y concisas.
Genera un nombre creativo para la receta.

LISTA DE INGREDIENTES DISPONIBLES (ID | Nombre | Porción | Macros):
${availableFoodsString}

RESPONDE ÚNICAMENTE CON UN JSON VÁLIDO.`;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: 'application/json',
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
                                    portions: { type: Type.NUMBER },
                                },
                            },
                        },
                        preparation: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonResponse = JSON.parse(response.text) as GeneratedRecipeResponse;
        const foods: AddedFood[] = jsonResponse.foods
            .map((item) => {
                const foodItem = allFoodData.find((food) => food.id === item.foodItemId);
                return foodItem ? { foodItem, portions: item.portions } : null;
            })
            .filter((food): food is AddedFood => food !== null);

        if (foods.length === 0) {
            return { success: false, error: 'La IA no pudo encontrar ingredientes válidos para tu solicitud. Intenta con otros.' };
        }

        return {
            success: true,
            data: {
                name: jsonResponse.name,
                mealType: jsonResponse.mealType,
                foods,
                preparation: jsonResponse.preparation,
            },
        };
    } catch (error) {
        return handleAIError(error, 'generateRecipe', 'No se pudo generar la receta. Intenta ser más específico.');
    }
};

export const extractNutritionDataFromImage = async (
    base64Image: string,
    mimeType: string
): Promise<AIServiceResult<ExtractedNutritionData>> => {
    try {
        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType } },
                    {
                        text: "Analiza la imagen de esta tabla nutrimental. Enfócate exclusivamente en la columna etiquetada como 'por Porción'. Ignora las columnas 'por 100g' a menos que sea la única disponible. Si la tabla no especifica el tamaño de la porción en gramos (ej. '1 barrita'), y tú puedes inferir el peso por el empaque, úsalo. Si no es posible, deja el tamaño de la porción como una descripción. Extrae: 'serving_size_string' (ej. '1 barrita (45g)'), 'protein_g', 'carbs_g', 'fat_g'. Si un valor no está presente o es cero, devuélvelo como tal. Responde únicamente con un JSON válido.",
                    },
                ],
            },
            config: {
                responseMimeType: 'application/json',
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

        const data = JSON.parse(response.text) as ExtractedNutritionData;

        if (data.protein_g === null && data.carbs_g === null && data.fat_g === null) {
            return { success: false, error: 'No se pudieron extraer macros de la imagen. Intenta una foto más clara.' };
        }

        return { success: true, data };
    } catch (error) {
        return handleAIError(
            error,
            'extractNutritionDataFromImage',
            'No se pudo analizar la imagen. Asegúrate de que sea clara y esté bien iluminada.'
        );
    }
};

export const analyzeNutritionData = async (
    productData: OpenFoodFactsProductData
): Promise<AIServiceResult<AnalyzedProductData>> => {
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

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
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

        const jsonResponse = JSON.parse(response.text) as AnalyzedProductResponse;

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
    } catch (error) {
        return handleAIError(error, 'analyzeNutritionData', 'No se pudo analizar la información del producto.');
    }
};
