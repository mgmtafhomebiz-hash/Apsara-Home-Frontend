import Link from 'next/link';
import { ReactNode } from 'react';

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function PrimaryButton({ href, onClick, children, className = '', type = 'button' }: PrimaryButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-4 text-base cursor-pointer ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {children}
    </button>
  );
}
