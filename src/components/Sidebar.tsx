import { Box, ScrollArea } from '@radix-ui/themes'

// Sidebar is a fixed area that is scrollable and to the side
export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <Box display={{ initial: 'none', md: 'block' }} className="w-64 shrink-0">
      <Box
        position="fixed"
        left="0"
        bottom="0"
        top="8"
        className="z-[1] overflow-x-hidden [width:inherit]">
        <ScrollArea>{children}</ScrollArea>
      </Box>
    </Box>
  )
}
