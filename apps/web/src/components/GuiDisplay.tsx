import { Box, ScrollArea } from '@radix-ui/themes'
import React from 'react'

export default function GuiDisplay({
  content,
  description,
}: {
  content: React.ReactNode
  description: React.ReactNode
}) {
  return (
    <Box
      my="5"
      // TODO: separate tailwind classnames
      // https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes
      className="relative box-border rounded-[var(--radius-4)] bg-[var(--accent-2)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-4)] after:[box-shadow:0_0_0_1px_var(--gray-a5)]"
    >
      <Box className="text-pretty bg-[var(--color-background)] [border-radius:8px_8px_0_0] [box-shadow:inset_0_-1px_var(--gray-a5)]">
        <ScrollArea>
          <Box p="4" className="leading-none">
            {content}
          </Box>
        </ScrollArea>
      </Box>

      <Box position="relative" height="100%">
        <ScrollArea>{description}</ScrollArea>
      </Box>
    </Box>
  )
}
