import { CheckCircle2 } from 'lucide-react';

export const formError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className='rounded-md bg-teal-400 p-3 text-secondary-foreground'>
      <CheckCircle2 className='mr-2 h-5 w-5' />
      <p>{message}</p>
    </div>
  );
};
