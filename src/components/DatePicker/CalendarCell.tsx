import { getDayOfWeek, isSameDay } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import { cn } from '~/lib/utils'
import { useRef } from 'react'
import {
  mergeProps,
  useCalendarCell,
  useFocusRing,
  useLocale,
} from 'react-aria'
import type { CalendarState, RangeCalendarState } from 'react-stately'

export function CalendarCell({
  state,
  date,
}: {
  state: CalendarState | RangeCalendarState
  date: CalendarDate
}) {
  const ref = useRef(null)
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref)

  let isSelectionStart = isSelected
  let isSelectionEnd = isSelected

  // The start and end date of the selected range will have
  // an emphasized appearance.
  if ('highlightedRange' in state) {
    if (state.highlightedRange === null) {
      isSelectionStart = false
      isSelectionEnd = false
    } else {
      if (state.highlightedRange.start === null) {
        isSelectionStart = false
      } else {
        isSelectionStart = isSameDay(date, state.highlightedRange.start)
      }

      if (state.highlightedRange.end === null) {
        isSelectionEnd = false
      } else {
        isSelectionEnd = isSameDay(date, state.highlightedRange.end)
      }
    }
  }

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const { locale } = useLocale()
  const dayOfWeek = getDayOfWeek(date, locale)
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1)
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date))

  const { focusProps, isFocusVisible } = useFocusRing()

  return (
    <td
      {...cellProps}
      className={cn('relative py-0.5', isFocusVisible ? 'z-10' : 'z-0')}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cn(
          'group h-10 w-10 outline-none',
          isRoundedLeft && 'rounded-l-[var(--radius-thumb)]',
          isRoundedRight && 'rounded-r-[var(--radius-thumb)]',
          isSelected &&
            (isInvalid ? 'bg-[var(--red-3)]' : 'bg-[var(--accent-3)]'),
          isDisabled && 'disabled',
        )}>
        <div
          className={cn(
            'flex h-full w-full cursor-default items-center justify-center rounded-[var(--radius-thumb)]',
            isDisabled && !isInvalid && 'text-[var(--gray-6)]',
            isFocusVisible &&
              'group-focus:z-2 ring-2 ring-[var(--accent-9)] ring-offset-2',
            (isSelectionStart || isSelectionEnd) &&
              (isInvalid
                ? 'bg-[var(--red-9)] text-white hover:bg-[var(--red-10)]'
                : 'bg-[var(--accent-9)] text-white hover:bg-[var(--accent-10)]'),
            isSelected &&
              !isDisabled &&
              !(isSelectionStart || isSelectionEnd) &&
              (isInvalid
                ? 'hover:bg-[var(--red-5)]'
                : 'hover:bg-[var(--accent-5)]'),
            !isSelected && !isDisabled && 'hover:bg-[var(--accent-4)]',
          )}>
          {formattedDate}
        </div>
      </div>
    </td>
  )
}
