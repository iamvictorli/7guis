import type { CalendarDate } from '@internationalized/date'
import type { DatePickerStateOptions } from 'react-stately'

import { CalendarIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { useRef } from 'react'
import { useDatePicker } from 'react-aria'
import { useDatePickerState } from 'react-stately'

import { FieldButton } from './Button'
import { Calendar } from './Calendar'
import { DateField } from './DateField'
import { Dialog } from './Dialog'
import { Popover } from './Popover'

export function DatePicker(props: DatePickerStateOptions<CalendarDate>) {
  const state = useDatePickerState(props)
  const ref = useRef<HTMLDivElement>(null)
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(props, state, ref)

  // TODO: replace with radix components
  // - Div, Span, Popper, Button

  const { label } = props

  return (
    <div className="relative inline-flex flex-col gap-1 text-left text-base">
      <Label asChild>
        <span {...labelProps}>{label}</span>
      </Label>

      <div {...groupProps} ref={ref} className="group flex">
        <div className="relative flex items-center rounded-l-[var(--radius-3)] border border-[var(--gray-7)] bg-[var(--color-background)] p-1 pr-10 transition-colors group-focus-within:border-[var(--accent-9)] group-hover:border-[var(--gray-10)] group-focus-within:group-hover:border-[var(--accent-9)]">
          <DateField {...fieldProps} />
          {state.isInvalid && (
            <ExclamationTriangleIcon className="absolute right-1 h-5 w-5 text-[var(--red-9)]" />
          )}
        </div>
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <CalendarIcon className="h-5 w-5 text-[var(--gray-11)] group-focus-within:text-[var(--accent-9)]" />
        </FieldButton>
      </div>
      {state.isOpen && (
        <Popover triggerRef={ref} state={state} placement="bottom start">
          <Dialog {...dialogProps}>
            <Calendar {...calendarProps} />
          </Dialog>
        </Popover>
      )}
    </div>
  )
}
