import type { AriaDatePickerProps, DateValue } from 'react-aria'
import type { DateFieldState, DateSegment as DateSegmentType } from 'react-stately'

import { createCalendar } from '@internationalized/date'
import { useRef } from 'react'
import { useDateField, useDateSegment, useLocale } from 'react-aria'
import { useDateFieldState } from 'react-stately'

import { cn } from '~/lib/utils'

/**
 * DateField component manages date input by splitting it into segments (day, month, year)
 * and displaying placeholders to avoid layout shift during editing.
 */
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

/**
 * Renders an individual segment of a date.
 *
 * The segment shows the text or placeholder and handles focus and style.
 *
 */
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
        // Determine the width based on the maximum value length to prevent layout shifts.
        minWidth: segment.maxValue
          ? `${String(segment.maxValue).length}ch`
          : undefined,
      }}
      className={cn(
        'group box-content rounded-[var(--radius-1)] px-0.5 text-right tabular-nums outline-hidden focus:bg-[var(--accent-9)] focus:text-white',
        segment.isEditable ? 'text-[var(--gray-12)]' : 'text-[var(--gray-11)]',
      )}
    >
      {/* Reserve space for placeholder to prevent layout shifts during editing */}
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
