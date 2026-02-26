import { cn } from '../../lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
        variant === 'ghost' && 'bg-transparent text-gray-600 hover:bg-gray-100',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
