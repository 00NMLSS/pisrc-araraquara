import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const syncWithServer = useCartStore((state) => state.syncWithServer);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body = isRegister ? { email, password, fullName } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const userObj = data.user || { id: data.id || 'usr-123', email, fullName: fullName || 'Cliente' };
        login(userObj, data.accessToken || 'token-xyz');
        await syncWithServer(userObj.id);
        onClose();
      }
    } catch (err) {
      console.error('Authentication error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-xs p-4">
      <div className="bg-surface w-full max-w-md rounded-md shadow-elevation-lg border border-slate-border p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate hover:text-navy rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-navy mb-1">
          {isRegister ? 'Criar sua conta' : 'Acesse sua conta'}
        </h2>
        <p className="text-xs text-slate mb-6">
          {isRegister ? 'Cadastre-se para gerenciar seus pedidos.' : 'Insira seus dados para continuar.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <Input
              label="Nome Completo"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button variant="primary" size="lg" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? 'Carregando...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-border text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-semibold text-sage hover:underline"
          >
            {isRegister ? 'Já possui conta? Faça login' : 'Não tem conta? Cadastre-se aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};
