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
  const base = `inline-flex items-center justify-center gap-2 border border-orange-400 dark:border-orange-500 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900 disabled:opacity-60 disabled:cursor-not-allowed text-orange-500 dark:text-orange-400 font-semibold rounded-full px-8 py-4 text-base cursor-pointer transition-colors ${className}`;

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
