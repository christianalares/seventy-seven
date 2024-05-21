import type { ComponentProps } from 'react'
import { cn } from '../utils'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './shadcn/dialog'

export { createPushModal } from 'pushmodal'

type Props = ComponentProps<typeof DialogContent>

export const Modal = ({ children, className, ...restProps }: Props) => {
  return (
    <DialogContent className={cn('w-[95vw] max-w-lg rounded-md', className)} {...restProps}>
      {children}
    </DialogContent>
  )
}

export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  return <DialogHeader className="mb-4">{children}</DialogHeader>
}

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <DialogTitle className="text-left">{children}</DialogTitle>
}

export const ModalDescription = ({ children }: { children: React.ReactNode }) => {
  return <DialogDescription className="text-left">{children}</DialogDescription>
}

export const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <DialogFooter className={cn(className)}>{children}</DialogFooter>
}
