import type { CalendarDate } from '@internationalized/date'
import type { CalendarState, RangeCalendarState } from 'react-stately'

import { getDayOfWeek, isSameDay } from '@internationalized/date'
import { useRef } from 'react'
import {
  mergeProps,
  useCalendarCell,
  useFocusRing,
  useLocale,
} from 'react-aria'

import { cn } from '~/lib/utils'

/**
 * Renders an individual cell within a calendar grid.
 *
 * This component leverages React Aria hooks to manage accessibility, focus,
 * and interaction. It handles both single-date and range calendar states.
 *
 */
export function CalendarCell({
  state,
  date,
}: {
  state: CalendarState | RangeCalendarState
  date: CalendarDate
}) {
  const ref = useRef(null)

  // Obtain accessibility and interaction props for the cell
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref)

  // Determine if this cell represents the start or end of a range selection.
  let isSelectionStart = isSelected
  let isSelectionEnd = isSelected

  // If the calendar supports range selection, update start/end flags.
  if ('highlightedRange' in state) {
    if (state.highlightedRange === null) {
      isSelectionStart = false
      isSelectionEnd = false
    }
    else {
      isSelectionStart = state.highlightedRange.start
        ? isSameDay(date, state.highlightedRange.start)
        : false
      isSelectionEnd = state.highlightedRange.end
        ? isSameDay(date, state.highlightedRange.end)
        : false
    }
  }

  // Compute rounded corners based on position within the month and selection boundaries.
  const { locale } = useLocale()
  const dayOfWeek = getDayOfWeek(date, locale)
  const isRoundedLeft
    = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1)
  const isRoundedRight
    = isSelected
      && (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date))

  // Manage focus styling using React Aria's useFocusRing hook.
  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <td
      {...cellProps}
      className={cn('relative py-0.5', isFocusVisible ? 'z-10' : 'z-auto')}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cn(
          'group h-10 w-10 outline-hidden',
          isRoundedLeft && 'rounded-l-[var(--radius-thumb)]',
          isRoundedRight && 'rounded-r-[var(--radius-thumb)]',
          isSelected
          && (isInvalid ? 'bg-[var(--red-3)]' : 'bg-[var(--accent-3)]'),
          isDisabled && 'disabled',
        )}
      >
        <div
          className={cn(
            'flex h-full w-full cursor-default items-center justify-center rounded-[var(--radius-thumb)]',
            isDisabled && !isInvalid && 'text-[var(--gray-6)]',
            isFocusVisible
            && 'ring-2 ring-[var(--accent-9)] ring-offset-2 group-focus:z-10',
            (isSelectionStart || isSelectionEnd)
            && (isInvalid
              ? 'bg-[var(--red-9)] text-white hover:bg-[var(--red-10)]'
              : 'bg-[var(--accent-9)] text-white hover:bg-[var(--accent-10)]'),
            isSelected
            && !isDisabled
            && !(isSelectionStart || isSelectionEnd)
            && (isInvalid ? 'hover:bg-[var(--red-5)]' : 'hover:bg-[var(--accent-5)]'),
            !isSelected && !isDisabled && 'hover:bg-[var(--accent-4)]',
          )}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  )
}
