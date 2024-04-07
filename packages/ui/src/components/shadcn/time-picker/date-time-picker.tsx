'use client'

import { addHours, startOfMonth, startOfToday } from 'date-fns'
import { useState } from 'react'
import { Calendar, type CalendarProps } from '../calendar'
import { TimePickerInputs } from './time-picker-inputs'

type Props = Pick<CalendarProps, 'disabled' | 'stretch'> & {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate, ...restProps }: Props) {
  const [month, setMonth] = useState(startOfMonth(new Date()))

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        setToday={() => {
          setMonth(startOfToday())
          setDate(addHours(new Date(), 1))
        }}
        initialFocus
        fixedWeeks
        {...restProps}
      />
      <TimePickerInputs className="border-t p-4 justify-start gap-4" setDate={setDate} date={date} />
    </div>
  )
}
