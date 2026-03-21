
import * as React from 'react';
import { AppContext } from '../contexts';
import { HistorialDeSesionesEntry, RoutineTaskType } from '../types';
import { ChevronRightIcon, CameraIcon, StrengthIcon, YogaIcon, PostureIcon, CardioIcon, MeditationIcon, MountainIcon } from './icons';
import Button from './Button';

// Widget Wrapper - Clean Utility Style
const WidgetCard: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => (
    <div className={`bg-surface-bg p-6 rounded-2xl flex flex-col justify-between h-full border border-surface-border shadow-lg relative overflow-hidden group ${className}`}>
        {children}
    </div>
);

// 2. Gallery Widget (Visual Intel)
export const GalleryWidget: React.FC<{ onShowGallery: () => void; title?: string }> = ({ onShowGallery, title = "Físico" }) => {
    const { state } = React.useContext(AppContext)!;
    const { metricHistory } = state.progress;

    const lastPhoto = React.useMemo(() => {
        const photos = metricHistory
            .filter(entry => entry.url_foto)
            .sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime());
        return photos.length > 0 ? photos[0] : null;
    }, [metricHistory]);

    return (
        <WidgetCard>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-heading font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <CameraIcon className="w-5 h-5 text-brand-accent" />
                        {title}
                    </h2>
                </div>
                <div className="flex justify-center items-center">
                    {lastPhoto ? (
                        <div className="relative w-full aspect-[4/5] sm:aspect-video bg-black rounded-2xl overflow-hidden border border-surface-border/50 shadow-inner group/img cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-95" onClick={onShowGallery}>
                            <img src={lastPhoto.url_foto} alt="Última foto" className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest bg-surface-bg/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                    {new Date(lastPhoto.fecha_registro).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-surface-bg/75 backdrop-blur-md flex items-center justify-center border border-white/20 text-text-primary group-hover/img:bg-surface-hover group-hover/img:border-brand-accent/20 transition-colors">
                                    <ChevronRightIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full aspect-[4/5] sm:aspect-video rounded-2xl border-2 border-dashed border-surface-border bg-surface-hover/30 cursor-pointer hover:bg-surface-hover/50 transition-colors" onClick={onShowGallery}>
                             <CameraIcon className="w-8 h-8 text-text-secondary/40 mb-3"/>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-70">Añadir Foto</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
        </WidgetCard>
    );
};

// Helper for history widget icon
const getRoutineTypeIcon = (type: RoutineTaskType): React.ReactNode => {
    const props = { className: "w-5 h-5" };
    switch(type) {
        case 'strength': return <StrengthIcon {...props} />;
        case 'yoga': return <YogaIcon {...props} />;
        case 'posture': return <PostureIcon {...props} />;
        case 'cardio': return <CardioIcon {...props} />;
        case 'cardioLibre': return <CardioIcon {...props} />;
        case 'senderismo': return <MountainIcon {...props} />;
        case 'meditation': return <MeditationIcon {...props} />;
        default: return null;
    }
}

// 4. History Widget (Logs)
export const HistoryWidget: React.FC<{ onShowHistoryList: () => void; onViewHistoricalSession: (session: HistorialDeSesionesEntry) => void; title?: string }> = ({ onShowHistoryList, onViewHistoricalSession, title = "Bitácora" }) => {
    const { state } = React.useContext(AppContext)!;
    const { historialDeSesiones } = state.workout;

    const recentSessions = React.useMemo(() => {
        return historialDeSesiones.slice(0, 4);
    }, [historialDeSesiones]);

    return (
        <WidgetCard>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-heading font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <StrengthIcon className="w-5 h-5 text-brand-accent" />
                        {title}
                    </h2>
                    <Button variant="tertiary" size="small" onClick={onShowHistoryList} className="!p-0 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-brand-accent transition-colors">
                        Ver Todo
                    </Button>
                </div>
                
                <div className="flex-grow flex flex-col justify-center">
                    {recentSessions.length > 0 ? (
                        <div className="space-y-3">
                            {recentSessions.map(session => (
                                <button key={session.id_sesion} onClick={() => onViewHistoricalSession(session)} className="w-full flex items-center gap-4 p-3 sm:p-4 bg-surface-hover/30 border border-surface-border/50 rounded-2xl hover:bg-surface-hover hover:border-surface-border transition-all duration-300 active:scale-95 group/btn">
                                    <div className="w-10 h-10 rounded-xl bg-surface-bg border border-surface-border flex items-center justify-center text-text-secondary group-hover/btn:text-brand-accent group-hover/btn:border-brand-accent/30 group-hover/btn:bg-brand-accent/10 transition-all duration-300">
                                        {getRoutineTypeIcon(session.tipo_rutina)}
                                    </div>
                                    <div className="flex-grow text-left flex flex-col justify-center min-w-0">
                                         <p className="font-bold text-xs sm:text-sm text-text-primary uppercase tracking-wide truncate group-hover/btn:text-brand-accent transition-colors">{session.nombre_rutina}</p>
                                         <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-0.5">{new Date(session.fecha_completado).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                                    </div>
                                    <ChevronRightIcon className="w-4 h-4 text-text-secondary group-hover/btn:text-text-primary group-hover/btn:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-text-secondary text-[10px] font-bold uppercase tracking-wider py-10 border-2 border-dashed border-surface-border rounded-2xl bg-surface-hover/30 opacity-70">
                            Aún no hay registros
                        </div>
                    )}
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-accent/10 transition-colors duration-500"></div>
        </WidgetCard>
    );
};

