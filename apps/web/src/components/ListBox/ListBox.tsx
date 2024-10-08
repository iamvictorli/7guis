// https://react-spectrum.adobe.com/react-aria/useListBox.html#example
import type { Node } from '@react-types/shared'
import type { AriaListBoxProps } from 'react-aria'
import type { ListState } from 'react-stately'

import { useRef } from 'react'
import { mergeProps, useFocusRing, useListBox, useOption } from 'react-aria'
import { Item, useListState } from 'react-stately'

import { cn } from '~/lib/utils'

function ListBoxProvider<T extends object>(props: AriaListBoxProps<T>) {
  // Create state based on the incoming props
  const state = useListState(props)

  // Get props for the listbox element
  const ref = useRef(null)
  const { listBoxProps, labelProps } = useListBox(props, state, ref)
  const { label } = props

  return (
    <>
      <div {...labelProps}>{label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        className={cn(
          'mt-2 h-[200px] overflow-auto rounded-[var(--radius-4)] border border-solid border-[var(--gray-a7)] p-2 transition-colors',
          state.selectionManager.isFocused
          && 'outline outline-1 -outline-offset-1 outline-[var(--gray-a8)]',
        )}
      >
        {[...state.collection].map(item => (
          <Option key={item.key} item={item} state={state} />
        ))}
      </ul>
    </>
  )
}

function Option<T>({ item, state }: { item: Node<T>, state: ListState<T> }) {
  // Get props for the option element
  const ref = useRef(null)
  const { optionProps } = useOption({ key: item.key }, state, ref)

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      data-focus-visible={isFocusVisible}
      className={cn(
        'block px-2 py-2 text-[var(--gray-a12)] transition-colors aria-[selected=true]:rounded-[var(--radius-2)] aria-[selected=true]:bg-[var(--accent-a9)] aria-[selected=true]:text-[var(--accent-contrast)]',
        isFocusVisible
          ? 'rounded-[var(--radius-2)] outline outline-2 outline-offset-2 outline-[var(--accent-a9)]'
          : '[outline:none]',
      )}
    >
      {item.rendered}
    </li>
  )
}

const ListBox = {
  Root: ListBoxProvider,
  Item,
}

export default ListBox
