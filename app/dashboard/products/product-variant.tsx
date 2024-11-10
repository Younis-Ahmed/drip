'use clinet';

import { VariantsWithImagesTags } from '@/lib/infer-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function ProductVariant({
  editMode,
  productID,
  variants,
  children,
}: {
  eidtMode: boolean;
  productID: number;
  variants: VariantsWithImagesTags[];
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ProductVariant;
