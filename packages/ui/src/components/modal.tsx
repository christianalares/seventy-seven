import type { BaseWrapperProps } from 'pushmodal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './shadcn/dialog'

export { createPushModal } from 'pushmodal'

export const DynamicModalWrapper = ({
  children,
  onInteractOutside,
  onEscapeKeyDown,
  onPointerDownOutside,
  ...restProps
}: BaseWrapperProps) => {
  return (
    <Dialog {...restProps}>
      <DialogContent
        className="w-[95vw] max-w-lg rounded-md"
        onInteractOutside={onInteractOutside}
        onEscapeKeyDown={onEscapeKeyDown}
        onPointerDownOutside={onPointerDownOutside}
      >
        {children}
      </DialogContent>
    </Dialog>
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

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return <DialogFooter>{children}</DialogFooter>
}
