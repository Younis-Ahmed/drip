'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Session } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SettingsSchema } from '@/types/settings-schema';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { FormError } from '@/components/auth/form-error';
import { FormSuccess } from '@/components/auth/form-success';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { Settings } from '@/server/actions/settings';
import { UploadButton } from '@/app/api/uploadthing/upload';

type SettingsForm = {
  session: Session;
};

function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  const { execute, status } = useAction(Settings, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      image: session.session.user?.image || undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update Your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={status === 'executing'} placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className='flex items-center gap-4'>
                    {!form.getValues('image') && (
                      <div className='font-bold'>
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues('image') && (
                      <Image
                        src={form.getValues('image')!}
                        width={42}
                        height={42}
                        alt={session.session.user?.name || 'User Image'}
                        className='rounded-full'
                      />
                    )}
                    <UploadButton
                      className='ut-button:bg-primary/75 hover:ut-button:bg-primary ut-button:transition-all ut-button:duration-500 ut-label:hidden ut-aloowed-content:hidden scale-75 ut-button:ring-primary '
                      endpoint='avatarUploader'
                      onUploadBegin={() => setAvatarUploading(true)}
                      onUploadError={error => {
                        form.setError('image', {
                          type: 'validate',
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return
                      }}
                      onClientUploadComplete={res => {
                        form.setValue('image', res[0].url!)
                        setAvatarUploading(false);
                        return
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <div>Change Avatar</div>;
                          return <div>Uploading...</div>;
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      disabled={status === 'executing'}
                      placeholder='User Image'
                      {...field}
                      type='hidden'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === 'executing' || session?.session.user.isOAuth === true}
                      placeholder='*****'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === 'executing' || session?.session.user.isOAuth === true}
                      placeholder='*****'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isTwoFactorEnabled'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentification</FormLabel>
                  <FormDescription>
                    Enable two factor Authentification for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={status === 'executing' || session?.session.user.isOAuth === true}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={status === 'executing' || avatarUploading} type='submit'>
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default SettingsCard;
