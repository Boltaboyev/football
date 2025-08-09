import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'ghost';
};

export default function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'accent' && 'btn-accent',
        variant === 'ghost' && 'bg-white/10 hover:bg-white/20',
        className,
      )}
      {...rest}
    />
  );
}