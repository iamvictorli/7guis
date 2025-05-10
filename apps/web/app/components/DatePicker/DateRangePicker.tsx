import type { DateValue } from 'react-aria'
import type { DateRangePickerStateOptions } from 'react-stately'

import { CalendarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { useRef } from 'react'
import { useDateRangePicker } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'

import { FieldButton } from './Button'
import { DateField } from './DateField'
import { Dialog } from './Dialog'
import { Popover } from './Popover'
import { RangeCalendar } from './RangeCalendar'

/**
 * DateRangePicker component allows users to select a start and end date.
 * It includes:
 * - A segmented date input for each date field (start and end).
 * - A popover with a range calendar for date selection.
 * - A validation mechanism that highlights invalid date selections.
 */
export function DateRangePicker(props: DateRangePickerStateOptions<DateValue>) {
  const state = useDateRangePickerState(props)
  const ref = useRef<HTMLDivElement>(null!)

  const {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref)

  const { label } = props

  return (
    <div className="relative inline-flex flex-col gap-1 text-left text-base">
      {/* Label for the date range picker */}
      <Label asChild>
        <span {...labelProps}>{label}</span>
      </Label>

      <div {...groupProps} ref={ref} className="group flex">
        {/* Input fields for start and end date */}
        <div className="relative flex rounded-l-[var(--radius-3)] border border-[var(--gray-7)] bg-[var(--color-background)] p-1 pr-10 transition-colors group-focus-within:border-[var(--accent-9)] group-hover:border-[var(--gray-10)] group-focus-within:group-hover:border-[var(--accent-9)]">

          <DateField {...startFieldProps} />
          <span aria-hidden="true" className="px-2">–</span>
          <DateField {...endFieldProps} />

          {/* Error icon if the date range is invalid */}
          {state.isInvalid && (
            <ExclamationTriangleIcon className="absolute right-1 size-6 text-[var(--red-a5)]" />
          )}
        </div>

        {/* Button to trigger the calendar popover */}
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <CalendarIcon className="size-5 text-[var(--gray-11)] group-focus-within:text-[var(--accent-12)]" />
        </FieldButton>
      </div>

      {/* Popover containing the date range calendar */}
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <RangeCalendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  )
}
