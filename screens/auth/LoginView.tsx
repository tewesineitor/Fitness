import React, { useState } from 'react';
import { getSupabase } from '../../services/supabaseClient';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { StrengthIcon } from '../../components/icons';

const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

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
            setError('Error de conexion con la base de datos.');
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
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Ocurrio un error'));
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
                setError('Correo de confirmacion reenviado. Revisa tu bandeja de entrada o spam.');
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm bg-surface-bg border border-surface-border rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-accent/20 rounded-2xl flex items-center justify-center mb-4">
                        <StrengthIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">FitArchitect</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        {isLogin ? 'Inicia sesion en tu cuenta' : 'Crea tu cuenta personal'}
                    </p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Correo electronico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        required
                    />
                    <Input
                        label="Contrasena"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        required
                        minLength={6}
                    />

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
                        <Button
                            type="button"
                            onClick={handleResendEmail}
                            disabled={loading}
                            variant="ghost"
                            size="small"
                            className="w-full text-xs underline"
                        >
                            Reenviar confirmacion
                        </Button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); setShowResend(false); }}
                        variant="ghost"
                        size="small"
                        className="w-full text-xs uppercase tracking-wider"
                    >
                        {isLogin ? 'No tienes cuenta? Registrate' : 'Ya tienes cuenta? Inicia sesion'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
