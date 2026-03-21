export type AIServiceResult<T> = { success: true; data: T } | { success: false; error: string };

const stringifyError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
};

export const handleAIError = (
    error: unknown,
    context: string,
    defaultUserMessage: string
): { success: false; error: string } => {
    console.error(`Error en ${context}:`, error);

    const errorString = stringifyError(error);

    if (errorString.includes('429')) {
        return { success: false, error: 'Se ha excedido la cuota de la API. Por favor, espera un momento antes de reintentar.' };
    }

    if (errorString.toLowerCase().includes('network') || errorString.toLowerCase().includes('fetch failed')) {
        return { success: false, error: 'Error de red. Revisa tu conexión a internet e intenta de nuevo.' };
    }

    return { success: false, error: defaultUserMessage };
};
