import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../utils'
import { Spinner } from './spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [&:not(:disabled)]:hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground [&:not(:disabled)]:hover:bg-destructive/90',
        outline:
          'border border-input bg-background [&:not(:disabled)]:hover:bg-accent [&:not(:disabled)]:hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground [&:not(:disabled)]:hover:bg-secondary/80',
        ghost: '[&:not(:disabled)]:hover:bg-accent [&:not(:disabled)]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [&:not(:disabled)]:hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-7 rounded-md px-3 text-xs',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, asChild = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (loading) {
      return (
        <button
          type="button"
          className={cn('relative overflow-hidden', buttonVariants({ variant, size, loading }), className)}
          ref={ref}
          disabled
          {...props}
        >
          <span className="absolute inset-0 bg-background/70 flex items-center justify-center text-muted-foreground">
            <Spinner className="size-5 text-foreground" />
            <span className="sr-only">Loading</span>
          </span>

          {children}
        </button>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading }), className)}
        ref={ref}
        disabled={disabled || !!loading}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
