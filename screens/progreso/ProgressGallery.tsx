import React, { useState, useRef, TouchEvent, MouseEvent, useContext, useMemo, useEffect } from 'react';
import { HistorialDeMetricasEntry } from '../../types';
import { XIcon, CameraIcon, SwitchHorizontalIcon } from '../../components/icons';
import { AppContext } from '../../contexts';
import * as actions from '../../actions';
import Button from '../../components/Button';
import ChipButton from '../../components/ChipButton';
import Tag from '../../components/Tag';

const ProgressGallery: React.FC<{ photos: HistorialDeMetricasEntry[], onClose: () => void }> = ({ photos, onClose }) => {
    const { dispatch } = useContext(AppContext)!;
    const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
    const [timeFilter, setTimeFilter] = useState<'all' | '1m' | '3m' | '6m' | '1y'>('all');
    const timeFilters: { id: typeof timeFilter; label: string }[] = [
        { id: 'all', label: 'TODO' },
        { id: '1m', label: '1M' },
        { id: '3m', label: '3M' },
        { id: '6m', label: '6M' },
        { id: '1y', label: '1A' },
    ];
    
    const filteredPhotos = useMemo(() => {
        if (timeFilter === 'all') return photos;
        const now = new Date();
        const filterDate = new Date();
        if (timeFilter === '1m') filterDate.setMonth(now.getMonth() - 1);
        else if (timeFilter === '3m') filterDate.setMonth(now.getMonth() - 3);
        else if (timeFilter === '6m') filterDate.setMonth(now.getMonth() - 6);
        else if (timeFilter === '1y') filterDate.setFullYear(now.getFullYear() - 1);
        
        return photos.filter(p => new Date(p.fecha_registro) >= filterDate);
    }, [photos, timeFilter]);

    const [beforeIndex, setBeforeIndex] = useState(0);
    const [afterIndex, setAfterIndex] = useState(filteredPhotos.length > 1 ? filteredPhotos.length - 1 : 0);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [selectorMode, setSelectorMode] = useState<'before' | 'after'>('after');
    const containerRef = useRef<HTMLDivElement>(null);

    const beforePhoto = filteredPhotos[beforeIndex];
    const afterPhoto = filteredPhotos[afterIndex];

    // Reset indices when filter changes
    useEffect(() => {
        setBeforeIndex(0);
        setAfterIndex(filteredPhotos.length > 1 ? filteredPhotos.length - 1 : 0);
    }, [filteredPhotos]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                dispatch(actions.addMetricEntry({
                    date: new Date().toISOString().split('T')[0],
                    photoUrl: base64String,
                    weight: photos.length > 0 ? photos[photos.length - 1].peso_kg : 70,
                    waist: photos.length > 0 ? photos[photos.length - 1].cintura_cm : 80,
                    hips: photos.length > 0 ? photos[photos.length - 1].caderas_cm : 95
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSliderMove = (clientX: number) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setSliderPosition(pos);
    };
    
    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => handleSliderMove(e.touches[0].clientX);
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => handleSliderMove(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleSelectThumbnail = (index: number) => {
        if (selectorMode === 'before') {
            if(index >= afterIndex) {
                setBeforeIndex(afterIndex > 0 ? afterIndex - 1 : 0);
            } else {
                setBeforeIndex(index);
            }
            setSelectorMode('after');
        } else {
             if(index <= beforeIndex) {
                setAfterIndex(beforeIndex < photos.length - 1 ? beforeIndex + 1 : photos.length - 1);
            } else {
                setAfterIndex(index);
            }
        }
    };
    
    const change = {
        weight: (afterPhoto?.peso_kg ?? 0) - (beforePhoto?.peso_kg ?? 0),
        waist: (afterPhoto?.cintura_cm ?? 0) - (beforePhoto?.cintura_cm ?? 0),
        hips: (afterPhoto?.caderas_cm ?? 0) - (beforePhoto?.caderas_cm ?? 0),
    };

    const handlePhotoClick = (index: number) => {
        if (photos.length < 2) return;
        setAfterIndex(index);
        setBeforeIndex(Math.max(0, index - 1));
        setViewMode('compare');
    };

    return (
        <div className="animate-fade-in-up flex flex-col h-full overflow-hidden">
            <header className="flex justify-between items-center p-4 sm:p-6 z-30 sticky top-0">
                <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-black text-text-primary uppercase tracking-tight leading-none">
                        {viewMode === 'grid' ? 'Galería' : 'Comparar'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                            {filteredPhotos.length} Registros
                        </p>
                    </div>
                </div>

                {viewMode === 'grid' && (
                    <div className="hidden sm:flex items-center gap-1 bg-surface-hover/50 p-1 rounded-full border border-surface-border/50">
                        {timeFilters.map((filter) => (
                            <ChipButton
                                key={filter.id}
                                onClick={() => setTimeFilter(filter.id)}
                                active={timeFilter === filter.id}
                                tone="accent"
                                size="small"
                            >
                                {filter.label}
                            </ChipButton>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center gap-2 sm:gap-4">
                    {viewMode === 'compare' && (
                        <Button onClick={() => setViewMode('grid')} variant="secondary" size="small">
                            Volver
                        </Button>
                    )}

                    <button 
                        onClick={onClose} 
                        className="p-2.5 bg-surface-hover border border-surface-border rounded-xl hover:bg-red-500/10 hover:border-red-500/30 group transition-all active:scale-95 shadow-sm" 
                        aria-label="Cerrar galería"
                    >
                        <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-text-secondary group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto hide-scrollbar p-4 sm:p-8">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        <label className="relative aspect-[3/4] rounded-2xl overflow-hidden group border-2 border-dashed border-surface-border hover:border-brand-accent/50 transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer bg-surface-hover/20 shadow-sm hover:shadow-brand-accent/20">
                            <div className="w-12 h-12 rounded-2xl bg-surface-bg border border-surface-border flex items-center justify-center mb-3 group-hover:bg-brand-accent/10 group-hover:border-brand-accent/30 transition-all shadow-sm group-active:scale-90">
                                <CameraIcon className="w-6 h-6 text-brand-accent animate-pulse" />
                            </div>
                            <span className="text-[10px] font-bold text-text-secondary group-hover:text-white uppercase tracking-widest transition-colors">Añadir Foto</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </label>
                        
                        {filteredPhotos.map((photo, index) => (
                            <button 
                                key={photo.id_registro} 
                                onClick={() => handlePhotoClick(index)}
                                className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-surface-border hover:border-brand-accent/50 transition-all active:scale-95 shadow-sm hover:shadow-brand-accent/20"
                            >
                                <img src={photo.url_foto} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-mono text-white border border-white/10">
                                        {formatDate(photo.fecha_registro)}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
                        {/* Main Comparison View */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex bg-surface-hover/50 p-1 rounded-full border border-surface-border/50 gap-1">
                                    <ChipButton
                                        onClick={() => setSelectorMode('before')}
                                        active={selectorMode === 'before'}
                                        tone="neutral"
                                        size="small"
                                    >
                                        Seleccionar Antes
                                    </ChipButton>
                                    <ChipButton
                                        onClick={() => setSelectorMode('after')}
                                        active={selectorMode === 'after'}
                                        tone="accent"
                                        size="small"
                                    >
                                        Seleccionar Después
                                    </ChipButton>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                    <span>Desliza para comparar</span>
                                    <SwitchHorizontalIcon className="w-3 h-3" />
                                </div>
                            </div>

                            <div 
                                ref={containerRef}
                                className="relative w-full aspect-[3/4] sm:aspect-video max-h-[60vh] rounded-[2.5rem] overflow-hidden bg-black cursor-ew-resize select-none shadow-2xl group"
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onTouchStart={() => setIsDragging(true)}
                                onTouchEnd={handleMouseUp}
                                onTouchMove={handleTouchMove}
                            >
                                {/* Before Image & Data */}
                                <div className="absolute inset-0">
                                    <img src={beforePhoto.url_foto} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-8 left-8 z-20">
                                        <Tag variant="overlay" size="lg" className="!tracking-[0.3em] !font-black">
                                            Antes
                                        </Tag>
                                    </div>
                                    <div className="absolute bottom-8 left-8 z-20">
                                        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                                            <p className="text-lg font-black text-white leading-none">{beforePhoto.peso_kg} <span className="text-xs text-white/60 font-sans">KG</span></p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">{formatDate(beforePhoto.fecha_registro)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* After Image & Data */}
                                <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                                    <img src={afterPhoto.url_foto} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-8 right-8 z-20">
                                        <div className="bg-brand-accent/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-2xl">
                                            <p className="text-[10px] font-black text-black uppercase tracking-[0.3em]">DESPUÉS</p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 right-8 z-20 text-right">
                                        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                                            <p className="text-lg font-black text-white leading-none">{afterPhoto.peso_kg} <span className="text-xs text-white/60 font-sans">KG</span></p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">{formatDate(afterPhoto.fecha_registro)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Slider Handle */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-white/30 backdrop-blur-sm cursor-ew-resize z-30 transition-transform" style={{ left: `${sliderPosition}%` }}>
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.6)] ring-[12px] ring-black/30 backdrop-blur-md transition-all duration-300 group-hover:scale-110 active:scale-90 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                                        <SwitchHorizontalIcon className="w-7 h-7 text-black transition-transform group-active:rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Change Summary */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { label: 'Peso', val: change.weight, unit: 'kg' },
                                { label: 'Cintura', val: change.waist, unit: 'cm' },
                                { label: 'Caderas', val: change.hips, unit: 'cm' }
                            ].map((item) => (
                                <div key={item.label} className="bg-surface-hover/20 p-4 rounded-2xl border border-surface-border shadow-sm backdrop-blur-sm flex flex-col items-center justify-center">
                                    <p className={`font-black text-xl sm:text-2xl tracking-tight leading-none ${item.val <= 0 ? 'text-brand-accent' : 'text-red-400'}`}>
                                        {item.val > 0 ? '+' : ''}{item.val.toFixed(1)}
                                    </p>
                                    <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-2">{item.label} ({item.unit})</p>
                                </div>
                            ))}
                        </div>

                        {/* Filmstrip Timeline */}
                        <div className="mt-4">
                            <div className="flex gap-3 overflow-x-auto pb-6 hide-scrollbar px-1">
                                {filteredPhotos.map((photo, index) => (
                                    <button 
                                        key={photo.id_registro} 
                                        onClick={() => handleSelectThumbnail(index)} 
                                        className={`flex-shrink-0 relative transition-all duration-500 active:scale-90 opacity-40 hover:opacity-100 ${index === beforeIndex || index === afterIndex ? 'scale-110 z-10 !opacity-100' : ''}`}
                                    >
                                        <img src={photo.url_foto} alt="" className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-xl shadow-lg border border-white/5" />
                                        <div className={`absolute inset-0 rounded-xl ring-2 transition-all duration-500 ${
                                            index === beforeIndex ? 'ring-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' :
                                            index === afterIndex ? 'ring-brand-accent shadow-[0_0_15px_rgba(var(--color-brand-accent-rgb),0.3)]' : 'ring-transparent'
                                        }`}></div>
                                        {(index === beforeIndex || index === afterIndex) && (
                                            <div className={`absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-[10px] font-black rounded-full shadow-lg z-20 ${index === beforeIndex ? 'bg-white text-black' : 'bg-brand-accent text-black'}`}>
                                                {index === beforeIndex ? 'A' : 'B'}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <span>A: Antes</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                                    <span>B: Después</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressGallery;
