import { zodResolver } from '@hookform/resolvers/zod'
import { type UseFormProps, useForm } from 'react-hook-form'
import { z } from 'zod'

export const createTeamFormSchema = z.object({
  name: z
    .string({ required_error: 'Team name is required' })
    .min(2, {
      message: 'Team name must be at least 2 characters long',
    })
    .max(32, {
      message: 'Team name must be at most 32 characters long',
    }),
})

export type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>

export type UseTeamFormArgs = Omit<UseFormProps<CreateTeamFormValues>, 'resolver'>

export const useTeamForm = (args?: UseTeamFormArgs) => {
  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamFormSchema),
    ...args,
  })

  return form
}
