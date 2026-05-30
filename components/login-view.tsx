'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { AlertCircle, LogIn, Lock, User } from 'lucide-react';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    if (!success) {
      setError('Usuario o contraseña inválidos');
      setPassword('');
    }

    setLoading(false);
  };

  const handleDemoLogin = async (demoUsername: string) => {
    setError('');
    setLoading(true);
    const success = await login(demoUsername, demoUsername);
    if (!success) {
      setError('Error en demo login');
    }
    setLoading(false);
  };

  const demoUsers = [
    { id: 'solicitante', label: 'Solicitante', desc: 'Crear expedientes' },
    { id: 'analista', label: 'Analista', desc: 'Validar documentos' },
    { id: 'aprobador', label: 'Aprobador', desc: 'Aprobar expedientes' },
    { id: 'pagador', label: 'Pagador', desc: 'Registrar pagos' },
    { id: 'auditor', label: 'Auditor', desc: 'Auditar procesos' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sistema de Control</h1>
            <p className="text-slate-400">Gestión de Compras Internas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm text-center mb-4">Credenciales de demostración:</p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleDemoLogin(user.id)}
                  disabled={loading}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium py-2.5 px-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 text-left"
                >
                  <div className="font-semibold text-white">{user.label}</div>
                  <div className="text-slate-500 text-[10px]">{user.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center">
              Sistema de gestión de compras internas. Todos los datos se guardan localmente en tu navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
