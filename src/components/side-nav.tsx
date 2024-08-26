import { Box, ScrollArea } from '@radix-ui/themes'

export const SideNav = ({ children }: { children: React.ReactNode }) => (
  <Box display={{ initial: 'none', sm: 'block' }} className="w-64 shrink-0">
    <Box
      position="fixed"
      left="0"
      bottom="0"
      top="8"
      className="z-[1] overflow-x-hidden w-64">
      <ScrollArea>{children}</ScrollArea>
    </Box>
  </Box>
)
