'use client'

import * as React from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './shadcn/command'

const frameworks = [
  {
    id: 'next.js',
    label: 'Next.js',
  },
  {
    id: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    id: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    id: 'remix',
    label: 'Remix',
  },
  {
    id: 'astro',
    label: 'Astro',
  },
]

export function Combobox() {
  const [_open, setOpen] = React.useState(false)
  const [label, setLabel] = React.useState('')

  return (
    <Command>
      <CommandInput placeholder="Filter label..." autoFocus={true} />
      <CommandList>
        <CommandEmpty>No label found.</CommandEmpty>
        <CommandGroup>
          {frameworks.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              onSelect={(value) => {
                setLabel(value)
                setOpen(false)
              }}
            >
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
