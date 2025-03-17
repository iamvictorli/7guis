import type { AriaDatePickerProps, DateValue } from 'react-aria'
import type { DateFieldState, DateSegment as DateSegmentType } from 'react-stately'

import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { useDateField, useDateSegment, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'

import { cn } from '~/lib/utils'

export function DateField(props: AriaDatePickerProps<DateValue>) {
  const { locale } = useLocale()
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  })

  const ref = useRef(null)
  const { fieldProps } = useDateField(props, state, ref)

  return (
    <div {...fieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  )
}

function DateSegment({
  segment,
  state,
}: {
  segment: DateSegmentType
  state: DateFieldState
}) {
  const ref = useRef(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        // couldnt put this in tailwind classname
        minWidth: segment.maxValue
          ? `${String(segment.maxValue).length}ch`
          : undefined,
      }}
      className={cn(
        'group box-content rounded-[var(--radius-1)] px-0.5 text-right tabular-nums outline-hidden focus:bg-[var(--accent-9)] focus:text-white',
        segment.isEditable ? 'text-[var(--gray-12)]' : 'text-[var(--gray-11)]',
      )}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden="true"
        className="block w-full text-center italic text-[var(--gray-11)] group-focus:text-white"
        style={{
          visibility: segment.isPlaceholder ? undefined : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none',
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  )
}
