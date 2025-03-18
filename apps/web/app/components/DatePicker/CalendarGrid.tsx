import type { CalendarState, RangeCalendarState } from 'react-stately'

import { getWeeksInMonth } from '@internationalized/date'
import { useCalendarGrid, useLocale } from 'react-aria'

import { CalendarCell } from './CalendarCell'

/**
 * CalendarGrid component renders the calendar's grid, displaying weeks and individual day cells.
 * It dynamically calculates the number of weeks in the current month.
 */
export function CalendarGrid({
  state,
  ...props
}: {
  state: CalendarState | RangeCalendarState
}) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Calculate the number of weeks in the month for proper grid rendering.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-[var(--gray-11)]">
        <tr>
          {weekDays.map((day, i) => (
            <th className="text-center" key={i}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: weeksInMonth }, (_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date
                  ? (
                      <CalendarCell key={i} state={state} date={date} />
                    )
                  : (
                      <td key={i} />
                    ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
