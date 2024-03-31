import { joinWaitlist } from '@/actions/waitlist'
import { useStore } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { cn } from '@seventy-seven/ui/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
})

type FormValues = z.infer<typeof schema>

type Props = {
  className?: string
}

export const WaitlistForm = ({ className }: Props) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const setShowConfetti = useStore((state) => state.setShowConfetti)
  const [serverErrorMessage, setServerErrorMessage] = useState<string>()

  const action = useAction(joinWaitlist, {
    onExecute: () => {
      setServerErrorMessage(undefined)
      setShowSuccessMessage(false)
    },
    onError: (error) => {
      setServerErrorMessage(error.serverError)
      setShowConfetti(false)
      setShowSuccessMessage(false)
    },
    onSuccess: () => {
      setShowSuccessMessage(true)
      setShowConfetti(true)
      setServerErrorMessage(undefined)
      form.reset()
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      email: values.email,
    })
  })

  return (
    <div className="flex flex-col items-center relative">
      <form
        className={cn(
          'border-2 border-black dark:border-white flex overflow-hidden rounded-md h-12 w-[90vw] max-w-md ring-[14px] ring-white/85 dark:ring-black/60',
          className,
        )}
        onSubmit={onSubmit}
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field }) => (
            <input
              className="flex-1 border-0 rounded-none focus-visible:outline-none px-4 dark:bg-black text-sm sm:text-base"
              placeholder="Enter your email"
              autoComplete="off"
              autoCorrect="off"
              id="email"
              {...field}
              onChange={(e) => {
                setServerErrorMessage(undefined)
                setShowSuccessMessage(false)
                field.onChange(e.target.value)
              }}
            />
          )}
        />
        <Button
          type="submit"
          loading={action.status === 'executing'}
          className="bg-black dark:bg-white text-background px-4 text-sm sm:text-base rounded-none h-full font-normal"
        >
          Join the wait list
        </Button>
      </form>

      <AnimatePresence>
        {(form.formState.errors.email?.message || serverErrorMessage) && (
          <motion.p
            className="absolute text-center bg-background -bottom-12 border border-destructive py-0.5 px-3 rounded-md text-destructive text-sm sm:text-base"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
          >
            {form.formState.errors.email?.message ?? serverErrorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.p
            className="text-sm sm:text-base absolute text-center bg-background -top-16 sm:-top-20 border-2 border-foreground py-1 px-3 rounded-md shadow-[-2px_4px_0_2px_theme(colors.foreground)]"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
          >
            Welcome onboard! We'll let you know when it's time!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
