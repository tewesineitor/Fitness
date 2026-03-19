
import React, { useMemo } from 'react';
import { HistorialDeSesionesEntry, RoutineTaskType, DesgloseCardioLibre } from '../../types';
import { XIcon, BookOpenIcon, StrengthIcon, YogaIcon, PostureIcon, CardioIcon, MeditationIcon, MountainIcon, FireIcon } from '../../components/icons';
import { vibrate } from '../../utils/helpers';

const getRoutineTypeIcon = (type: RoutineTaskType): React.ReactNode => {
    const props = { className: "w-6 h-6 text-brand-accent" };
    switch(type) {
        case 'strength': return <StrengthIcon {...props} />;
        case 'yoga': return <YogaIcon {...props} />;
        case 'posture': return <PostureIcon {...props} />;
        case 'cardio': return <CardioIcon {...props} />;
        case 'cardioLibre': return <CardioIcon {...props} />;
        case 'senderismo': return <MountainIcon {...props} />;
        case 'rucking': return <FireIcon {...props} />;
        case 'meditation': return <MeditationIcon {...props} />;
        default: return null;
    }
}

const SessionHistoryList: React.FC<{ history: HistorialDeSesionesEntry[], onBack: () => void, onViewSession: (session: HistorialDeSesionesEntry) => void }> = ({ history, onBack, onViewSession }) => {
    const groupedHistory = useMemo(() => {
        const groups = history.reduce((acc: Record<string, HistorialDeSesionesEntry[]>, session) => {
            const date = new Date(session.fecha_completado);
            const monthYear = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            if (!acc[capitalizedMonthYear]) {
                acc[capitalizedMonthYear] = [];
            }
            acc[capitalizedMonthYear].push(session);
            return acc;
        }, {});
        return Object.entries(groups);
    }, [history]);

    const getSessionDetails = (session: HistorialDeSesionesEntry) => {
        if (session.tipo_rutina === 'cardioLibre' || session.tipo_rutina === 'senderismo' || session.tipo_rutina === 'rucking') {
            const details = session.desglose_ejercicios[0] as DesgloseCardioLibre;
            if (!details || details.distance === 0 || details.duration === 0) {
                return `${session.duracion_total_min} min`;
            }
            const calories = details.calories ? ` • ${details.calories} kcal` : '';
            return `${details.distance.toFixed(2)} km${calories}`;
        }
        return `${session.duracion_total_min} min`;
    };

    return (
        <div className="animate-fade-in-up">
            <div className="relative z-10 p-4 sm:p-6 flex flex-col w-full max-w-3xl mx-auto">
                <header className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h1 className="text-3xl font-bold text-text-primary">Historial de Sesiones</h1>
                    <button onClick={onBack} className="p-2 bg-surface-bg border border-surface-border rounded-full shadow-sm" aria-label="Cerrar historial">
                        <XIcon className="h-6 w-6 text-text-secondary" />
                    </button>
                </header>
                <div className="pr-2">
                    {history.length > 0 ? (
                        groupedHistory.map(([monthYear, sessions]) => (
                            <div key={monthYear} className="mb-6">
                                <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 pl-2 sticky top-0 bg-bg-base/90 backdrop-blur-md py-2 z-10">{monthYear}</h2>
                                <div className="space-y-3">
                                    {sessions.map((session, index) => (
                                        <button 
                                            key={session.id_sesion} 
                                            onClick={() => { vibrate(5); onViewSession(session); }} 
                                            className="w-full text-left bg-surface-bg p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-surface-hover border border-surface-border shadow-sm active:scale-[0.98] animate-fade-in-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex-shrink-0 bg-surface-hover border border-surface-border p-3 rounded-xl">
                                                {getRoutineTypeIcon(session.tipo_rutina)}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="font-bold text-sm text-text-primary truncate uppercase">{session.nombre_rutina}</p>
                                                <p className="text-xs text-text-secondary mt-1">{new Date(session.fecha_completado).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <span className="text-xs font-bold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded border border-brand-accent/20 whitespace-nowrap">{getSessionDetails(session)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-surface-bg/20 rounded-3xl border border-dashed border-surface-border p-6">
                            <BookOpenIcon className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
                            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Tu Historial está Vacío</h3>
                            <p className="text-[9px] text-text-secondary/50 font-bold mt-1 uppercase tracking-widest max-w-[200px] mx-auto">Completa tu primera sesión para verla registrada aquí.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionHistoryList;
