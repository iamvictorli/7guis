import { Theme } from '@radix-ui/themes'
import { DismissButton, Overlay, usePopover } from '@react-aria/overlays'
import * as React from 'react'
import type { Placement } from 'react-aria'
import type { DatePickerState, DateRangePickerState } from 'react-stately'

export function Popover(props: {
  state: DatePickerState | DateRangePickerState
  placement: Placement
  triggerRef: React.RefObject<HTMLDivElement>
  children: React.ReactNode
}) {
  const ref = React.useRef(null)
  const { state, children } = props

  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef: ref,
    },
    state,
  )

  return (
    <Overlay>
      <Theme>
        <div {...underlayProps} className="fixed inset-0" />
        <div
          {...popoverProps}
          ref={ref}
          className="absolute top-full z-10 mt-2 rounded-md border border-[var(--gray-6)] bg-[var(--color-background)] p-8 shadow-lg">
          <DismissButton onDismiss={() => state.close()} />
          {children}
          <DismissButton onDismiss={() => state.close()} />
        </div>
      </Theme>
    </Overlay>
  )
}
