import { cn } from '../../lib/utils';

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({ className, children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-md p-6',
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
        className,
      )}
    >
      {children}
    </div>
  );
}
