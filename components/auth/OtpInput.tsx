'use client';

import { useEffect, useRef } from "react";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
}

const OtpInput = ({ value, onChange, length = 4, disabled, autoFocus }:OtpInputProps) => {
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index?: number) => {
    if (disabled) return;

    const targetIndex = typeof index === 'number'
      ? index
      : Math.min(value.length, length - 1);

    inputRef.current[targetIndex]?.focus();
    inputRef.current[targetIndex]?.select();
  }

  useEffect(() => {
    if (autoFocus) {
        const timer = window.setTimeout(() => focusInput(0), 150)
        return () => window.clearTimeout(timer)
    }
  },[autoFocus, disabled])

  useEffect(() => {
    if (!autoFocus || disabled) return

    const refocusWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        window.setTimeout(() => focusInput(), 150)
      }
    }

    window.addEventListener('pageshow', refocusWhenVisible)
    document.addEventListener('visibilitychange', refocusWhenVisible)

    return () => {
      window.removeEventListener('pageshow', refocusWhenVisible)
      document.removeEventListener('visibilitychange', refocusWhenVisible)
    }
  }, [autoFocus, disabled, value, length])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
        const next = digits.map((d, i) => (i === index ? '' : d)).join('');
        onChange(next);
        return;
    }

    if (raw.length > 1) {
        const merged = digits.join('');
        const next = `${merged.slice(0, index)}${raw}${merged.slice(index + raw.length)}`
          .replace(/\D/g, '')
          .slice(0, length);
        onChange(next);
        focusInput(Math.min(next.length, length - 1));
        return;
    }

    const digit = raw[raw.length - 1] 
    const next = digits.map((d, i) => (i === index ? digit : d)).join(''); 
    onChange(next)

    if (index < length - 1) {
        inputRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index]) {
            const next = digits.map((d, i) => (i === index ? '' : d)).join('');
            onChange(next);
        } else if (index > 0) {
            const next = digits.map((d, i) => (i === index - 1 ? '' : d)).join('');
            onChange(next)
            inputRef.current[index - 1]?.focus();
        }
    } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        inputRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        inputRef.current[index + 1]?.focus();
    } else if (e.key === 'Delete') {
        e.preventDefault();
        const next = digits.map((d, i) => (i === index ? '' : d)).join('');
        onChange(next);
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted)
    focusInput(Math.min(pasted.length, length - 1));
  }
  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4"
      onClick={() => focusInput()}
      role="group"
      aria-label={`${length}-digit verification code input`}
    >
      {digits.map((digit, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-gray-300 bg-white transition-all duration-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 dark:border-white/18 dark:bg-white/12 dark:focus-within:border-sky-400/60 dark:focus-within:ring-sky-500/15 sm:h-14 sm:w-14">
                <input 
                    ref={el => { inputRef.current[index] = el}}
                    type="tel"
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    enterKeyHint={index === length - 1 ? 'done' : 'next'}
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={e => handleChange(index, e)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={e => e.target.select()}
                    aria-label={`Digit ${index + 1} of ${length}`}
                    className="h-full w-full rounded-[18px] bg-transparent text-center text-2xl font-bold text-gray-900 outline-none caret-transparent disabled:opacity-50 disabled:cursor-not-allowed dark:text-white"
                />
            </div>
        </div>
      ))}
    </div>
  )
}

export default OtpInput
