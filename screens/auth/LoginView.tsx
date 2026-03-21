import React, { useState } from 'react';
import { getSupabase } from '../../services/supabaseClient';
import Button from '../../components/Button';
import Input from '../../components/Input';
import InlineAlert from '../../components/feedback/InlineAlert';
import { StrengthIcon } from '../../components/icons';
import { PageContainer, PageHeader } from '../../components/layout';

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
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          if (authError.message.includes('Email not confirmed')) {
            setShowResend(true);
          }
          throw authError;
        }
      } else {
        const { error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          if (authError.message.includes('already registered')) {
            setShowResend(true);
          }
          throw authError;
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
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setError('Correo de confirmacion reenviado. Revisa tu bandeja de entrada o spam.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <PageContainer size="compact" className="flex min-h-screen items-center justify-center py-10">
        <div className="ui-surface--glass w-full max-w-md animate-fade-in-up p-6 sm:p-8">
          <PageHeader
            size="full"
            className="pt-0"
            eyebrow={(
              <span className="flex items-center gap-2">
                <StrengthIcon className="h-4 w-4 text-brand-accent" />
                FitArchitect
              </span>
            )}
            title={isLogin ? 'Accede a tu cuenta' : 'Crea tu cuenta'}
            subtitle={isLogin
              ? 'Mantén tu progreso sincronizado en todos tus dispositivos.'
              : 'Crea una cuenta personal para empezar a construir tu sistema.'}
          />

          {error ? (
            <InlineAlert tone="danger" className="mt-6">
              {error}
            </InlineAlert>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              className="mt-6 w-full"
              size="large"
              disabled={loading}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear cuenta')}
            </Button>
          </form>

          {showResend ? (
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
          ) : null}

          <div className="mt-6 text-center">
            <Button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setShowResend(false);
              }}
              variant="ghost"
              size="small"
              className="w-full text-xs uppercase tracking-wider"
            >
              {isLogin ? 'No tienes cuenta? Registrate' : 'Ya tienes cuenta? Inicia sesion'}
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default LoginView;
