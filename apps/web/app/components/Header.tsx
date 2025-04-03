import { GitHubLogoIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Box, Flex, IconButton, Link, Tooltip } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { href, Link as RRDLink } from 'react-router'

import { useMobileMenuContext } from '~/hooks/useMobileMenuContext'
import { cn } from '~/lib/utils'

type ScrollState = 'at-top' | 'scrolling-up' | 'scrolling-down'

export default function Header() {
  const { setOpen } = useMobileMenuContext()
  const [scrollState, setScrollState] = useState<ScrollState>('at-top')

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const direction
        = previousScrollY < window.scrollY ? 'scrolling-down' : 'scrolling-up'
      const state = window.scrollY < 30 ? 'at-top' : direction
      previousScrollY = window.scrollY
      setScrollState(state)
    }

    removeEventListener('scroll', handleScroll)

    handleScroll()
    return () => removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="h-12">
      <Box
        // TODO: own class
        className={cn(
          scrollState === 'scrolling-down' && 'duration-100',
          'fixed left-0 right-0 top-0 z-10 min-w-[320px] select-none bg-[var(--color-background)] [box-shadow:0_1px_var(--gray-a4)] [height:inherit] [transition:background-color_180ms,_box-shadow_180ms]',
        )}
      >
        <Box
          className={
            (cn(RemoveScroll.classNames.fullWidth),
            'absolute left-0 right-0 top-0 [height:inherit]')
          }
        >
          <Flex
            align="center"
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            pl="4"
          >
            <Link
              asChild
              size="6"
              weight="bold"
              underline="none"
              color="gray"
              highContrast
            >
              <RRDLink to={href('/')}>7GUIs</RRDLink>
            </Link>
          </Flex>

          <Flex
            align="center"
            gap="5"
            position="absolute"
            top="0"
            bottom="0"
            right="0"
            pr="4"
          >
            <Tooltip content="View GitHub">
              <Link
                href="https://github.com/iamvictorli/7gui"
                target="_blank"
                aria-label="View GitHub"
                rel="noreferrer"
              >
                <IconButton
                  asChild
                  size="3"
                  variant="ghost"
                  color="gray"
                  highContrast
                >
                  <GitHubLogoIcon width="24" height="24" />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip content="Navigation">
              <Box display={{ md: 'none' }} asChild>
                <IconButton
                  size="3"
                  variant="ghost"
                  color="gray"
                  onClick={() => setOpen(open => !open)}
                  aria-label="Navigation"
                >
                  <HamburgerMenuIcon width="16" height="16" />
                </IconButton>
              </Box>
            </Tooltip>
          </Flex>
        </Box>
      </Box>
    </header>
  )
}
