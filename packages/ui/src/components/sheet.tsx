import type { ComponentProps } from 'react'
import { cn } from '../utils'
import {
  SheetDescription as ShadSheetDescription,
  SheetFooter as ShadSheetFooter,
  SheetHeader as ShadSheetHeader,
  SheetTitle as ShadSheetTitle,
  SheetContent,
} from './shadcn/sheet'

export { createPushModal } from 'pushmodal'

type Props = ComponentProps<typeof SheetContent>

export const Sheet = ({ children, className, ...restProps }: Props) => {
  return (
    <SheetContent className={cn('w-[95vw]', className)} {...restProps}>
      {children}
    </SheetContent>
  )
}

export const SheetHeader = ({ children }: { children: React.ReactNode }) => {
  return <ShadSheetHeader className="mb-4">{children}</ShadSheetHeader>
}

export const SheetTitle = ({ children }: { children: React.ReactNode }) => {
  return <ShadSheetTitle className="text-left">{children}</ShadSheetTitle>
}

export const SheetDescription = ({ children }: { children: React.ReactNode }) => {
  return <ShadSheetDescription className="text-left">{children}</ShadSheetDescription>
}

export const SheetFooter = ({ children }: { children: React.ReactNode }) => {
  return <ShadSheetFooter>{children}</ShadSheetFooter>
}
