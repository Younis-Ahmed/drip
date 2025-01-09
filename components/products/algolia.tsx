'use client'

import { searchClient } from '@/lib/algolia-search'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Hits, SearchBox } from 'react-instantsearch'
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import { Card } from '../ui/card'

function Hit({
  hit,
}: {
  hit: {
    objectID: string
    id: string
    price: number
    title: string
    productType: string
    variantsImages: string

    _highlightResult: {
      title: {
        value: string
        matchLevel: string
        fullyHighlighted: boolean
        matchedWords: string[]
      }
      productType: {
        value: string
        matchLevel: string
        fullyHighlighted: boolean
        matchedWords: string[]
      }
    }
  }
}) {
  if (!hit)
    return
  // console.log(`hit = ${JSON.stringify(hit.variantsImages, null, 2)}`)
  if (!hit._highlightResult?.title || hit._highlightResult.title.matchLevel === 'none')
    return null
  // if (!hit._highlightResult?.productType || hit._highlightResult.productType.matchLevel === 'none')
  //   return null

  return (
    <div className="p-4 mb-2 hover:bg-secondary ">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productID=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantsImages}&variantID=${hit.objectID}`}
      >
        <div className="flex w-full gap-12 items-center justify-between">
          <Image

            priority
            src={hit.variantsImages}
            alt={hit.title}
            width={60}
            height={60}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.title.value,
            }}
          >
          </p>

          <p
            dangerouslySetInnerHTML={{
              __html: hit._highlightResult.productType.value,
            }}
          >
          </p>
          <p className="font-medium">
            $
            {hit.price}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default function Algolia() {
  const [active, setActive] = useState(false)

  const MCard = useMemo(() => motion.create(Card), [])
  return (
    <InstantSearchNext
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
      indexName="products"
      searchClient={searchClient}
    >
      <div className="relative">
        <SearchBox
          onFocus={() => setActive(true)}
          onBlur={() => {
            setTimeout(() => {
              setActive(false)
            }, 100)
          }}
          classNames={{
            input:
              ' h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            submitIcon: 'hidden',
            form: 'relative mb-4',
            resetIcon: 'hidden',
          }}
        />
        <AnimatePresence>
          {active && (
            <MCard
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full z-50 overflow-y-scroll h-96"
            >
              <Hits hitComponent={Hit} className="rounded-md" />
            </MCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  )
}
