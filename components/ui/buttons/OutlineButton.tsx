import Link from 'next/link';
import { ReactNode } from 'react';

interface OutlineButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function OutlineButton({ href, onClick, children, className = '', type = 'button', disabled }: OutlineButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 border border-sky-400 dark:border-sky-500 bg-transparent hover:bg-sky-50 dark:hover:bg-sky-900 disabled:opacity-60 disabled:cursor-not-allowed text-sky-500 dark:text-sky-400 font-semibold rounded-full px-8 py-4 text-base cursor-pointer transition-colors ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  );
}
