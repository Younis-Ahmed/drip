import { AlertCircle } from 'lucide-react';

export const formError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className='rounded-md bg-destructive p-3 text-secondary-foreground'>
      <AlertCircle className='mr-2 h-5 w-5' />
      <p>{message}</p>
    </div>
  );
};
