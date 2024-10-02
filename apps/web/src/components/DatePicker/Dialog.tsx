import { useRef } from 'react'
import { useDialog } from 'react-aria'
import type { AriaDialogProps } from 'react-aria'

export function Dialog({
  children,
  ...props
}: AriaDialogProps & { children: React.ReactNode }) {
  const ref = useRef(null)
  const { dialogProps } = useDialog(props, ref)

  return (
    <div {...dialogProps} ref={ref}>
      {children}
    </div>
  )
}
