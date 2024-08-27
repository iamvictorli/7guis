import { Box, ScrollArea } from '@radix-ui/themes'
import { routes } from '~/shared/links'

import { Header } from './Header'
import { MobileMenuContent } from './MobileMenu'
import { Nav } from './Nav'

export function MobileNav() {
  return (
    <MobileMenuContent>
      <Header />
      <ScrollArea>
        <Box pt="4" px="3" pb="9">
          <Nav routes={routes} />
        </Box>
      </ScrollArea>
    </MobileMenuContent>
  )
}
