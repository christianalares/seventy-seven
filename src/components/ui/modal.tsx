import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const useIsDesktop = () => {
  return useMediaQuery('(min-width: 768px)')
}

export const ModalParent = ({ children, isOpen, setIsOpen }: Props) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Drawer>
  )
}

export const ModalContent = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
  }

  return <DrawerContent className="px-8 pb-8">{children}</DrawerContent>
}

export const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return <DialogHeader>{children}</DialogHeader>
  }

  return <DrawerHeader className="text-left my-8">{children}</DrawerHeader>
}

export const ModalTitle = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return <DialogTitle>{children}</DialogTitle>
  }

  return <DrawerTitle>{children}</DrawerTitle>
}

export const ModalDescription = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return <DialogDescription>{children}</DialogDescription>
  }

  return <DrawerDescription>{children}</DrawerDescription>
}

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return <DialogFooter>{children}</DialogFooter>
  }

  return <DrawerFooter>{children}</DrawerFooter>
}
