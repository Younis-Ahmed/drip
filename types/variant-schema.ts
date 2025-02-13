import * as z from 'zod'

export const VariantSchema = z.object({
  productID: z.number(),
  id: z.number().optional(),
  editMode: z.boolean(),
  productType: z.string().min(3, 'Product type must be at least 3 characters'),
  color: z.string().min(3, 'Color must be at least 3 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  variantImages: z
    .array(
      z.object({
        url: z.string().refine(url => url.search('blob') !== 0, {
          message: 'Please wait for the image to upload',
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string().optional(),
      }),
    )
    .min(1, 'At least one image is required'),
})
