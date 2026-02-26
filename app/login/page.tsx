'use client';

import VideoBackground from "@/components/VideoBackground";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthTabs from "@/components/AuthTabs";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

type Mode = 'login' | 'signup'

export function Loginpage() {
  const [mode, setMode] = useState<Mode>('login');


  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex flex-col">
      <VideoBackground />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <Link
        href={"/"}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
          Back to Home
      </Link>

      {/* Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
        <Image
          src={"/Images/af_home_logo.png"}
          alt="AF Home"
          width={110}
          height={36}
          className="h-9 w-auto object-contain brightness-0 invert"
        />
      </div>

      {/* CARD */}
      <div className={`relative z-10 flex justify-center w-full px-4 ${mode === 'signup' ? 'py-20 items-start' : 'min-h-screen items-center'}`}>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
          className={`w-full transition-all duration-300 ${mode === 'signup' ? 'max-w-xl' : 'max-w-md'}`}
        >
          <div className="bg-slate-800/85 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <AuthTabs mode={mode} setMode={setMode} />
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {mode === 'login'
                ? <LoginForm key="login" onSwitchToSignUp={() => setMode('signup')}/>
                : <SignUpForm key="signup" onSwitchToLogin={() => setMode('login')}/>
              }
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Loginpage
