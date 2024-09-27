import { Slot } from '@radix-ui/react-slot'
import { Box, Portal, Theme } from '@radix-ui/themes'
import {
  MenuProvider,
  useMobileMenuContext,
} from '~/hooks/useMobileMenuContext'
import { useEffect, useState } from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { useLocation } from 'react-router-dom'

const MobileMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // closes mobile menu when location changes
    setOpen(false)
  }, [location])

  useEffect(() => {
    // Match @media (--md)
    const mediaQueryList = window.matchMedia('(min-width: 1024px)')

    const handleChange = () => {
      setOpen((open) => (open ? !mediaQueryList.matches : false))
    }

    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return (
    <MenuProvider open={open} setOpen={setOpen}>
      {children}
    </MenuProvider>
  )
}

/**
 * when mobile menu is open, overlays screen with rendered children
 */
const MobileMenuContent = ({ children }: { children: React.ReactNode }) => {
  const mobileMenu = useMobileMenuContext()

  if (!mobileMenu.open) {
    return null
  }

  return (
    <Portal>
      <Theme asChild>
        <RemoveScroll as={Slot} allowPinchZoom enabled>
          <Box
            position="fixed"
            inset="0"
            className="bg-[var(--color-background)]">
            {children}
          </Box>
        </RemoveScroll>
      </Theme>
    </Portal>
  )
}

const MobileMenu = {
  Root: MobileMenuProvider,
  Content: MobileMenuContent,
}

export default MobileMenu
