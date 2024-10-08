// from shadcn ui
import * as SliderPrimitive from '@radix-ui/react-slider'
import React from 'react'

import { cn } from '~/lib/utils'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbLabel: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbLabel, ...props }: SliderProps, ref) => {
  const value = props.value ?? props.defaultValue ?? []
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-[var(--radius-thumb)] bg-[var(--gray-a3)] [box-shadow:0_0_0_1px_var(--gray-a5)]">
        <SliderPrimitive.Range className="absolute h-full bg-[var(--accent-track)]" />
      </SliderPrimitive.Track>
      {value.map((_value, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-5 w-5 rounded-[var(--radius-thumb)] border border-[var(--black-a4)] bg-white ring-offset-[var(--accent-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-8)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label={thumbLabel}
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export default Slider
