import { useRef } from 'react'
import type { AriaButtonProps } from 'react-aria'
import { mergeProps, useButton, useFocusRing } from 'react-aria'

import { cn } from '~/lib/utils'

export function CalendarButton(props: AriaButtonProps<'button'>) {
  const ref = useRef(null)
  const { buttonProps } = useButton(props, ref)
  const { focusProps, isFocusVisible } = useFocusRing()
  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn(
        'rounded-[var(--radius-thumb)] p-2 outline-none',
        props.isDisabled
          ? 'text-[var(--gray-6)]'
          : 'hover:bg-[var(--accent-4)] active:bg-[var(--accent-5)]',
        isFocusVisible && 'ring-2 ring-[var(--accent-9)] ring-offset-2',
      )}>
      {props.children}
    </button>
  )
}

export function FieldButton(
  props: AriaButtonProps<'button'> & { isPressed: boolean },
) {
  const ref = useRef(null)
  const { buttonProps, isPressed } = useButton(props, ref)
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        '-ml-px rounded-r-[var(--radius-3)] border px-2 outline-none transition-colors group-focus-within:border-[var(--accent-9)] group-focus-within:group-hover:border-[var(--accent-9)]',
        isPressed || props.isPressed
          ? 'border-[var(--gray-9)] bg-[var(--gray-4)]'
          : 'border-[var(--gray-7)] bg-[var(--gray-1)] group-hover:border-[var(--gray-10)]',
      )}>
      {props.children}
    </button>
  )
}
