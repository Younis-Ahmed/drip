import { CheckCircle2 } from 'lucide-react';

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className='rounded-md bg-green-400/30 my-2 text-xs font-medium p-3 text-secondary-foreground flex items-center gap-2'>
      <CheckCircle2 className='mr-2 h-5 w-5' />
      <p>{message}</p>
    </div>
  );
};
