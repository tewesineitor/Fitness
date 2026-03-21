import type { Exercise } from '../../types';
import { getAI } from './aiClient';
import { handleAIError, type AIServiceResult } from './aiErrors';

export const generateExerciseImage = async (exercise: Exercise): Promise<AIServiceResult<string>> => {
    try {
        const response = await getAI().models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `Vector illustration of a person performing the exercise "${exercise.name}". Minimalist, clean lines, on a dark background. The style should be modern and sleek, similar to a fitness app icon.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return { success: true, data: `data:image/jpeg;base64,${base64ImageBytes}` };
    } catch (error) {
        return handleAIError(error, 'generateExerciseImage', 'No se pudo generar la imagen del ejercicio.');
    }
};
