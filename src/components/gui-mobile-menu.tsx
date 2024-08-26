import { Box, ScrollArea } from '@radix-ui/themes'
import { routes } from '~/shared/links'

import { DocsNav } from './docs-nav'
import { Header } from './header'
import { MobileMenu } from './mobile-menu'

export function GUIMobileMenu() {
  return (
    <MobileMenu>
      <Header />
      <ScrollArea>
        <Box pt="4" px="3" pb="9">
          <DocsNav routes={routes} />
        </Box>
      </ScrollArea>
    </MobileMenu>
  )
}
