import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <SEO 
        title="Client Login" 
        description="Secure login portal for Lasa Technology clients and administrators."
      />
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-fade-in-down relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Secure Access</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Restricted area for authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                }}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'} text-slate-900 dark:text-white focus:ring-2 outline-none transition-all pl-11`}
                placeholder="Enter access code..."
                autoFocus
              />
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            {error && <p className="text-red-500 text-xs font-medium mt-2 animate-fade-in flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span> Invalid credentials.</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] hover:scale-[1.01]"
          >
            Authenticate <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
                Unauthorized access is strictly prohibited. <br/>All attempts are monitored.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;