import { AlertCircle } from 'lucide-react';

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className='rounded-md bg-destructive/30 my-2 text-xs font-medium p-3 text-secondary-foreground flex items-center gap-2'>
      <AlertCircle className='mr-2 h-5 w-5' />
      <p>{message}</p>
    </div>
  );
};
