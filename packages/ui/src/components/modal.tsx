import type { ComponentProps } from 'react'
import { cn } from '../utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './shadcn/dialog'

export { createPushModal } from 'pushmodal'

type Props = ComponentProps<typeof DialogContent>

export const ModalWrapper = Dialog

export const Modal = ({ children, className, ...restProps }: Props) => {
  return (
    <DialogContent className={cn('w-[95vw] max-w-lg rounded-md', className)} {...restProps}>
      {children}
    </DialogContent>
  )
}

export const ModalHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <DialogHeader className={cn('mb-4', className)}>{children}</DialogHeader>
}

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  return <DialogTitle className="text-left">{children}</DialogTitle>
}

export const ModalDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <DialogDescription className={cn('text-left', className)}>{children}</DialogDescription>
}

export const ModalFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <DialogFooter className={cn(className)}>{children}</DialogFooter>
}
