'use client'

import { addHours, startOfHour, startOfMonth, startOfToday } from 'date-fns'
import { useState } from 'react'
import { Calendar } from '../calendar'
import { TimePickerInputs } from './time-picker-inputs'

type Props = {
  stretch?: boolean
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ stretch, date, setDate }: Props) {
  const [month, setMonth] = useState(startOfMonth(new Date()))

  return (
    <div>
      <Calendar
        stretch={stretch}
        mode="single"
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        setToday={() => {
          setMonth(startOfToday())
          setDate(addHours(startOfHour(new Date()), 1))
        }}
        initialFocus
        fixedWeeks
      />
      <TimePickerInputs className="border-t p-4 justify-start gap-4" setDate={setDate} date={date} />
    </div>
  )
}
