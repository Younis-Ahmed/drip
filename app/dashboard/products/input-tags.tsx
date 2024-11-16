'use client'

import type { InputProps } from '@/components/ui/input'
import type { Dispatch, SetStateAction } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

type InputTagsProps = InputProps & {
  value: string[]
  onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(

  // eslint-disable-next-line unused-imports/no-unused-vars
  ({ onChange, value, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState('')
    const [focused, setFocused] = useState(false)

    function addPendingDataPoint() {
      if (!pendingDataPoint) {
        return
      }
      const newDataPoints = new Set([...value, pendingDataPoint])
      onChange(Array.from(newDataPoints))
      setPendingDataPoint('')
    }
    const { setFocus } = useFormContext()
    return (
      <div
        className={cn(
          'flex min-h-[20px] w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          focused
            ? 'outline-none ring-2 ring-ring ring-offset-2'
            : 'outline-none ring-0 ring-ring ring-offset-0',
        )}
        onClick={() => setFocus('tags')}
      >
        <motion.div className="flex min-h-[2.5rem] flex-wrap items-center gap-2 rounded-md p-2">
          <AnimatePresence>
            {value.map(tag => (
              <motion.div
                key={tag}
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
              >
                <Badge variant="secondary">{tag}</Badge>
                <button className="ml-2 w-3" onClick={() => onChange(value.filter(i => i !== tag))}>
                  <XIcon className="w-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex">
            <Input
              className="border-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addPendingDataPoint()
                }
                if (e.key === 'Backspace' && !pendingDataPoint && value.length > 0) {
                  e.preventDefault()
                  const newVal = [...value]
                  newVal.pop()
                  onChange(newVal)
                }
              }}
              value={pendingDataPoint}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={e => setPendingDataPoint(e.target.value)}
              {...props}
              placeholder="Add a tag"
            />
          </div>
        </motion.div>
      </div>
    )
  },
)

InputTags.displayName = 'InputTags'
