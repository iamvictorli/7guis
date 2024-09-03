import { getWeeksInMonth } from '@internationalized/date'
import { useCalendarGrid, useLocale } from 'react-aria'
import type { CalendarState, RangeCalendarState } from 'react-stately'

import { CalendarCell } from './CalendarCell'

export function CalendarGrid({
  state,
  ...props
}: {
  state: CalendarState | RangeCalendarState
}) {
  const { locale } = useLocale()
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state)

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale)

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-[var(--gray-11)]">
        <tr>
          {weekDays.map((day, index) => (
            <th className="text-center" key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
