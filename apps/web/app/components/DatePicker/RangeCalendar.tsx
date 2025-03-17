import type { DateValue, RangeCalendarProps } from 'react-aria'

import { createCalendar } from '@internationalized/date'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { useRef } from 'react'
import { useLocale, useRangeCalendar } from 'react-aria'
import { useRangeCalendarState } from 'react-stately'

import { CalendarButton } from './Button'
import { CalendarGrid } from './CalendarGrid'

export function RangeCalendar(props: RangeCalendarProps<DateValue>) {
  const { locale } = useLocale()
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
  })

  const ref = useRef(null)
  const { calendarProps, prevButtonProps, nextButtonProps, title }
    = useRangeCalendar(props, state, ref)

  return (
    <div {...calendarProps} ref={ref} className="inline-block">
      <div className="flex items-center pb-4">
        <h2 className="ml-2 flex-1 text-xl font-bold">{title}</h2>
        <CalendarButton {...prevButtonProps}>
          <ChevronLeftIcon className="size-6" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <ChevronRightIcon className="size-6" />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
    </div>
  )
}
