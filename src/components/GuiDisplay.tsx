import { Box, ScrollArea } from '@radix-ui/themes'

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
      className="relative border-box bg-[var(--accent-2)] rounded-lg after:absolute after:content=[''] after:top-0 after:left-0 after:bottom-0 after:right-0 after:[box-shadow:0_0_0_1px_var(--gray-a5)] after:rounded-lg after:pointer-events-none">
      <Box className="text-pretty bg-white [border-radius:8px_8px_0_0] [box-shadow:inset_0_-1px_var(--gray-a5)]">
        <ScrollArea>
          <Box p="4" className="leading-none">
            {content}
          </Box>
        </ScrollArea>
      </Box>

      <Box className="box-border" position="relative" height="100%">
        <ScrollArea>{description}</ScrollArea>
      </Box>
    </Box>
  )
}
