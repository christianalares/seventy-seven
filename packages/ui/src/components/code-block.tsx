'use client'

// @ts-ignore
import { highlight } from 'sugar-high'
import { cn } from '../utils'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './shadcn/tabs'

type Tab = {
  id: string
  label: string
  code: string
}

type Props = {
  tabs: Tab[]
  className?: string
}

export const CodeBlock = ({ tabs, className }: Props) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id)

  return (
    <Tabs
      value={activeTabId}
      onValueChange={setActiveTabId}
      className={cn('border rounded-md flex flex-col bg-transparent max-h-[500px]', className)}
    >
      <TabsList className="bg-transparent h-auto p-4 border-b w-full justify-start gap-2 rounded-none">
        {tabs.map(({ id, label }) => (
          <TabsTrigger key={id} value={id} className="p-0 relative">
            {label}

            {activeTabId === id && <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-muted-foreground" />}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ id, code }) => (
        <TabsContent key={id} value={id} className="p-4 mt-0 h-full overflow-auto">
          <pre className="h-full">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation> */}
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <code className="text-sm font-medium w-full h-full" dangerouslySetInnerHTML={{ __html: highlight(code) }} />
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
