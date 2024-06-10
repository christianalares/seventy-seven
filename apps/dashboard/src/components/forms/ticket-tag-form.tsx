import { action } from '@/lib/safe-action'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Form, FormControl, FormField, FormItem } from '@seventy-seven/ui/form'
import { Input } from '@seventy-seven/ui/input'
import { ModalFooter } from '@seventy-seven/ui/modal'
import { type DefaultValues, useForm } from 'react-hook-form'
import { z } from 'zod'
import { popModal } from '../modals'

const tagFormSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .min(1, { message: 'Name is required' })
    .max(30, { message: 'Name can only be maximun 30 characters' }),
  color: z
    .string({ message: 'Color is required' })
    .startsWith('#', { message: 'Invalid color' })
    .max(7, { message: 'Invalid color' }),
})

type TagFormValues = z.infer<typeof tagFormSchema>

type Props = {
  defaultValues?: DefaultValues<TagFormValues>
  onSubmit: (values: TagFormValues) => void
  isLoading?: boolean
  onClose: () => void
  ctaText: React.ReactNode
  placeholder?: string
}

export const TicketTagForm = ({ defaultValues, onSubmit, isLoading, onClose, ctaText, placeholder }: Props) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <label>
                      <div className="size-8 rounded-full cursor-pointer" style={{ backgroundColor: field.value }}>
                        <span className="sr-only">{field.value}</span>
                      </div>
                      <input type="color" className="sr-only" {...form.register('color')} />
                    </label>
                  </FormControl>
                </FormItem>
              )
            }}
          />

          <Input placeholder={placeholder} {...form.register('name')} />
        </div>

        <ModalFooter className="mt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {ctaText}
          </Button>
        </ModalFooter>
      </form>
    </Form>
  )
}
