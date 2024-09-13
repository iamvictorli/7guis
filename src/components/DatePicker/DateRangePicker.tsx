import { CalendarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { useRef } from 'react'
import { useDateRangePicker } from 'react-aria'
import type { DateValue } from 'react-aria'
import { useDateRangePickerState } from 'react-stately'
import type { DateRangePickerStateOptions } from 'react-stately'

import { FieldButton } from './Button'
import { DateField } from './DateField'
import { Dialog } from './Dialog'
import { Popover } from './Popover'
import { RangeCalendar } from './RangeCalendar.tsx'

export function DateRangePicker(props: DateRangePickerStateOptions<DateValue>) {
  const state = useDateRangePickerState(props)
  const ref = useRef(null)
  const {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref)

  // TODO: replace with radix components
  // - Div, Span, Popper, Button

  return (
    <div className="relative inline-flex flex-col gap-1 text-left text-base">
      <Label asChild>
        <span {...labelProps}>{props.label}</span>
      </Label>
      <div {...groupProps} ref={ref} className="group flex">
        <div className="relative flex rounded-l-md border border-[var(--gray-7)] bg-[var(--color-background)] p-1 pr-10 transition-colors group-focus-within:border-[var(--accent-9)] group-hover:border-[var(--gray-10)] group-focus-within:group-hover:border-[var(--accent-9)]">
          <DateField {...startFieldProps} />
          <span aria-hidden="true" className="px-2">
            –
          </span>
          <DateField {...endFieldProps} />
          {state.isInvalid && (
            <ExclamationTriangleIcon className="absolute right-1 h-6 w-6 text-red-500" />
          )}
        </div>
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <CalendarIcon className="h-5 w-5 text-[var(--gray-11)] group-focus-within:text-[var(--accent-12)]" />
        </FieldButton>
      </div>
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
