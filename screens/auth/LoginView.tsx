import React, { useState } from 'react';
import { getSupabase } from '../../services/supabaseClient';
import Button from '../../components/Button';
import { StrengthIcon } from '../../components/icons';

const LoginView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResend, setShowResend] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setShowResend(false);
        setLoading(true);

        const supabase = getSupabase();
        if (!supabase) {
            setError('Error de conexión con la base de datos.');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes('Email not confirmed')) {
                        setShowResend(true);
                    }
                    throw error;
                }
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    if (error.message.includes('already registered')) {
                        setShowResend(true);
                    }
                    throw error;
                }
                setError('Cuenta creada. Revisa tu correo para confirmar el enlace.');
                setShowResend(true);
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            setError('Por favor ingresa tu correo primero.');
            return;
        }
        setLoading(true);
        setError(null);
        const supabase = getSupabase();
        if (supabase) {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });
            if (error) {
                setError(error.message);
            } else {
                setError('✅ Correo de confirmación reenviado. Revisa tu bandeja de entrada o spam.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-8 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center mb-4">
                        <StrengthIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white">FitArchitect</h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta personal'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-accent transition-colors"
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-accent transition-colors"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-6"
                        size="large"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}
                    </Button>
                </form>

                {showResend && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={loading}
                            className="text-xs text-zinc-300 font-medium underline hover:text-white transition-colors"
                        >
                            ¿No te llegó el correo? Reenviar confirmación
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); setShowResend(false); }}
                        className="text-xs text-brand-accent font-bold uppercase tracking-wider hover:text-white transition-colors"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
