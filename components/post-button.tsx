'use client';
import { useFormStatus } from 'react-dom';

export default function PostButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type='submit'
      className='rounded-md bg-blue-600 px-4 py-2 text-white/80 hover:bg-blue-700 hover:text-white disabled:opacity-30'
    >
      Submit
    </button>
  );
}
