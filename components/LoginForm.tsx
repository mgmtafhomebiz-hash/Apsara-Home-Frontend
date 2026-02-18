'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

    const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>

interface LoginFormProps {
    onSwitchToSignUp: () => void;
}

const LoginForm = ({ onSwitchToSignUp }: LoginFormProps) => {
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    login();
    router.push('/');
  };
    
  return (
    <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.25 }}
    >   
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
        <p className="text-white/50 text-sm mb-7">Sign in to your AF Home account</p>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                    Email / Username 
                </label>
                <input 
                    type="text"
                    placeholder="Your username or email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:bg-white/15 transition-all"
                />
            </div>

            <div className="">
                <label className="block text-xs font-semibold text-white mb-1.5">
                    Password
                </label>
                <div className="relative">
                    <input 
                        type={ showPass ? 'text' : 'password'} 
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-11 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:bg-white/15 transition-all"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/4- hover:text-white/80 transition-colors"
                    >
                        <EyeIcon open={showPass} />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                    <input type="checkbox" className="accent-orange-500 w-3.5"  />
                    Remember me
                </label>
                 <button
                        type="submit"
                        className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                        
                    >
                        Forgot Password
                    </button>
            </div>

            <button onClick={handleSignIn} className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-orange-500/30 mt-2">
                SIGN IN
            </button>

            <p className="text-center text-xs text-white/40">
                Don&apos;t have an account?{' '}
                <button
                    onClick={onSwitchToSignUp}
                    className="text-orange-400 hover:text-orange-400 font-semibold transition-colors"
                >
                    Sign Up
                </button>
            </p>
        </div>
    </motion.div>
  )
}

export default LoginForm
