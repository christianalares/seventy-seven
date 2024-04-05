'use client'

import * as React from 'react'
import { cn } from '../../../utils'
import { Label } from '../label'
import { TimePickerInput } from './time-picker-input'

interface Props {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePickerInputs({ date, setDate, className }: Props) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  // const secondRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className={cn('flex items-end gap-2', className)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hour
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minute
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          // onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {/* <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Second
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={setDate}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div> */}
    </div>
  )
}
