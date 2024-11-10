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
  variant,
  children,
}: {
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
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
