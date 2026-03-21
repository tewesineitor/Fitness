import { Type } from '@google/genai';
import { getAI } from './aiClient';
import { handleAIError, type AIServiceResult } from './aiErrors';
import type { ExtractedActivityData } from './aiTypes';

const extractActivityDataFromImage = async (
    base64Image: string,
    mimeType: string,
    context: string,
    instructions: string,
    includesWeight = false
): Promise<AIServiceResult<ExtractedActivityData>> => {
    try {
        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType } },
                    { text: instructions },
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        distance_km: { type: Type.NUMBER, nullable: true },
                        duration_min: { type: Type.NUMBER, nullable: true },
                        calories_kcal: { type: Type.NUMBER, nullable: true },
                        avg_heart_rate_ppm: { type: Type.NUMBER, nullable: true },
                        elevation_gain_m: { type: Type.NUMBER, nullable: true },
                        ...(includesWeight ? { weight_carried_kg: { type: Type.NUMBER, nullable: true } } : {}),
                    },
                },
            },
        });

        const data = JSON.parse(response.text) as ExtractedActivityData;

        if (data.distance_km === null && data.duration_min === null) {
            return { success: false, error: 'No se pudieron extraer datos clave. Asegúrate que la distancia y duración son visibles.' };
        }

        return { success: true, data };
    } catch (error) {
        return handleAIError(error, context, 'No se pudo analizar la imagen. Intenta con una captura de pantalla más clara.');
    }
};

export const extractRunDataFromImage = (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> =>
    extractActivityDataFromImage(
        base64Image,
        mimeType,
        'extractRunDataFromImage',
        `Analiza esta imagen de un resumen de carrera. Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
Responde únicamente con el JSON.`
    );

export const extractHikeDataFromImage = (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> =>
    extractActivityDataFromImage(
        base64Image,
        mimeType,
        'extractHikeDataFromImage',
        `Analiza esta imagen de un resumen de senderismo (hike). Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
Responde únicamente con el JSON.`
    );

export const extractRuckingDataFromImage = (base64Image: string, mimeType: string): Promise<AIServiceResult<ExtractedActivityData>> =>
    extractActivityDataFromImage(
        base64Image,
        mimeType,
        'extractRuckingDataFromImage',
        `Analiza esta imagen de un resumen de rucking (caminata con peso). Extrae los siguientes datos numéricos. Si un dato no está presente, déjalo como null:
- Distancia en kilómetros (distance_km).
- Duración total en minutos (duration_min).
- Calorías quemadas (calories_kcal).
- Frecuencia cardíaca promedio en PPM (avg_heart_rate_ppm).
- Ganancia de elevación en metros (elevation_gain_m).
- Peso cargado en la mochila en kilogramos (weight_carried_kg).
Responde únicamente con el JSON.`,
        true
    );
