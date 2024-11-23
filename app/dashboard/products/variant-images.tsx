'use client';
import { UploadDropzone } from '@/app/api/uploadthing/upload';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VariantSchema } from '@/types/variant-schema';
import { useFieldArray, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import {
  Table,
//   TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { useState } from 'react';

export default function VariantImages() {
  const { getValues, control, setError } = useFormContext<z.infer<typeof VariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: 'variantImages',
  });
  const [active, setActive] = useState(0);
  return (
    <div>
      <FormField
        control={control}
        name='variantImages'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Variant Tags</FormLabel>
            <FormControl>
              <UploadDropzone
                config={{ mode: 'auto' }}
                className='border-secondary transition-all duration-500 ease-in-out hover:bg-primary/10 ut-button:bg-primary/75 ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 ut-button:ut-readying:bg-secondary'
                endpoint={'variantUploader'}
                onUploadError={error => {
                  setError('variantImages', {
                    type: 'validate',
                    message: error.message,
                  });
                  return;
                }}
                onBeforeUploadBegin={files => {
                  files.forEach(file =>
                    append({
                      name: file.name,
                      url: URL.createObjectURL(file),
                      size: file.size,
                    }),
                  );
                  return files;
                }}
                onClientUploadComplete={files => {
                  const images = getValues('variantImages');
                  images.map((field, index) => {
                    if (field.url.search('blob:') === 0) {
                      const images = files.find(img => img.name === field.name);
                      if (images) {
                        update(index, {
                          url: images.url,
                          name: images.name,
                          size: images.size,
                          key: images.key,
                        });
                      }
                    }
                  });
                  return;
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='overflow-x-auto rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as='tbody'
            values={fields}
            onReorder={e => {
              const acitveElem = fields[active];
              e.map((item, index) => {
                if (item === acitveElem) {
                  move(active, index);
                  setActive(index);
                  return;
                }
                return;
              });
            }}
          >
            {fields.map((field, index) => {
              return (
                <Reorder.Item
                  as='tr'
                  key={field.id}
                  id={field.id}
                  value={field}
                  onDragStart={() => setActive(index)}
                  className={cn(
                    field.url.search('blob:') === 0 ? 'animate-pulse transition-all' : '',
                    'text-sm font-bold text-muted-foreground hover:text-primary',
                  )}
                >
                  <TableCell>{index}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{(field.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <div className='flex items-center justify-center'>
                      <Image
                        src={field.url}
                        alt={field.name ?? 'Image'}
                        className='rounded-md'
                        width={72}
                        height={48}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      className='scale-75'
                      onClick={e => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      <Trash className='h-4' />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
}